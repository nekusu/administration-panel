import { DocumentData, Query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { CollectionDataHook, useCollectionData } from 'react-firebase-hooks/firestore';
import {
  DataOptions,
  InitialValueOptions,
} from 'react-firebase-hooks/firestore/dist/firestore/types';

export const useCollectionDataPersistent = <T = DocumentData>(
  query?: Query<T> | null,
  options?: DataOptions<T> & InitialValueOptions<T[]>,
): CollectionDataHook<T> => {
  const [_values, loading, error, snapshot] = useCollectionData<T>(query, options);
  const [values, setValues] = useState(_values);

  useEffect(() => {
    if (!loading) {
      setValues(_values ?? []);
    }
  }, [_values, loading]);
  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return [values, loading, error, snapshot];
};
