export type MemberDTO = {
  id: number;
  lastName: string;
  firstName: string;
  cardNumber: number;
  balance: string;
  admin: boolean;
};

export type ProductDTO = {
  id: number;
  title: string;
  name: string;
  color: string | null;
  price: string;
  productTypeId: number;
  available: boolean;
};

export type PurchaseReceiptDTO = {
  success: boolean;
  transaction: {
    orderId: number;
    date: Date;
    product: {
      id: number;
      name: string;
      title: string;
      price: string;
    };
    member: {
      id: number;
      firstName: string;
      lastName: string;
      cardNumber: number;
    };
    amount: number;
    totalPrice: string;
    previousBalance: string;
    newBalance: string;
  };
};

export type RechargeReceiptDTO = {
  success: boolean;
  transaction: {
    date: Date;
    member: {
      id: number;
      firstName: string;
      lastName: string;
      cardNumber: number;
    };
    processedBy?: {
      id: number;
      firstName: string;
      lastName: string;
      cardNumber: number;
      isAdmin: boolean;
    };
    amount: string;
    previousBalance: string;
    newBalance: string;
  };
};

export type PaginatedOrdersDTO = {
  data: Array<{
    id: number;
    productId: number | null;
    memberId: number | null;
    price: string;
    amount: number;
    date: Date;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
