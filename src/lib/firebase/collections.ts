import { collection, CollectionReference } from 'firebase/firestore';
import { Stock } from 'types/stock';
import { db } from './app';
import {
  clientConverter,
  orderConverter,
  stockGroupConverter,
  stockItemConverter,
  stockMarkerConverter,
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
