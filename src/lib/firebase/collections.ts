import { collection } from 'firebase/firestore';
import { db } from './app';
import { clientConverter, orderConverter } from './converters';

export const clientsCollection = collection(db, 'clients').withConverter(clientConverter);

export const ordersCollection = collection(db, 'orders').withConverter(orderConverter);
