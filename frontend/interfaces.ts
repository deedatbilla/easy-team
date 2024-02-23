export interface Product {
  name: string;
  price: number;
  id: string;
  imageUrl: string;
  category: string;
}
export interface StaffMember {
  id: string;
  name: string;
}
export interface Order {
  id: string;
  orderName: string;
  products: Product[];
  createdAt: string;
}
export interface DailyCommissions{
    day:string
    orders:Order[]
}
