# MeshGrid Web Flasher

A modern web-based firmware flasher for MeshGrid LoRa mesh devices. Flash firmware directly from your browser using the Web Serial API.

## Features

- 🌐 **Browser-based**: No installation required
- ⚡ **Fast**: Direct flashing via Web Serial API
- 📦 **GitHub Integration**: Automatically fetches latest firmware releases
- 🔧 **Multi-device Support**: 72+ supported boards across ESP32, ESP32-S3, ESP32-C3 architectures
- 🔒 **Protocol Options**: Support for v0, v1, or dual protocol builds
- 📊 **Real-time Progress**: Live console output and progress tracking

## Supported Devices

### ESP32-S3 Boards
- Heltec WiFi LoRa 32 V3/V4
- LilyGo T3-S3, T-Beam Supreme
- B&Q Station G2
- Seeed XIAO ESP32S3
- And more...

### ESP32 (Original) Boards
- LilyGo T-Beam
- B&Q Nano G1, Station G1
- RAK11200
- M5Stack

### ESP32-C3 Boards
- Heltec HT62

## Browser Requirements

Web Serial API support required:
- Chrome/Chromium 89+
- Edge 89+
- Opera 75+

**Note**: Firefox and Safari do not currently support Web Serial API.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MeshGridStack/meshgrid-flasher.git
cd meshgrid-flasher

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select Device**: Choose your hardware from the dropdown
2. **Select Version**: Pick firmware version and protocol (v0/v1/dual)
3. **Connect**: Click "Connect Device" and select serial port
4. **Flash**: Click "Flash Firmware" to begin installation

## Protocol Variants

- **Dual Protocol**: Compatible with all devices (recommended)
- **v1 Only**: Enhanced security with AES-256-GCM
- **v0 Only**: Legacy MeshCore compatibility

## Architecture

### Tech Stack
- **React 19** - UI framework
- **Vite** - Build tool
- **ESPTool.js** - ESP32 flashing library
- **Web Serial API** - Browser serial communication

### Project Structure

```
meshgrid-flasher/
├── src/
│   ├── components/          # React components
│   │   ├── DeviceSelector.jsx
│   │   ├── VersionSelector.jsx
│   │   ├── FlashControls.jsx
│   │   └── Console.jsx
│   ├── config/
│   │   └── devices.js       # Device configurations
│   ├── utils/
│   │   ├── githubApi.js     # GitHub API integration
│   │   └── flasher.js       # ESPTool wrapper
│   ├── App.jsx              # Main application
│   ├── App.css              # Styles
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── package.json
```

## Deployment

### Static Hosting

Build and deploy to any static hosting service:

```bash
npm run build
# Upload dist/ folder to your hosting service
```

### Recommended Hosts
- **GitHub Pages**: Free, automatic CI/CD
- **Netlify**: Automatic deployments from git
- **Vercel**: Optimized for frontend apps
- **Cloudflare Pages**: Fast global CDN

### GitHub Pages Deployment

```bash
# Build for production
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

## Troubleshooting

### Device Not Detected
- Hold BOOT button while connecting
- Ensure no other program is using the serial port
- Try a different USB cable (must be data cable, not charge-only)

### Flash Failed
- Check device is in bootloader mode
- Try erasing flash first
- Verify correct device selected

### Browser Issues
- Enable Web Serial API in chrome://flags if needed
- Ensure browser is up to date
- Try incognito mode to rule out extensions

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Related Projects

- **[meshgrid-firmware](https://github.com/MeshGridStack/meshgrid-firmware)** - Multi-platform LoRa mesh firmware
- **[meshgrid-cli](https://github.com/MeshGridStack/meshgrid-cli)** - Command-line tool for device management

## License

MIT License - see LICENSE file for details

## Credits

- Built on [ESPTool.js](https://github.com/espressif/esptool-js)
- Inspired by [Meshtastic Web Flasher](https://flasher.meshtastic.org/)
- Part of the [MeshGrid Stack](https://github.com/MeshGridStack)
