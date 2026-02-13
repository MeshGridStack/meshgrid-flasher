// Device configurations for MeshGrid firmware
export const devices = {
  // ESP32-S3 Boards
  heltec_v3: {
    name: 'Heltec WiFi LoRa 32 V3',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '8MB',
    features: ['OLED Display', 'SX1262 LoRa'],
    partitions: 'partitions_4mb_ota.csv',
    image: '/images/devices/heltec-v3.svg',
    supportsBLE: true
  },
  heltec_v4: {
    name: 'Heltec WiFi LoRa 32 V4',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '8MB',
    features: ['OLED Display', 'SX1262 LoRa', 'USB CDC'],
    partitions: 'partitions_8mb_ota.csv',
    image: '/images/devices/heltec_v4.svg',
    supportsBLE: true
  },
  lilygo_t3s3: {
    name: 'LilyGo T3-S3',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '16MB',
    features: ['OLED Display', 'SX1262 LoRa', 'PSRAM'],
    partitions: 'default',
    image: '/images/devices/tlora-t3s3-v1.svg',
    supportsBLE: true
  },
  lilygo_tbeam_supreme: {
    name: 'LilyGo T-Beam Supreme',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '8MB',
    features: ['SX1262 LoRa', 'GPS'],
    partitions: 'default',
    image: '/images/devices/tbeam-s3-core.svg'
  },
  station_g2: {
    name: 'B&Q Station G2',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '8MB',
    features: ['OLED Display', 'SX1262 LoRa'],
    partitions: 'default',
    image: '/images/devices/station-g2.svg'
  },
  seeed_xiao_esp32s3: {
    name: 'Seeed XIAO ESP32S3',
    chip: 'esp32s3',
    arch: 'ESP32-S3',
    flash_size: '8MB',
    features: ['Compact', 'SX1262 LoRa'],
    partitions: 'default',
    image: '/images/devices/seeed-xiao-s3.svg'
  },

  // ESP32 (Original) Boards
  lilygo_tbeam: {
    name: 'LilyGo T-Beam',
    chip: 'esp32',
    arch: 'ESP32',
    flash_size: '4MB',
    features: ['OLED Display', 'SX1276 LoRa', 'GPS', 'AXP192/AXP2101'],
    partitions: 'partitions_4mb_ota.csv',
    image: '/images/devices/tbeam.svg'
  },
  nano_g1: {
    name: 'B&Q Nano G1',
    chip: 'esp32',
    arch: 'ESP32',
    flash_size: '4MB',
    features: ['SX1262 LoRa', 'Compact'],
    partitions: 'default',
    image: '/images/devices/unknown.svg'
  },
  station_g1: {
    name: 'B&Q Station G1',
    chip: 'esp32',
    arch: 'ESP32',
    flash_size: '4MB',
    features: ['OLED Display', 'SX1262 LoRa'],
    partitions: 'default',
    image: '/images/devices/unknown.svg'
  },
  rak11200: {
    name: 'RAK11200',
    chip: 'esp32',
    arch: 'ESP32',
    flash_size: '4MB',
    features: ['SX1262 LoRa'],
    partitions: 'default',
    image: '/images/devices/rak11200.svg'
  },
  m5stack: {
    name: 'M5Stack',
    chip: 'esp32',
    arch: 'ESP32',
    flash_size: '4MB',
    features: ['TFT Display', 'SX1276 LoRa'],
    partitions: 'default',
    image: '/images/devices/unknown.svg'
  },

  // ESP32-C3 Boards
  heltec_ht62: {
    name: 'Heltec HT62',
    chip: 'esp32c3',
    arch: 'ESP32-C3',
    flash_size: '4MB',
    features: ['SX1262 LoRa', 'Compact', 'RISC-V'],
    partitions: 'default',
    image: '/images/devices/heltec-ht62-esp32c3-sx1262.svg'
  }
};

// Protocol variants
export const protocolVariants = {
  dual: {
    name: 'Dual Protocol (v0 + v1)',
    suffix: '',
    description: 'Works with all devices (recommended)'
  },
  v1only: {
    name: 'v1 Only',
    suffix: '_v1only',
    description: 'Enhanced security (AES-256-GCM)'
  },
  v0only: {
    name: 'v0 Only',
    suffix: '_v0only',
    description: 'MeshCore compatibility only'
  }
};

// Firmware flash addresses for ESP32 devices
// NOTE: meshgrid firmware uses MERGED binaries (bootloader + partitions + app)
// so we flash the entire .bin file at address 0x0
export const flashAddresses = {
  merged: 0x0  // Merged binary includes bootloader, partitions, and app
};
