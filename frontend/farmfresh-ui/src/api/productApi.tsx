import api from "./axios";

export interface Product {
  id: number;
  productId: number;
  name: string;
  price: number;
  availableQuantity: number;
  imageUrl?: string | null;
}

export const getAvailableProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/Product/available");
  return response.data;
};