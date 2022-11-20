import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { Client } from 'types/client';
import { Order } from 'types/order';
import { Stock } from 'types/stock';

export const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(data: WithFieldValue<Client>): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Client {
    const { name } = snapshot.data(options);
    return { id: snapshot.id, name };
  },
};

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore(data: WithFieldValue<Order>): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Order {
    const { clientId, status, price, receivedTimestamp, deliveredTimestamp } =
      snapshot.data(options);
    return { id: snapshot.id, clientId, status, price, receivedTimestamp, deliveredTimestamp };
  },
};

export const stockGroupConverter: FirestoreDataConverter<Stock.Group> = {
  toFirestore(data: WithFieldValue<Stock.Group>): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Stock.Group {
    const { name } = snapshot.data(options);
    return { id: snapshot.id, name };
  },
};

export const stockItemConverter: FirestoreDataConverter<Stock.Item> = {
  toFirestore(data: WithFieldValue<Stock.Item>): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Stock.Item {
    const { code, quantity, color } = snapshot.data(options);
    return { id: snapshot.id, code, quantity, color };
  },
};

export const stockMarkerConverter: FirestoreDataConverter<Stock.Marker> = {
  toFirestore(data: WithFieldValue<Stock.Marker>): DocumentData {
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Stock.Marker {
    const { color, name, value } = snapshot.data(options);
    return { id: snapshot.id, color, name, value };
  },
};
