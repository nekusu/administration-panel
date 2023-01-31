import { addDoc, deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { Client } from 'types/client';
import { Expense, Tag } from 'types/expense';
import { Order } from 'types/order';
import * as Stock from 'types/stock';
import { db } from './app';
import {
  clientsCollection,
  expensesCollection,
  ordersCollection,
  stockGroupsCollection,
  stockItemsCollection,
  stockMarkersCollection,
  tagsCollection,
} from './collections';

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

export const addOrder = async (order: Omit<Order, 'id'>) => {
  return await addDoc(ordersCollection, order);
};
export const editOrder = async (id: string, data: Partial<Omit<Order, 'id'>>) => {
  return await editDocument('orders', id, data);
};
export const deleteOrder = async (id: string) => {
  return await deleteDocument('orders', id);
};

export const addStockGroup = async (stockGroup: Omit<Stock.Group, 'id'>) => {
  return await addDoc(stockGroupsCollection, stockGroup);
};

export const addStockItem = async (stockGroupId: string, data: Omit<Stock.Item, 'id'>) => {
  return await addDoc(stockItemsCollection(stockGroupId), data);
};
export const editStockItem = async (
  stockGroupId: string,
  id: string,
  data: Partial<Omit<Stock.Item, 'id'>>
) => {
  return await editDocument(`groups/${stockGroupId}/items`, id, data);
};
export const deleteStockItem = async (stockGroupId: string, id: string) => {
  return await deleteDocument(`groups/${stockGroupId}/items`, id);
};

export const addStockMarker = async (stockGroupId: string, data: Omit<Stock.Marker, 'id'>) => {
  return await addDoc(stockMarkersCollection(stockGroupId), data);
};
export const deleteStockMarker = async (stockGroupId: string, id: string) => {
  return await deleteDocument(`groups/${stockGroupId}/markers`, id);
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  return await addDoc(expensesCollection, expense);
};
export const editExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>) => {
  return await editDocument('expenses', id, data);
};
export const deleteExpense = async (id: string) => {
  return await deleteDocument('expenses', id);
};

export const addTag = async (tag: Omit<Tag, 'id'>) => {
  return await addDoc(tagsCollection, tag);
};
