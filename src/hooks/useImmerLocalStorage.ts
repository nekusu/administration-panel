import { useLocalStorage } from '@mantine/hooks';
import { IStorageProperties } from '@mantine/hooks/lib/use-local-storage/create-storage';
import { freeze, produce } from 'immer';
import { useCallback } from 'react';
import { DraftFunction, Updater } from 'use-immer';

export default function useImmerLocalStorage<T>(props: IStorageProperties<T>) {
  const [value, setValue] = useLocalStorage<T>(props);
  const setImmerValue: Updater<T> = useCallback(
    (updater) => {
      if (typeof updater === 'function') setValue(produce(updater as DraftFunction<T>));
      else setValue(freeze(updater));
    },
    [setValue]
  );
  return [value, setImmerValue] as const;
}
