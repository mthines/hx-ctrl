import localForage from 'localforage';
import { isType } from '@hx-ctrl/utils/common';

const isServer = typeof window === 'undefined';

/**
 * LocalForage Helper function using the JSON.parse/stringify based on the context
 */
const localforage = {
  /**
   * Get a specific item from localforage based on the key
   * @param key Localforage Key
   * @param callback Callback when done
   */
  getItem: async <TType, TKey extends string = string, TError = unknown>(
    key: TKey,
    callback?: (err: TError, value: TType | null) => void,
  ): Promise<TType | null | void> => {
    if (isServer) return;

    try {
      const item = await localForage.getItem<TType>(key, callback);

      return (isType<string>(item, item !== null) && JSON.parse(item)) || null;
    } catch (err) {
      console.warn(`localforage.getItem: ${err}`);
    }
  },

  /**
   * Set a specific item from localforage based on the key
   * @param key Localforage Key
   * @param value Localforage value that you want to set in the store.
   * @param callback Callback when done
   */
  setItem: async <TType, TKey extends string = string, TError = unknown>(
    key: TKey,
    value: TType,
    callback?: (err: TError, value: TType) => void,
  ): Promise<TType | void> => {
    if (isServer) return;

    try {
      const _value = JSON.stringify(value) as unknown as TType;
      const item = await localForage.setItem<TType>(key, _value, callback);

      return item;
    } catch (err) {
      console.warn(`localforage.setItem: ${err}`);
    }
  },
  /**
   * Remove a specific item from localforage based on the key
   * @param key Localforage Key
   * @param callback Callback when done
   */
  removeItem: async <TKey extends string = string, TError = unknown>(
    key: TKey,
    callback?: (err: TError) => void,
  ): Promise<void> => {
    if (isServer) return;

    try {
      await localForage.removeItem(key, callback);
    } catch (err) {
      console.warn(`localforage.removeItem: ${err}`);
    }
  },
};

export default localforage;

/**
 * Localforage Hook
 * Returning the helper function from the utils file
 */
export const useLocalforage = () => {
  const getItem = localforage.getItem;
  const setItem = localforage.setItem;
  const removeItem = localforage.removeItem;

  return {
    getItem,
    setItem,
    removeItem,
  };
};
