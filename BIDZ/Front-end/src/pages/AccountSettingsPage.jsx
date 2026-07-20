import { useAuth } from "../contexts/AuthContext";
import DashboardLayout from "../components/shared/DashboardLayout";
import AccountProfileForm from "../components/account/AccountProfileForm";
import AccountSecurityPreferences from "../components/account/AccountSecurityPreferences";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout role={user?.role || "buyer"}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>Account Settings</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Manage your profile and security preferences.</p>
      </div>
      <AccountProfileForm user={user} />
      <AccountSecurityPreferences />
    </DashboardLayout>
  );
}
