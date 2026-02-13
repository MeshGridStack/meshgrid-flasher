export default function VersionSelector({
  selectedProtocol = 'dual',
  onSelectProtocol,
  protocolVariants = {},
  selectedDevice,
  devices = {},
  enableBLE = false,
  onToggleBLE,
  firmwareVersion
}) {
  const device = devices[selectedDevice];
  const supportsBLE = device?.supportsBLE || false;

  return (
    <section className="card">
      <h2>Step 2: Select Firmware Options</h2>

      <div className="info-box" style={{ marginBottom: '1rem' }}>
        <strong>📦 Firmware Version: {firmwareVersion}</strong>
      </div>

      <div className="form-group">
        <label htmlFor="protocol-select">Protocol version:</label>
        <select
          id="protocol-select"
          className="select-input"
          value={selectedProtocol}
          onChange={(e) => onSelectProtocol(e.target.value)}
        >
          {Object.entries(protocolVariants).map(([key, variant]) => (
            <option key={key} value={key}>
              {variant.name}
            </option>
          ))}
        </select>
      </div>

      {supportsBLE && (
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={enableBLE}
              onChange={(e) => onToggleBLE(e.target.checked)}
            />
            <span>Enable Bluetooth (BLE)</span>
          </label>
          <p className="checkbox-hint">
            Enable BLE for smartphone app compatibility
          </p>
        </div>
      )}

      <div className="info-box">
        <strong>Firmware Options:</strong>
        <ul>
          <li>
            <strong>Dual Protocol:</strong> Works with all devices (recommended)
          </li>
          <li>
            <strong>v1 Only:</strong> Enhanced security (AES-256-GCM)
          </li>
          <li>
            <strong>v0 Only:</strong> MeshCore compatibility only
          </li>
          {supportsBLE && (
            <li>
              <strong>BLE:</strong> Enables Bluetooth for mobile app connectivity
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
