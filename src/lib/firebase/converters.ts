import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { Client } from 'types/client';
import { Deposit, Expense, Tag } from 'types/expense';
import { Order } from 'types/order';
import * as Stock from 'types/stock';

export const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore: (data: WithFieldValue<Client>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Client>, options: SnapshotOptions): Client {
    const { name } = snapshot.data(options);
    return { id: snapshot.id, name };
  },
};

export const orderConverter: FirestoreDataConverter<Order> = {
  toFirestore: (data: WithFieldValue<Order>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Order>, options: SnapshotOptions): Order {
    const { clientId, status, price, receivedTimestamp, deliveredTimestamp } =
      snapshot.data(options);
    return { id: snapshot.id, clientId, status, price, receivedTimestamp, deliveredTimestamp };
  },
};

export const stockGroupConverter: FirestoreDataConverter<Stock.Group> = {
  toFirestore: (data: WithFieldValue<Stock.Group>) => data,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<Stock.Group>,
    options: SnapshotOptions
  ): Stock.Group {
    const { name } = snapshot.data(options);
    return { id: snapshot.id, name };
  },
};

export const stockItemConverter: FirestoreDataConverter<Stock.Item> = {
  toFirestore: (data: WithFieldValue<Stock.Item>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Stock.Item>, options: SnapshotOptions): Stock.Item {
    const { code, quantity, color } = snapshot.data(options);
    return { id: snapshot.id, code, quantity, color };
  },
};

export const stockMarkerConverter: FirestoreDataConverter<Stock.Marker> = {
  toFirestore: (data: WithFieldValue<Stock.Marker>) => data,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<Stock.Marker>,
    options: SnapshotOptions
  ): Stock.Marker {
    const { color, name, value } = snapshot.data(options);
    return { id: snapshot.id, color, name, value };
  },
};

export const expenseConverter: FirestoreDataConverter<Expense> = {
  toFirestore: (data: WithFieldValue<Expense>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Expense>, options: SnapshotOptions): Expense {
    const { tagIds, description, amount, date, deductFromFunds } = snapshot.data(options);
    return { id: snapshot.id, tagIds, description, amount, date, deductFromFunds };
  },
};

export const tagConverter: FirestoreDataConverter<Tag> = {
  toFirestore: (data: WithFieldValue<Tag>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Tag>, options: SnapshotOptions): Tag {
    const { name, color } = snapshot.data(options);
    return { id: snapshot.id, name, color };
  },
};

export const depositConverter: FirestoreDataConverter<Deposit> = {
  toFirestore: (data: WithFieldValue<Deposit>) => data,
  fromFirestore(snapshot: QueryDocumentSnapshot<Deposit>, options: SnapshotOptions): Deposit {
    const { amount, date } = snapshot.data(options);
    return { id: snapshot.id, amount, date };
  },
};
