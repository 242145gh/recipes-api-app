import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'low-potassium-diet',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
