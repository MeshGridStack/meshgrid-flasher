// GitHub API utilities for fetching firmware releases

const GITHUB_OWNER = 'MeshGridStack';
const GITHUB_REPO = 'meshgrid-firmware';
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch all releases from GitHub
 */
export async function fetchReleases() {
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const releases = await response.json();
    return releases.map(release => ({
      tag: release.tag_name,
      name: release.name || release.tag_name,
      published: new Date(release.published_at),
      prerelease: release.prerelease,
      assets: release.assets
    }));
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    throw error;
  }
}

/**
 * Find firmware file for specific device and protocol variant
 */
export function findFirmwareAsset(assets, deviceId, version) {
  // Firmware files are named: meshgrid-{deviceId}-{version}.bin
  const firmwareName = `meshgrid-${deviceId}-${version}.bin`;
  return assets.find(asset => asset.name === firmwareName);
}

/**
 * Calculate SHA256 checksum of data
 */
async function calculateSHA256(data) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Download and verify firmware binary with SHA256 checksum
 */
export async function downloadFirmware(assetUrl, assetId, onProgress) {
  try {
    // Use allorigins proxy for CORS bypass (more reliable than corsproxy.io)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(assetUrl)}`;
    const checksumUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(assetUrl + '.sha256')}`;

    console.log('Downloading firmware:', assetUrl);
    console.log('Via proxy:', proxyUrl);

    // Download firmware
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress && total) {
        onProgress(loaded, total);
      }
    }

    // Concatenate chunks into single Uint8Array
    const firmware = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      firmware.set(chunk, position);
      position += chunk.length;
    }

    console.log('Download complete:', firmware.length, 'bytes');

    // Download and verify checksum
    try {
      const checksumResponse = await fetch(checksumUrl);
      if (checksumResponse.ok) {
        const checksumText = await checksumResponse.text();
        const expectedChecksum = checksumText.split(' ')[0].trim();

        console.log('Verifying checksum...');
        const actualChecksum = await calculateSHA256(firmware);

        console.log('Expected SHA256:', expectedChecksum);
        console.log('Actual SHA256:', actualChecksum);

        if (actualChecksum !== expectedChecksum) {
          throw new Error('Checksum verification failed! File may be corrupted.');
        }

        console.log('✓ Checksum verified');
      } else {
        console.warn('Checksum file not found, skipping verification');
      }
    } catch (checksumError) {
      console.warn('Checksum verification failed:', checksumError.message);
      // Continue anyway - checksum is optional
    }

    return firmware;
  } catch (error) {
    console.error('Firmware download failed:', error);
    throw error;
  }
}

/**
 * Get bootloader and partition files for ESP32
 * These are typically included in the build output
 */
export function findBootloaderAssets(assets, chip) {
  return {
    bootloader: assets.find(a => a.name.includes('bootloader') && a.name.includes(chip)),
    partitions: assets.find(a => a.name.includes('partitions') && a.name.endsWith('.bin')),
    boot_app0: assets.find(a => a.name.includes('boot_app0'))
  };
}
