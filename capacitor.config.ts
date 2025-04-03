import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hushhly.app',
  appName: 'Hushhly',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config; 