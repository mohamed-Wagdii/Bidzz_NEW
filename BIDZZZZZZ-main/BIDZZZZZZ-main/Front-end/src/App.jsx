import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/auth/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Public pages
import LandingPage from "./pages/auth/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuctionsPage from "./pages/Auctions/AuctionsPage";
import AuctionDetail from "./pages/Auctions/AuctionDetail";
import HowItWorksPage from "./pages/HowItWorksPage";
import About from "./pages/About";

// Buyer pages
import BuyerDashboard from "./pages/Dashboards/BuyerDashboard";
import DashboardBids from "./pages/Dashboards/DashboardBids";
import WatchlistPage from "./pages/WatchlistPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import Payment from "./pages/Payment";
import Success from "./pages/Success";

// Seller pages
import SellerDashboard from "./pages/Dashboards/SellerDashboard";
import AddProductPage from "./pages/AddProductPage";
import MyProductsPage from "./pages/MyProductsPage";
import MyAuctionsPage from "./pages/MyAuctionsPage";
import SellFlow from "./pages/Auctions/Sellflow";

// Admin pages
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import AdminReportsPage from "./pages/Dashboards/AdminReportsPage";
import AdminWalletPage from "./pages/Dashboards/AdminWalletPage";
import AdminUsersPage from "./pages/Dashboards/AdminUsersPage";
import AdminAuctionsPage from "./pages/Dashboards/AdminAuctionsPage";
import AdminOrdersPage from "./pages/Dashboards/AdminOrdersPage";

// Shared protected pages
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import AccountSettingsPage from "./pages/AccountSettingsPage";
import PurchaseTicketPage from "./pages/PurchaseTicketPage";
import ShippingPage from "./pages/ShippingPage";
import ChatPage from "./pages/ChatPage";
import AIChatPage from "./pages/AIChatPage";
import WalletPage from "./pages/WalletPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import QRDeliveryPage from "./pages/QRDeliveryPage";

function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to={user.role === "seller" ? "/seller-dashboard" : "/buyer-dashboard"} replace />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/auctions/:id" element={<AuctionDetail />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<About />} />

          {/* ── Dashboard redirect ── */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* ── Buyer only ── */}
          <Route path="/buyer-dashboard" element={<RoleRoute role="buyer"><BuyerDashboard /></RoleRoute>} />
          <Route path="/dashboard/bids" element={<ProtectedRoute><DashboardBids /></ProtectedRoute>} />
          <Route path="/dashboard/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
          <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/orders/:id/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/orders/:id/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

          {/* ── Admin only ── */}
          <Route path="/admin" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/reports" element={<RoleRoute role="admin"><AdminReportsPage /></RoleRoute>} />
          <Route path="/admin/wallet" element={<RoleRoute role="admin"><AdminWalletPage /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsersPage /></RoleRoute>} />
          <Route path="/admin/auctions" element={<RoleRoute role="admin"><AdminAuctionsPage /></RoleRoute>} />
          <Route path="/admin/orders" element={<RoleRoute role="admin"><AdminOrdersPage /></RoleRoute>} />

          {/* ── Seller only ── */}
          <Route path="/seller-dashboard" element={<RoleRoute role="seller"><SellerDashboard /></RoleRoute>} />
          <Route path="/add-product" element={<RoleRoute role="seller"><AddProductPage /></RoleRoute>} />
          <Route path="/my-products" element={<RoleRoute role="seller"><MyProductsPage /></RoleRoute>} />
          <Route path="/my-auctions" element={<RoleRoute role="seller"><MyAuctionsPage /></RoleRoute>} />
          <Route path="/auctions/new" element={<RoleRoute role="seller"><SellFlow /></RoleRoute>} />

          {/* ── Any authenticated user ── */}
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="/orders/:id/qr" element={<ProtectedRoute><QRDeliveryPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          <Route path="/tickets/purchase" element={<ProtectedRoute><PurchaseTicketPage /></ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
          <Route path="/my-chats" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}
