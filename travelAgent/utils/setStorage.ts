import AsyncStorage from '@react-native-async-storage/async-storage';

// To save data:
interface StorageValue {
    value: string;
}

const storeData = async ({ value }: StorageValue): Promise<void> => {
    try {
        await AsyncStorage.setItem('my-key', value);
    } catch (e) {
        // saving error
    }
};

// To retrieve data when the app loads:
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('my-key');
    if (value !== null) {
      // value previously stored
    }
  } catch (e) {
    // error reading value
  }
};
