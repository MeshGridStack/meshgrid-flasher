// Static firmware configuration
export const FIRMWARE_VERSION = '0.0.8';

// Available firmware versions (statically bundled)
export const FIRMWARE_VERSIONS = [
  { version: '0.0.8', name: 'Release 0.0.8', date: '2025-01-30', latest: true },
  { version: '0.0.7', name: 'Release 0.0.7', date: '2025-01-29' },
  { version: '0.0.6', name: 'Release 0.0.6', date: '2025-01-28' },
  { version: '0.0.5', name: 'Release 0.0.5', date: '2025-01-27' },
];

// List of available firmware files (statically bundled)
export const availableFirmware = [
  // Heltec V3
  'meshgrid-heltec_v3-0.0.8.bin',
  'meshgrid-heltec_v3_ble-0.0.8.bin',
  'meshgrid-heltec_v3_v0only-0.0.8.bin',
  'meshgrid-heltec_v3_v1only-0.0.8.bin',

  // Heltec V4
  'meshgrid-heltec_v4-0.0.8.bin',

  // LilyGo T3-S3
  'meshgrid-lilygo_t3s3-0.0.8.bin',
  'meshgrid-lilygo_t3s3_ble-0.0.8.bin',
  'meshgrid-lilygo_t3s3_v0only-0.0.8.bin',
  'meshgrid-lilygo_t3s3_v1only-0.0.8.bin',

  // Other ESP32-S3
  'meshgrid-lilygo_tbeam_supreme-0.0.8.bin',
  'meshgrid-station_g2-0.0.8.bin',
  'meshgrid-seeed_xiao_esp32s3-0.0.8.bin',

  // ESP32
  'meshgrid-lilygo_tbeam-0.0.8.bin',
  'meshgrid-lilygo_tbeam_v1only-0.0.8.bin',
  'meshgrid-nano_g1-0.0.8.bin',
  'meshgrid-station_g1-0.0.8.bin',
  'meshgrid-rak11200-0.0.8.bin',
  'meshgrid-m5stack-0.0.8.bin',

  // ESP32-C3
  'meshgrid-heltec_ht62-0.0.8.bin'
];

/**
 * Calculate SHA256 checksum
 */
export async function calculateSHA256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Load firmware from local static files
 */
export async function loadFirmware(deviceId, protocolSuffix, enableBLE, version = FIRMWARE_VERSION) {
  const bleSuffix = enableBLE ? '_ble' : '';
  const firmwareId = `${deviceId}${protocolSuffix}${bleSuffix}`;
  const filename = `meshgrid-${firmwareId}-${version}.bin`;

  const firmwareUrl = `/firmware/${filename}`;
  const checksumUrl = `/firmware/${filename}.sha256`;

  console.log('Loading firmware from:', firmwareUrl);

  // Load firmware with cache busting
  const response = await fetch(firmwareUrl, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache'
    }
  });
  if (!response.ok) {
    throw new Error(`Firmware ${filename} not found`);
  }

  const firmwareData = new Uint8Array(await response.arrayBuffer());

  // Verify checksum
  try {
    const checksumResponse = await fetch(checksumUrl);
    if (checksumResponse.ok) {
      const checksumText = await checksumResponse.text();
      const expectedChecksum = checksumText.split(' ')[0].trim();
      const actualChecksum = await calculateSHA256(firmwareData);

      if (actualChecksum !== expectedChecksum) {
        throw new Error('Checksum verification failed');
      }

      return { data: firmwareData, filename, checksumVerified: true };
    }
  } catch (e) {
    // Checksum optional
  }

  return { data: firmwareData, filename, checksumVerified: false };
}
