#!/bin/bash
# Download firmware files from GitHub releases

VERSION="0.0.8"
BASE_URL="https://github.com/MeshGridStack/meshgrid-firmware/releases/download/${VERSION}"
FIRMWARE_DIR="public/firmware"

mkdir -p "$FIRMWARE_DIR"
cd "$FIRMWARE_DIR" || exit

echo "Downloading firmware files for version ${VERSION}..."

# ESP32-S3 devices
devices=(
  "heltec_v3"
  "heltec_v3_ble"
  "heltec_v3_v0only"
  "heltec_v3_v1only"
  "heltec_v4"
  "lilygo_t3s3"
  "lilygo_t3s3_ble"
  "lilygo_t3s3_v0only"
  "lilygo_t3s3_v1only"
  "lilygo_tbeam_supreme"
  "station_g2"
  "seeed_xiao_esp32s3"

  # ESP32 devices
  "lilygo_tbeam"
  "lilygo_tbeam_v1only"
  "nano_g1"
  "station_g1"
  "rak11200"
  "m5stack"

  # ESP32-C3 devices
  "heltec_ht62"
)

for device in "${devices[@]}"; do
  filename="meshgrid-${device}-${VERSION}.bin"
  url="${BASE_URL}/${filename}"

  echo "Downloading ${filename}..."
  curl -sL -O "$url" || echo "  ⚠ Failed to download ${filename}"
done

echo ""
echo "✓ Download complete!"
echo ""
ls -lh *.bin | awk '{print $9, "-", $5}'
echo ""
echo "Total size:"
du -sh .
