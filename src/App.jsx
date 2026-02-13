import { useState, useEffect, useRef } from 'react';
import './App.css';
import { devices, protocolVariants, flashAddresses } from './config/devices';
import { loadFirmware, FIRMWARE_VERSIONS } from './config/firmware';
import { Flasher } from './utils/flasher';
import DeviceSelector from './components/DeviceSelector';
import FirmwareSelector from './components/FirmwareSelector';
import FlashControls from './components/FlashControls';
import Console from './components/Console';

function App() {
  const [selectedDevice, setSelectedDevice] = useState('heltec_v3');
  const [selectedVersion, setSelectedVersion] = useState(FIRMWARE_VERSIONS[0].version);
  const [selectedProtocol, setSelectedProtocol] = useState('dual');
  const [enableBLE, setEnableBLE] = useState(false);
  const [connected, setConnected] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [manualFirmware, setManualFirmware] = useState(null);
  const flasherRef = useRef(null);

  // Check browser compatibility and secure context
  const isSupported = Flasher.isSupported();
  const isSecureContext = window.isSecureContext;
  const showSecurityWarning = isSupported && !isSecureContext;

  useEffect(() => {
    addLog(`✓ Firmware versions ready`);
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const clearLogs = () => setLogs([]);

  const handleConnect = async () => {
    try {
      if (!flasherRef.current) {
        flasherRef.current = new Flasher();
      }

      addLog('Requesting device access...');
      const deviceInfo = await flasherRef.current.connect(addLog);
      setConnected(true);
      addLog(`✓ Connected: ${deviceInfo.chip}`, 'success');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      addLog(`✗ Connection failed: ${errorMsg}`, 'error');

      // Provide helpful hints for common connection issues
      if (errorMsg.includes('Failed to connect') || errorMsg.includes('No serial data')) {
        addLog('💡 Tip: Hold the BOOT button and try connecting again', 'info');
      } else if (errorMsg.includes('port is already open')) {
        addLog('💡 Tip: Wait a moment and try again', 'info');
      }

      setConnected(false);
    }
  };

  const handleDisconnect = async () => {
    if (flasherRef.current) {
      await flasherRef.current.disconnect();
      setConnected(false);
      addLog('✓ Disconnected', 'info');
    }
  };

  const handleFlash = async () => {
    if (!connected || !flasherRef.current) {
      addLog('✗ Device not connected', 'error');
      return;
    }

    try {
      setFlashing(true);
      setProgress(0);
      addLog('Starting flash process...');

      let firmwareData;
      let checksumVerified = false;

      // Use manual firmware if uploaded
      if (manualFirmware) {
        addLog(`Using manually uploaded firmware`);
        firmwareData = manualFirmware;
        addLog(`✓ Firmware ready: ${(firmwareData.length / 1024).toFixed(1)} KB`);
      } else {
        // Load from local static files
        addLog(`Loading firmware v${selectedVersion}...`);
        const protocolSuffix = protocolVariants[selectedProtocol].suffix;
        const result = await loadFirmware(selectedDevice, protocolSuffix, enableBLE, selectedVersion);
        firmwareData = result.data;
        checksumVerified = result.checksumVerified;

        addLog(`✓ Loaded ${(firmwareData.length / 1024).toFixed(1)} KB`);
        if (checksumVerified) {
          addLog('✓ Checksum verified', 'success');
        }
      }

      // Prepare merged binary for flashing at 0x0
      // meshgrid firmware uses merged binaries (bootloader + partitions + app)
      const filesToFlash = [
        { address: flashAddresses.merged, data: firmwareData }
      ];

      addLog('Flashing firmware...');

      // Flash
      await flasherRef.current.flash(filesToFlash, (fileIndex, written, total, percentage) => {
        setProgress(percentage);
        if (percentage % 10 === 0) {
          addLog(`Flash progress: ${percentage.toFixed(1)}%`);
        }
      });

      addLog('✓ Flash complete!', 'success');
      addLog('Resetting device...');

      try {
        await flasherRef.current.reset();
        addLog('✓ Device reset - should reboot now', 'success');
      } catch (resetError) {
        addLog('⚠ Auto-reset failed - please press RESET button or unplug/replug USB', 'info');
      }

      setProgress(100);

    } catch (error) {
      addLog(`✗ Flash failed: ${error.message}`, 'error');
      console.error(error);
    } finally {
      setFlashing(false);
    }
  };

  const handleErase = async () => {
    if (!connected || !flasherRef.current) {
      addLog('✗ Device not connected', 'error');
      return;
    }

    if (!confirm('This will erase all data on the device. Continue?')) {
      return;
    }

    try {
      setFlashing(true);
      addLog('Erasing flash memory...');
      await flasherRef.current.erase();
      addLog('✓ Erase complete', 'success');
    } catch (error) {
      addLog(`✗ Erase failed: ${error.message}`, 'error');
    } finally {
      setFlashing(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('This will disconnect the device and clear the console. Continue?')) {
      return;
    }

    await handleDisconnect();
    clearLogs();
    setProgress(0);
    addLog('✓ Reset complete - Ready to start fresh', 'success');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌐 MeshGrid Web Flasher</h1>
        <p className="subtitle">Flash LoRa mesh firmware directly from your browser</p>
      </header>

      {!isSupported && (
        <div className="card warning">
          <h3>⚠️ Browser Not Supported</h3>
          <p>Web Serial API is required. Please use Chrome 89+, Edge 89+, or Opera 75+</p>
        </div>
      )}

      {showSecurityWarning && (
        <div className="card warning">
          <h3>🔒 HTTPS Required</h3>
          <p>
            Web Serial API requires a secure context (HTTPS). This page is currently accessed via HTTP.
          </p>
          <p>
            <strong>Solutions:</strong>
          </p>
          <ul>
            <li>Use <code>https://</code> instead of <code>http://</code></li>
            <li>Or access via <code>http://localhost</code> for development</li>
            <li>Deploy to GitHub Pages, Netlify, or Vercel (auto-HTTPS)</li>
          </ul>
        </div>
      )}

      <main className="main">
        <DeviceSelector
          devices={devices}
          selectedDevice={selectedDevice}
          onSelect={setSelectedDevice}
        />

        <FirmwareSelector
          selectedProtocol={selectedProtocol}
          onSelectProtocol={setSelectedProtocol}
          protocolVariants={protocolVariants}
          enableBLE={enableBLE}
          onToggleBLE={setEnableBLE}
          supportsBLE={devices[selectedDevice]?.supportsBLE}
          onManualUpload={(data, name) => {
            setManualFirmware(data);
            addLog(`✓ Custom firmware loaded: ${name} (${(data.length / 1024).toFixed(1)} KB)`, 'success');
          }}
          firmwareVersions={FIRMWARE_VERSIONS}
          selectedVersion={selectedVersion}
          onSelectVersion={setSelectedVersion}
        />

        <FlashControls
          connected={connected}
          flashing={flashing}
          progress={progress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onFlash={handleFlash}
          onErase={handleErase}
          onReset={handleReset}
          isSupported={isSupported}
        />

        <Console logs={logs} onClear={clearLogs} />

        <section className="card">
          <h2>📖 Instructions</h2>
          <ol>
            <li>Select your device type from the dropdown</li>
            <li>Choose firmware version and protocol</li>
            <li>Click "Connect Device" and select your device's serial port</li>
            <li>Click "Flash Firmware" to begin installation</li>
            <li>Wait for flashing to complete (1-2 minutes)</li>
          </ol>

          <div className="info-box">
            <strong>💡 Troubleshooting:</strong>
            <ul>
              <li>Hold BOOT button while connecting if connection fails</li>
              <li>Close other programs using the serial port</li>
              <li>Some devices require manual reset after flashing</li>
              <li>Use USB data cable (not charge-only)</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          MeshGrid Web Flasher |{' '}
          <a href="https://github.com/MeshGridStack/meshgrid-firmware" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> |{' '}
          <a href="https://github.com/MeshGridStack/meshgrid-cli" target="_blank" rel="noopener noreferrer">
            CLI Tool
          </a>
        </p>
        <p className="small">Powered by Web Serial API & ESPTool.js</p>
      </footer>
    </div>
  );
}

export default App;
