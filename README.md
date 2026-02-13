# MeshGrid Web Flasher

A modern, browser-based firmware flasher for MeshGrid LoRa mesh devices. Flash firmware directly from your browser using the Web Serial API - no installation required!

## Features

- 🌐 **Browser-based**: No installation, works directly in Chrome/Edge
- ⚡ **Fast**: Instant loading with bundled firmware files
- 🔒 **Secure**: SHA256 checksum verification for all firmware
- 🎨 **Beautiful UI**: Visual device selector with images and filter chips
- 🔧 **Multi-device Support**: ESP32, ESP32-S3, ESP32-C3 boards
- 📦 **Multiple Versions**: v0.0.5 through v0.0.8 bundled
- 🔄 **Protocol Options**: Dual, v0-only, or v1-only protocols
- 📱 **BLE Support**: Toggle Bluetooth for mobile app compatibility
- 📁 **Manual Upload**: Upload custom firmware files
- ✅ **Auto-detect**: Hardware detection and chip identification

## Browser Requirements

**Web Serial API required:**
- ✅ Chrome/Chromium 89+
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

## Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/MeshGridStack/meshgrid-flasher.git
cd meshgrid-flasher

# Install dependencies
npm install

# Download firmware files (required for first run)
./download-firmware.sh

# Start development server
npm run dev
```

Visit `http://localhost:5173` in Chrome/Edge

### Building for Production

```bash
# Build static site
npm run build

# Download firmware if not committed
./download-firmware.sh

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting service
```

## Usage

### Flashing Your Device

1. **Select Device**
   - Click "Change Device" to open device selector
   - Filter by manufacturer or chip type
   - Click your device card

2. **Configure Firmware**
   - Choose firmware version (default: latest)
   - Select protocol: Dual (recommended), v0-only, or v1-only
   - Toggle BLE if needed for smartphone apps

3. **Connect & Flash**
   - Click "Connect Device"
   - **Hold BOOT button** while connecting
   - Select your device's serial port
   - Click "Flash Firmware"
   - Wait 1-2 minutes for completion

4. **After Flashing**
   - Device may auto-reset
   - If screen stays black: unplug/replug USB or press RESET button
   - Device should boot and show MeshGrid UI

### Manual Firmware Upload

If you have a custom `.bin` file:

