import { useState, useMemo } from 'react';
import '../styles/DeviceModal.css';

const DeviceCard = ({ deviceId, device, isSelected, onSelect }) => {
  return (
    <div
      className={`device-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(deviceId)}
    >
      <div className="device-image">
        {device.image ? (
          <img src={device.image} alt={device.name} />
        ) : (
          <div className="device-placeholder">
            {device.name.split(' ')[0]}
          </div>
        )}
      </div>
      <div className="device-info-card">
        <h5>{device.name}</h5>
        <div className="device-badges">
          <span className="badge-chip">{device.arch}</span>
          <span className="badge-vendor">{device.name.split(' ')[0]}</span>
        </div>
        <div className="device-specs">
          <span>{device.flash_size}</span>
        </div>
      </div>
      {isSelected && (
        <div className="selected-indicator">
          <span>✓</span>
        </div>
      )}
    </div>
  );
};

export default function DeviceSelectorModal({ devices, selectedDevice, onSelect, onClose }) {
  const [filterVendor, setFilterVendor] = useState('All');
  const [filterChip, setFilterChip] = useState('All');

  // Extract unique vendors and chips
  const vendors = useMemo(() => {
    const vendorSet = new Set();
    Object.values(devices).forEach(device => {
      const vendor = device.name.split(' ')[0];
      vendorSet.add(vendor);
    });
    return ['All', ...Array.from(vendorSet).sort()];
  }, [devices]);

  const chipTypes = useMemo(() => {
    const chipSet = new Set();
    Object.values(devices).forEach(device => {
      chipSet.add(device.arch);
    });
    return ['All', ...Array.from(chipSet).sort()];
  }, [devices]);

  // Filter devices
  const filteredDevices = useMemo(() => {
    return Object.entries(devices).filter(([_, device]) => {
      const vendor = device.name.split(' ')[0];
      const vendorMatch = filterVendor === 'All' || vendor === filterVendor;
      const chipMatch = filterChip === 'All' || device.arch === filterChip;
      return vendorMatch && chipMatch;
    });
  }, [devices, filterVendor, filterChip]);

  const handleSelect = (deviceId) => {
    onSelect(deviceId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select your device</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-filters">
          <div className="filter-section">
            <label>Manufacturer:</label>
            <div className="filter-chips">
              {vendors.map(vendor => (
                <button
                  key={vendor}
                  className={`filter-chip ${filterVendor === vendor ? 'active' : ''}`}
                  onClick={() => setFilterVendor(vendor)}
                >
                  {vendor}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label>Chip Type:</label>
            <div className="filter-chips">
              {chipTypes.map(chip => (
                <button
                  key={chip}
                  className={`filter-chip ${filterChip === chip ? 'active' : ''}`}
                  onClick={() => setFilterChip(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="devices-grid">
          {filteredDevices.map(([deviceId, device]) => (
            <DeviceCard
              key={deviceId}
              deviceId={deviceId}
              device={device}
              isSelected={selectedDevice === deviceId}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="no-devices">
            <p>No devices match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
