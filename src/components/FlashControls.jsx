export default function FlashControls({
  connected,
  flashing,
  progress,
  onConnect,
  onDisconnect,
  onFlash,
  onErase,
  onReset,
  isSupported
}) {
  return (
    <section className="card">
      <h2>Step 3: Flash Device</h2>

      <div className="flash-controls">
        {!connected ? (
          <button
            className="btn btn-primary"
            onClick={onConnect}
            disabled={flashing || !isSupported}
          >
            <span className="btn-icon">🔌</span>
            Connect Device
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={onDisconnect}
            disabled={flashing}
          >
            <span className="btn-icon">🔌</span>
            Disconnect
          </button>
        )}

        <button
          className="btn btn-success"
          onClick={onFlash}
          disabled={!connected || flashing}
        >
          <span className="btn-icon">⚡</span>
          {flashing ? 'Flashing...' : 'Flash Firmware'}
        </button>

        <button
          className="btn btn-danger"
          onClick={onErase}
          disabled={!connected || flashing}
        >
          <span className="btn-icon">🗑️</span>
          Erase Flash
        </button>

        {connected && (
          <button
            className="btn btn-warning"
            onClick={onReset}
            disabled={flashing}
          >
            <span className="btn-icon">🔄</span>
            Reset & Clear
          </button>
        )}
      </div>

      {flashing && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-text">{progress.toFixed(1)}%</p>
        </div>
      )}
    </section>
  );
}