1. Download firmware from [GitHub Releases](https://github.com/MeshGridStack/meshgrid-firmware/releases)
2. Click "Choose .bin file" in the firmware configuration
3. Select your downloaded firmware
4. Flash as normal

## Supported Devices

### ESP32-S3 Boards
- Heltec WiFi LoRa 32 V3/V4
- LilyGo T3-S3, T-Beam Supreme
- B&Q Station G2
- Seeed XIAO ESP32S3
- And more...

### ESP32 Boards
- LilyGo T-Beam
- B&Q Nano G1, Station G1
- RAK11200
- M5Stack

### ESP32-C3 Boards
- Heltec HT62

## Firmware Versions

Currently bundled versions:
- **v0.0.8** (Latest) - 2025-01-30
- **v0.0.7** - 2025-01-29
- **v0.0.6** - 2025-01-28
- **v0.0.5** - 2025-01-27

Total: 33 firmware files (~15MB)

## Protocol Options

- **Dual Protocol (Recommended)**: Compatible with all devices, auto-switches between v0/v1
- **v1 Only**: Enhanced security with AES-256-GCM encryption
- **v0 Only**: Legacy MeshCore compatibility

## Architecture

### Tech Stack
- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **ESPTool.js 0.5.7** - ESP32 flashing library
- **Web Serial API** - Browser-device communication

### Project Structure

```
meshgrid-flasher/
├── src/
│   ├── components/
│   │   ├── DeviceSelector.jsx       # Device selection with modal
│   │   ├── DeviceSelectorModal.jsx  # Visual device picker
│   │   ├── FirmwareSelector.jsx     # Firmware options & upload
│   │   ├── FlashControls.jsx        # Connect/Flash/Erase buttons
│   │   └── Console.jsx              # Live output console
│   ├── config/
│   │   ├── devices.js               # Device configurations
│   │   └── firmware.js              # Firmware version list
│   ├── utils/
│   │   └── flasher.js               # ESPTool.js wrapper
│   ├── styles/
│   │   ├── DeviceModal.css          # Device selector styles
│   │   └── FirmwareSelector.css     # Firmware selector styles
│   ├── App.jsx                      # Main application
│   ├── App.css                      # Global styles
│   └── main.jsx                     # Entry point
├── public/
│   ├── firmware/                    # Bundled firmware files
│   │   ├── *.bin                    # Firmware binaries
│   │   └── *.sha256                 # SHA256 checksums
│   └── images/
│       └── devices/                 # Device images (SVG)
├── download-firmware.sh             # Script to download firmware
└── package.json
```

## Deployment

### GitHub Pages

```bash
npm run build
./download-firmware.sh  # If firmware not committed
npx gh-pages -d dist
```

### Netlify / Vercel

1. Connect your repository
2. Build command: `npm run build && ./download-firmware.sh`
3. Publish directory: `dist`
4. Deploy!

### Cloudflare Pages

```bash
npm run build
./download-firmware.sh
# Upload dist/ folder
```

## Development

### Adding New Firmware Versions

1. Edit `download-firmware.sh` - add new version
2. Run `./download-firmware.sh`
3. Update `src/config/firmware.js` - add version to `FIRMWARE_VERSIONS`
4. Test with new version

### Adding New Devices

1. Add device config to `src/config/devices.js`
2. Download device image to `public/images/devices/`
3. Update `download-firmware.sh` to include new device
4. Run download script

### Firmware File Handling

**Option 1: Ignore firmware files** (default)
- Firmware files in `.gitignore`
- Run `./download-firmware.sh` before deploying
- Keeps git repo small (~5MB)

**Option 2: Commit firmware files**
- Remove `public/firmware/*` from `.gitignore`
- Larger repo (~20MB) but simpler deployment
- Recommended for production deployments

**Option 3: Git LFS** (best of both)
```bash
git lfs install
git lfs track "public/firmware/*.bin"
git lfs track "public/firmware/*.sha256"
git add .gitattributes
```

## Troubleshooting

### Connection Issues
- **Hold BOOT button** while clicking "Connect Device"
- Ensure no other program is using the serial port
- Try a different USB cable (must be data cable, not charge-only)
- Close Arduino IDE, PlatformIO, or other serial tools

### Device Not Detected
- Check cable supports data transfer
- Try different USB port
- Install CP210x or CH340 drivers if needed
- Check device appears in system (Linux: `ls /dev/tty*`, macOS: `ls /dev/cu.*`)

### Flash Failed
- Verify correct device selected
- Try "Erase Flash" first, then flash again
- Ensure device is in bootloader mode (BOOT button held)
- Check browser console (F12) for detailed errors

### Device Doesn't Boot After Flash
- **Unplug and replug USB** or press RESET button
- Some devices don't auto-reset after flashing
- Black screen is normal - wait for reboot
- Check serial monitor for boot messages

### Browser Compatibility
- Use Chrome 89+ or Edge 89+ (Firefox/Safari not supported)
- Enable Web Serial in chrome://flags if needed
- Try incognito mode to rule out extension conflicts

## Technical Details

### Flash Process

1. **Chip Detection**: Auto-detect ESP32/S3/C3 chip type
2. **Stub Upload**: Upload ESPTool stub for faster flashing
3. **Firmware Load**: Load firmware from bundled files or manual upload
4. **Checksum Verify**: SHA256 verification before flashing
5. **Flash Write**: Write merged binary to address 0x0
6. **Auto-Reset**: Attempt hardware reset (may require manual reset)

### Merged Binary Format

meshgrid firmware uses **merged binaries** that include:
- Bootloader
- Partition table
- Application firmware

All flashed to address **0x0** as a single file.

### Security

- ✅ SHA256 checksum verification
- ✅ Firmware integrity checks
- ✅ No external network requests (static files)
- ✅ HTTPS recommended for production

## Contributing

Contributions welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Test thoroughly with real hardware
5. Submit a pull request

## Related Projects

- **[meshgrid-firmware](https://github.com/MeshGridStack/meshgrid-firmware)** - Multi-platform LoRa mesh firmware (72 boards)
- **[meshgrid-cli](https://github.com/MeshGridStack/meshgrid-cli)** - Command-line tool for device management

## Credits

- Built with [ESPTool.js](https://github.com/espressif/esptool-js) by Espressif
- Device images from [Meshtastic Web Flasher](https://github.com/meshtastic/web-flasher)
- Inspired by [ESP Web Tools](https://esphome.github.io/esp-web-tools/)
- Part of [MeshGrid Stack](https://github.com/MeshGridStack)

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Firmware Documentation](https://github.com/MeshGridStack/meshgrid-firmware)
- 🐛 [Report Issues](https://github.com/MeshGridStack/meshgrid-flasher/issues)
- 💬 [Discussions](https://github.com/MeshGridStack/meshgrid-firmware/discussions)

---

**Made with ❤️ by the MeshGrid Stack team**
