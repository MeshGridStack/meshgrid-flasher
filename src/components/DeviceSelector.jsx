import { useState } from 'react';
import DeviceSelectorModal from './DeviceSelectorModal';

export default function DeviceSelector({ devices, selectedDevice, onSelect }) {
  const [showModal, setShowModal] = useState(false);
  const device = devices[selectedDevice];

  return (
    <>
      <section className="card">
        <h2>Step 1: Select Your Device</h2>

        <div className="device-preview" onClick={() => setShowModal(true)}>
          <div className="device-preview-image">
            {device.image ? (
              <img src={device.image} alt={device.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div className="device-preview-placeholder">
                {device.name.split(' ')[0]}
              </div>
            )}
          </div>
          <div className="device-preview-info">
            <h3>{device.name}</h3>
            <div className="device-preview-badges">
              <span className="badge-chip">{device.arch}</span>
              <span className="badge">{device.flash_size}</span>
            </div>
          </div>
          <button className="btn-change">Change Device</button>
        </div>

        {device && (
          <div className="device-info">
            <div className="features">
              <strong>Features:</strong>{' '}
              {device.features.map((feature, index) => (
                <span key={index} className="badge">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {showModal && (
        <DeviceSelectorModal
          devices={devices}
          selectedDevice={selectedDevice}
          onSelect={onSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
