import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { Client } from 'types/client';
import { Order } from 'types/order';

export const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore({ name }: WithFieldValue<Client>): DocumentData {
    return { name };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Client {
    const { name } = snapshot.data(options);
    return { id: snapshot.id, name };
  },
};

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore({
    clientId,
    status,
    price,
    receivedTimestamp,
    deliveredTimestamp,
  }: WithFieldValue<Order>): DocumentData {
    return { clientId, status, price, receivedTimestamp, deliveredTimestamp };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Order {
    const { clientId, status, price, receivedTimestamp, deliveredTimestamp } =
      snapshot.data(options);
    return { id: snapshot.id, clientId, status, price, receivedTimestamp, deliveredTimestamp };
  },
};
