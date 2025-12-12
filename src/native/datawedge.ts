import { NativeModules } from 'react-native';

const { DataWedgeConfig } = NativeModules as {
    DataWedgeConfig: { ensureProfile: () => void };
};

export function ensureDataWedgeProfile() {
    DataWedgeConfig.ensureProfile();
}
