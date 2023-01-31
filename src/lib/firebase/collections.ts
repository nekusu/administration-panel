import { collection, CollectionReference } from 'firebase/firestore';
import * as Stock from 'types/stock';
import { db } from './app';
import {
  clientConverter,
  expenseConverter,
  orderConverter,
  stockGroupConverter,
  stockItemConverter,
  stockMarkerConverter,
  tagConverter,
} from './converters';

export const clientsCollection = collection(db, 'clients').withConverter(clientConverter);

export const ordersCollection = collection(db, 'orders').withConverter(orderConverter);

export const stockGroupsCollection = collection(db, 'groups').withConverter(stockGroupConverter);

export function stockItemsCollection(stockGroupId: string): CollectionReference<Stock.Item> {
  return collection(db, `groups/${stockGroupId}/items`).withConverter(stockItemConverter);
}

export function stockMarkersCollection(stockGroupId: string): CollectionReference<Stock.Marker> {
  return collection(db, `groups/${stockGroupId}/markers`).withConverter(stockMarkerConverter);
}

export const expensesCollection = collection(db, 'expenses').withConverter(expenseConverter);

export const tagsCollection = collection(db, 'tags').withConverter(tagConverter);
