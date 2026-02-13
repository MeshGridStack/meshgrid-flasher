import { useEffect, useRef } from 'react';

export default function Console({ logs, onClear }) {
  const consoleRef = useRef(null);

  // Auto-scroll to bottom when new logs added
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="card">
      <div className="console">
        <div className="console-header">
          <span>Console Output</span>
          <button className="btn-small" onClick={onClear}>
            Clear
          </button>
        </div>
        <div className="console-content" ref={consoleRef}>
          {logs.length === 0 ? (
            <p className="console-line">Ready. Select device and firmware version, then connect.</p>
          ) : (
            logs.map((log, index) => (
              <p key={index} className={`console-line ${log.type}`}>
                <span className="console-timestamp">[{log.timestamp}]</span>{' '}
                {log.message}
              </p>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
