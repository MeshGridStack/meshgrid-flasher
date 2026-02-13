import { useState } from 'react';
import '../styles/FirmwareSelector.css';

export default function FirmwareSelector({
  selectedProtocol,
  onSelectProtocol,
  protocolVariants,
  enableBLE,
  onToggleBLE,
  supportsBLE,
  onManualUpload,
  firmwareVersions,
  selectedVersion,
  onSelectVersion
}) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFile(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    onManualUpload(data, file.name);
  };

  return (
    <section className="card">
      <h2>Step 2: Firmware Configuration</h2>

      <div className="form-group">
        <label htmlFor="version-select">Firmware Version:</label>
        <select
          id="version-select"
          className="select-input"
          value={selectedVersion}
          onChange={(e) => onSelectVersion(e.target.value)}
        >
          {firmwareVersions.map((ver) => (
            <option key={ver.version} value={ver.version}>
              {ver.name} {ver.latest ? '(Latest)' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="firmware-options">
        <div className="option-group">
          <label className="option-label">Protocol Version:</label>
          <div className="protocol-cards">
            {Object.entries(protocolVariants).map(([key, variant]) => (
              <button
                key={key}
                className={`protocol-card ${selectedProtocol === key ? 'selected' : ''}`}
                onClick={() => onSelectProtocol(key)}
              >
                <div className="protocol-card-header">
                  <span className="protocol-name">{variant.name}</span>
                  {selectedProtocol === key && <span className="check-icon">✓</span>}
                </div>
                <div className="protocol-description">{variant.description}</div>
              </button>
            ))}
          </div>
        </div>

        {supportsBLE && (
          <div className="option-group">
            <label className="option-label">Bluetooth:</label>
            <button
              className={`ble-toggle ${enableBLE ? 'enabled' : ''}`}
              onClick={() => onToggleBLE(!enableBLE)}
            >
              <span className="toggle-icon">{enableBLE ? '✓' : ''}</span>
              <div className="toggle-content">
                <span className="toggle-title">Enable Bluetooth (BLE)</span>
                <span className="toggle-hint">For smartphone app connectivity</span>
              </div>
            </button>
          </div>
        )}

        <div className="option-group">
          <label className="option-label">Manual Upload (Optional):</label>
          <div className="upload-area">
            <p className="upload-hint-top">
              Upload custom firmware from{' '}
              <a
                href="https://github.com/MeshGridStack/meshgrid-firmware/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Releases
              </a>
            </p>
            <input
              type="file"
              accept=".bin"
              onChange={handleFileChange}
              className="file-input-hidden"
              id="firmware-file"
            />
            <label htmlFor="firmware-file" className="upload-button">
              <span className="upload-icon">📁</span>
              <span>Choose .bin file</span>
            </label>
            {uploadedFile && (
              <div className="uploaded-file">
                <span className="file-icon">✓</span>
                <span className="file-name">{uploadedFile}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
