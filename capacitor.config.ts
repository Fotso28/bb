import { CapacitorConfig } from '@capacitor/cli';
import { CapacitorSQLite} from '@capacitor-community/sqlite';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'tabs',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: false,
      iosKeychainPrefix: 'angular-sqlite-app-starter',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle : "Biometric login for capacitor sqlite"
      },
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth : false,
        biometricTitle : "Biometric login for capacitor sqlite",
        biometricSubTitle : "Log in using your biometric"
      }
    }
  }
};

export default config;
