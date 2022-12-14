import { OrderByDirection } from 'firebase/firestore';

export namespace Filters {
  export interface Order {
    status: 'all' | 'pending' | 'finished' | 'delivered';
    orderBy: 'price' | 'receivedTimestamp' | 'deliveredTimestamp';
    direction: OrderByDirection;
    clients: string[];
  }
  export interface Earnings {
    timeframe: 'week' | 'month' | 'year' | 'custom';
    excludedDays: string[];
    enableLeftTicks: boolean;
    enableBottomTicks: boolean;
  }
  export interface Stock {
    orderBy: 'code' | 'quantity';
    direction: OrderByDirection;
  }
  export interface StockGroup {
    enabledMarkers: string[];
    enableLeftTicks: boolean;
    enableLabels: boolean;
  }
}
