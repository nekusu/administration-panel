import { addDoc, collection, deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { Client } from 'types/client';
import { Deposit, Expense, Tag } from 'types/expense';
import { Order } from 'types/order';
import * as Stock from 'types/stock';
import { db } from './app';

export const addDocument = async <T>(path: string, data: T) => {
  return await addDoc(collection(db, path), data as DocumentData);
};
export const editDocument = async <T>(path: string, id: string, data: T) => {
  return await updateDoc(doc(db, path, id), data as DocumentData);
};
export const deleteDocument = async (path: string, id: string) => {
  return await deleteDoc(doc(db, path, id));
};

export const addClient = async (client: Omit<Client, 'id'>) => {
  return await addDocument('clients', client);
};

export const addOrder = async (order: Omit<Order, 'id'>) => {
  return await addDocument('orders', order);
};
export const editOrder = async (id: string, data: Partial<Omit<Order, 'id'>>) => {
  return await editDocument('orders', id, data);
};
export const deleteOrder = async (id: string) => {
  return await deleteDocument('orders', id);
};

export const addStockGroup = async (stockGroup: Omit<Stock.Group, 'id'>) => {
  return await addDocument('groups', stockGroup);
};

export const addStockItem = async (stockGroupId: string, data: Omit<Stock.Item, 'id'>) => {
  return await addDocument(`groups/${stockGroupId}/items`, data);
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
  return await addDocument(`groups/${stockGroupId}/markers`, data);
};
export const deleteStockMarker = async (stockGroupId: string, id: string) => {
  return await deleteDocument(`groups/${stockGroupId}/markers`, id);
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  return await addDocument('expenses', expense);
};
export const editExpense = async (id: string, data: Partial<Omit<Expense, 'id'>>) => {
  return await editDocument('expenses', id, data);
};
export const deleteExpense = async (id: string) => {
  return await deleteDocument('expenses', id);
};

export const addTag = async (tag: Omit<Tag, 'id'>) => {
  return await addDocument('tags', tag);
};

export const addDeposit = async (deposit: Omit<Deposit, 'id'>) => {
  return await addDocument('deposits', deposit);
};
export const deleteFund = async (id: string) => {
  return await deleteDocument('deposits', id);
};
