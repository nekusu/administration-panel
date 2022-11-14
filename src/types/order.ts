export interface Order {
  id: string;
  clientId: string;
  status: 'pending' | 'finished' | 'delivered';
  price: number;
  receivedTimestamp: number;
  deliveredTimestamp: number | null;
}
