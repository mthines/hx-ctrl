import { AtomEffect, DefaultValue } from 'recoil';

import localforage from './localforage';

/** Check if there's an initial value persisted and load it on set  */
const loadPersisted = async <TData>({
  key,
  setSelf,
}: {
  key: string;
  setSelf: Parameters<AtomEffect<TData>>['0']['setSelf'];
}) => {
  const savedValue = await localforage.getItem<TData>(key);

  if (savedValue && savedValue != null) {
    setSelf(savedValue);
  }
};

/**
 * Persist the Localforage Atom Effect
 *
 * Add to `effects_UNSTABLE` to persist atom.
 * Side-effect for Atom Manipulating
 * @see https://recoiljs.org/docs/guides/atom-effects/
 *
 * @param key The key of that you want to persist
 * @param onSet Callback to manipulate the data before saving value to Localforage
 * @param onGet Callback to manipulate the data before getting value from Localforage
 */
export const persistAtomEffect = <TData>({ setSelf, onSet, node }: Parameters<AtomEffect<TData>>[0]) => {
  loadPersisted({ key: node.key, setSelf });

  onSet(async (newValue) => {
    if (newValue instanceof DefaultValue) {
      await localforage.removeItem(node.key);
    } else {
      await localforage.setItem(node.key, newValue);
    }
  });
};
