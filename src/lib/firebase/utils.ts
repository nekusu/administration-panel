import {
  addDoc,
  deleteDoc,
  doc,
  DocumentData,
  updateDoc,
} from 'firebase/firestore';
import { Client } from 'types/client';
import { Order } from 'types/order';
import { db } from './app';
import { clientsCollection, ordersCollection } from './collections';

export const editDocument = async <T>(path: string, id: string, data: T) => {
  const reference = doc(db, path, id);
  return await updateDoc(reference, data as DocumentData);
};
export const deleteDocument = async (path: string, id: string) => {
  const reference = doc(db, path, id);
  return await deleteDoc(reference);
};

export const addClient = async (client: Omit<Client, 'id'>) => {
  return await addDoc(clientsCollection, client);
};
export const editClient = async (id: string, data: Partial<Client>) => {
  return await editDocument('clients', id, data);
};
export const deleteClient = async (id: string) => {
  return await deleteDocument('clients', id);
};

export const addOrder = async (order: Omit<Order, 'id'>) => {
  return await addDoc(ordersCollection, order);
};
export const editOrder = async (id: string, data: Partial<Order>) => {
  return await editDocument('orders', id, data);
};
export const deleteOrder = async (id: string) => {
  return await deleteDocument('orders', id);
};
