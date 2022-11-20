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
}
