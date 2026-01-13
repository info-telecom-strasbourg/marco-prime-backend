export type Member = {
  id: number;
  lastName: string;
  firstName: string;
  cardNumber: number | null;
  email: string;
  phone: string | null;
  balance: string;
  admin: boolean;
  contributor: boolean;
  birthDate: Date | null;
  sector: string | null;
  createdAt: Date;
  class: number | null;
};

export type Product = {
  id: number;
  name: string;
  title: string;
  price: string;
  productTypeId: number;
  color: string | null;
  available: boolean;
};

export type Order = {
  id: number;
  productId: number | null;
  memberId: number | null;
  price: string;
  amount: number;
  date: Date;
};

export type ProductType = {
  id: number;
  type: string;
};
