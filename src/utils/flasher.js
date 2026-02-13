// ESPTool wrapper for web flashing
import { ESPLoader, Transport } from 'esptool-js';

export class Flasher {
  constructor() {
    this.loader = null;
    this.transport = null;
    this.device = null;
    this.connected = false;
  }

  /**
   * Connect to device via Web Serial
   */
  async connect(onLog) {
    try {
      if (!('serial' in navigator)) {
        throw new Error('Web Serial API not supported in this browser');
      }

      // Clean up any existing connection first
      await this.disconnect();

      // Request port from user
      const port = await navigator.serial.requestPort();
      this.device = port;

      // Configure transport
      this.transport = new Transport(port);

      // Create loader
      this.loader = new ESPLoader({
        transport: this.transport,
        baudrate: 115200,
        terminal: {
          clean: () => {},
          writeLine: (line) => onLog && onLog(line),
          write: (text) => onLog && onLog(text)
        }
      });

      // Connect and detect chip
      const chip = await this.loader.main();
      this.connected = true;

      onLog && onLog(`✓ Connected to ${chip}`);

      return {
        chip,
        chipId: this.loader.chipName || chip,
        macAddress: this.loader.macAddr ? this.loader.macAddr() : 'Unknown'
      };
    } catch (error) {
      console.error('Connection failed:', error);
      this.connected = false;

      // Clean up on failure
      await this.disconnect();

      throw error;
    }
  }

  /**
   * Flash firmware to device
   */
  async flash(firmwareFiles, onProgress) {
    if (!this.connected || !this.loader) {
      throw new Error('Device not connected');
    }

    try {
      // Convert Uint8Array to string format that ESPTool expects
      const fileArray = firmwareFiles.map(({ address, data }) => {
        // Convert Uint8Array to binary string if needed
        let firmwareData = data;
        if (data instanceof Uint8Array) {
          // ESPTool.js might need string format
          firmwareData = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
        }

        return {
          address: address,
          data: firmwareData
        };
      });

      // Flash files
      await this.loader.writeFlash({
        fileArray,
        flashSize: 'keep',
        eraseAll: false,
        compress: true,
        reportProgress: (fileIndex, written, total) => {
          if (onProgress) {
            const percentage = (written / total) * 100;
            onProgress(fileIndex, written, total, percentage);
          }
        }
      });

      return true;
    } catch (error) {
      console.error('Flash failed:', error);
      throw error;
    }
  }

  /**
   * Erase flash memory
   */
  async erase(onProgress) {
    if (!this.connected || !this.loader) {
      throw new Error('Device not connected');
    }

    try {
      await this.loader.eraseFlash();
      return true;
    } catch (error) {
      console.error('Erase failed:', error);
      throw error;
    }
  }

  /**
   * Reset device
   */
  async reset() {
    if (this.loader) {
      try {
        await this.loader.hardReset();
        return true;
      } catch (error) {
        console.error('Reset failed:', error);
        throw new Error('Auto-reset failed. Please manually press the RESET button or unplug/replug USB.');
      }
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect() {
    try {
      if (this.loader) {
        try {
          await this.reset();
        } catch (e) {
          // Ignore reset errors during disconnect
        }
      }

      if (this.transport) {
        try {
          await this.transport.disconnect();
        } catch (e) {
          // Ignore transport disconnect errors
        }
      }

      if (this.device && this.device.readable) {
        try {
          await this.device.close();
        } catch (e) {
          // Ignore port close errors
        }
      }

      this.connected = false;
      this.loader = null;
      this.transport = null;
      this.device = null;
    } catch (error) {
      console.error('Disconnect failed:', error);
      // Force cleanup even if errors occur
      this.connected = false;
      this.loader = null;
      this.transport = null;
      this.device = null;
    }
  }

  /**
   * Check if Web Serial API is supported
   */
  static isSupported() {
    return 'serial' in navigator;
  }
}
