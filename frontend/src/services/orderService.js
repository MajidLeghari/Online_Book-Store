import api from './api';

export const orderService = {
  checkout: async (checkoutData) => {
    // checkoutData: { deliveryAddress, phoneNumber }
    const response = await api.post('/orders/checkout', checkoutData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrdersAdmin: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatusAdmin: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllCustomersAdmin: async () => {
    const response = await api.get('/admin/customers');
    return response.data;
  },
};
