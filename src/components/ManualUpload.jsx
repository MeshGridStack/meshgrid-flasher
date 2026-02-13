import { useState } from 'react';

export default function ManualUpload({ onFileSelected, disabled }) {
  const [fileName, setFileName] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    onFileSelected(data, file.name);
  };

  return (
    <div className="manual-upload">
      <div className="upload-section">
        <label htmlFor="firmware-upload" className="upload-label">
          📁 Or upload firmware manually (.bin file)
        </label>
        <input
          id="firmware-upload"
          type="file"
          accept=".bin"
          onChange={handleFileChange}
          disabled={disabled}
          className="file-input"
        />
        {fileName && (
          <p className="file-name">Selected: {fileName}</p>
        )}
      </div>
      <p className="upload-hint">
        Download firmware from{' '}
        <a
          href="https://github.com/MeshGridStack/meshgrid-firmware/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Releases
        </a>
      </p>
    </div>
  );
}
