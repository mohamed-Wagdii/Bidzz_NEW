import axios from "axios";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  google: (credential) => api.post("/auth/google", { credential }).then((r) => r.data),
  facebook: (accessToken) => api.post("/auth/facebook", { accessToken }).then((r) => r.data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }).then((r) => r.data),
  getProfile: () => api.get("/auth/profile").then((r) => r.data),
  getDashboard: () => api.get("/auth/dashboard").then((r) => r.data),
};

export const auctionsAPI = {
  getAll: (params = {}) => api.get("/auctions/all", { params }).then((r) => r.data),
  getById: (id) => api.get(`/auctions/${id}`).then((r) => r.data),
  getMy: () => api.get("/auctions/my").then((r) => r.data),
  create: (data) => api.post("/auctions/create", data).then((r) => r.data),
  update: (id, data) => api.put(`/auctions/update/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/auctions/delete/${id}`).then((r) => r.data),
  end: (id) => api.patch(`/auctions/end/${id}`).then((r) => r.data),
};

export const bidsAPI = {
  place: (auctionId, amount) => api.post(`/bids/${auctionId}`, { amount }).then((r) => r.data),
  getForAuction: (auctionId) => api.get(`/bids/auction/${auctionId}`).then((r) => r.data),
  getMy: () => api.get("/bids/my").then((r) => r.data),
};

export const productsAPI = {
  // Accepts a FormData object (multipart) containing name, description, price, and images file(s)
  create: (formData) => api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  getMy: () => api.get("/products/my").then((r) => r.data),
};

export const ticketsAPI = {
  buy: () => api.post("/tickets/buy").then((r) => r.data),
  getMy: () => api.get("/tickets/my").then((r) => r.data),
};

export const ordersAPI = {
  create: (auctionId, shippingAddress) =>
    api.post(`/orders/create/${auctionId}`, { shippingAddress }).then((r) => r.data),
  payWithWallet: (orderId) =>
    api.post(`/orders/${orderId}/pay`).then((r) => r.data),
  getMy: () => api.get("/orders/my").then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  updateShipping: (id, shippingAddress) =>
    api.patch(`/orders/${id}/shipping`, { shippingAddress }).then((r) => r.data),
  updateStatus: (id, orderStatus) =>
    api.patch(`/orders/${id}/status`, { orderStatus }).then((r) => r.data),
};

export const chatAPI = {
  findOrCreateConversation: (receiverId, auctionId) =>
    api.post("/chat/conversation", { receiverId, auctionId }).then((r) => r.data),
  getConversations: () => api.get("/chat/conversations").then((r) => r.data),
  getMessages: (conversationId) =>
    api.get(`/chat/${conversationId}/messages`).then((r) => r.data),
  sendMessage: (conversationId, message, receiverId, auctionId) =>
    api.post("/chat/send", { conversationId, message, receiverId, auctionId }).then((r) => r.data),
  sendTyping: (conversationId, isTyping) =>
    api.post(`/chat/${conversationId}/typing`, { isTyping }).then((r) => r.data),
  canChat: (auctionId) => api.get("/chat/can-chat", { params: { auctionId } }).then((r) => r.data),
};

export const notificationsAPI = {
  getMy: () => api.get("/notifications").then((r) => r.data),
  getUnreadCount: () => api.get("/notifications/unread-count").then((r) => r.data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.patch("/notifications/read-all").then((r) => r.data),
};

export const aiAPI = {
  ask: (question) => api.post("/ai/ask", { question }).then((r) => r.data),
};

export const uploadAPI = {
  images: (formData) =>
    api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
};

export const analyticsAPI = {
  get: () => api.get("/auth/analytics").then((r) => r.data),
};

export const reportsAPI = {
  submit: (data) => api.post("/reports", data).then((r) => r.data),
  getMy: () => api.get("/reports/my").then((r) => r.data),
  getAll: (params = {}) => api.get("/reports", { params }).then((r) => r.data),
  getStats: () => api.get("/reports/stats").then((r) => r.data),
  resolve: (id, data) => api.patch(`/reports/${id}/resolve`, data).then((r) => r.data),
};

export const walletAPI = {
  get: () => api.get("/wallet").then((r) => r.data),
  deposit: (amount) => api.post("/wallet/deposit", { amount }).then((r) => r.data),
  withdraw: (amount) => api.post("/wallet/withdraw", { amount }).then((r) => r.data),
  getTransactions: () => api.get("/wallet/transactions").then((r) => r.data),
};

export const adminAPI = {
  // Users
  getUsers:   (params = {}) => api.get("/admin/users",   { params }).then((r) => r.data),
  updateUser: (id, data)    => api.patch(`/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id)          => api.delete(`/admin/users/${id}`).then((r) => r.data),
  // Auctions
  getAuctions:   (params = {}) => api.get("/admin/auctions",        { params }).then((r) => r.data),
  endAuction:    (id)          => api.patch(`/admin/auctions/${id}/end`).then((r) => r.data),
  deleteAuction: (id)          => api.delete(`/admin/auctions/${id}`).then((r) => r.data),
  // Orders
  getOrders:   (params = {}) => api.get("/admin/orders",   { params }).then((r) => r.data),
  updateOrder: (id, data)    => api.patch(`/admin/orders/${id}`, data).then((r) => r.data),
  // Finances
  getFinances: (params = {}) => api.get("/admin/finances", { params }).then((r) => r.data),
};

export default api;
