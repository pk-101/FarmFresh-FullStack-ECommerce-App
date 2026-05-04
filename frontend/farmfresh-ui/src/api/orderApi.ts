import axios from "./axios";
import api from "./axios";

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export const createOrder = async (items: CreateOrderItem[]) => {
  const response = await api.post("/orders", {
    items,
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get("/orders/my");
  return response.data;
};

export const getOrderById = async (orderId: number) => {
  const res = await api.get(`/orders/${orderId}`);
  return res.data;
};