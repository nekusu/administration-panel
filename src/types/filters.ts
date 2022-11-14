export namespace Filters {
  export type Status = 'all' | 'pending' | 'finished' | 'delivered';
  export type OrderBy = 'price' | 'receivedTimestamp' | 'deliveredTimestamp';
  export type Timeframe = 'week' | 'month' | 'year' | 'custom';
}
