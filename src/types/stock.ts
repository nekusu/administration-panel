export namespace Stock {
  export interface Group {
    id: string;
    name: string;
  }
  export interface Item {
    id: string;
    code: string;
    quantity: number;
    color: string;
  }
  export interface Marker {
    id: string;
    color: string;
    name: string;
    value: number;
  }
}
