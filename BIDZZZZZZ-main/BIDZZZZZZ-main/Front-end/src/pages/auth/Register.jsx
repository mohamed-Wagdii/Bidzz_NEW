import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import FormLabel from "../../components/auth/FormLabel";
import FormInput from "../../components/auth/FormInput";
import SubmitButton from "../../components/auth/SubmitButton";
import Footer from "../../components/layout/Footer";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("buyer");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return setError("You must agree to the Terms of Service.");
    if (!form.fullName || !form.email || !form.password)
      return setError("Please fill in all required fields.");

    setLoading(true);
    try {
      const data = await authAPI.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role,
      });
      login(data.token, data.user);
      if (data.user.role === "seller") navigate("/seller-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSuccess = async (provider, token) => {
    setLoading(true);
    try {
      let data;
      if (provider === "google") data = await authAPI.google(token);
      if (provider === "facebook") data = await authAPI.facebook(token);
      login(data.token, data.user);
      if (data.user.role === "admin")       navigate("/admin");
      else if (data.user.role === "seller") navigate("/seller-dashboard");
      else                                  navigate("/buyer-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link to="/" style={s.logo}>BIDZONE</Link>
        <div>
          <span style={s.navText}>Already have an account? </span>
          <Link to="/login" style={s.navLink}>Sign In</Link>
        </div>
      </nav>

      <div style={s.main}>
        {/* Left panel */}
        <div style={s.leftPanel}>
          <img
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80"
            alt="Auction Hall"
            style={s.bgImg}
          />
          <div style={s.overlay} />
          <div style={s.leftContent}>
            <h2 style={s.leftTitle}>
              Elevating the<br />
              <span style={s.gold}>Auction Experience.</span>
            </h2>
            <p style={s.leftSub}>
              Access an exclusive marketplace of institutional-grade assets and a global network of elite collectors.
            </p>
            <div style={s.badge}>
              <span style={{ fontSize: 18 }}>🛡</span>
              <div>
                <p style={s.badgeTitle}>Identity Verified</p>
                <p style={s.badgeSub}>Secure KYC processes for global safety.</p>
              </div>
            </div>
            <div style={s.badge}>
              <span style={{ fontSize: 18 }}>💰</span>
              <div>
                <p style={s.badgeTitle}>Financial Integrity</p>
                <p style={s.badgeSub}>Streamlined deposits via secure channels.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={s.rightPanel}>
          <h1 style={s.formTitle}>Create Your Account</h1>
          <p style={s.formSub}>Join our elite marketplace today.</p>

          {error && <p style={s.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div style={s.section}>
              <p style={s.sectionLabel}>— 01. ACCOUNT PURPOSE</p>
              <div style={s.roleRow}>
                <div
                  style={{ ...s.roleCard, ...(role === "buyer" ? s.roleActive : {}) }}
                  onClick={() => setRole("buyer")}
                >
                  <span style={{ fontSize: 20 }}>🏠</span>
                  <p style={s.roleTitle}>I want to Buy</p>
                  <p style={s.roleSub}>Bid on premium assets and manage your collection.</p>
                </div>
                <div
                  style={{ ...s.roleCard, ...(role === "seller" ? s.roleActive : {}) }}
                  onClick={() => setRole("seller")}
                >
                  <span style={{ fontSize: 20 }}>🏷</span>
                  <p style={s.roleTitle}>I want to Sell</p>
                  <p style={s.roleSub}>List high-value items for global collectors.</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div style={s.section}>
              <p style={s.sectionLabel}>— 02. PERSONAL INFORMATION</p>
              <div style={s.row2}>
                <div style={{ flex: 1 }}>
                  <FormInput
                    label={<FormLabel style={s.fieldLabel}>FULL NAME</FormLabel>}
                    wrapStyle={{}}
                    inputStyle={s.input}
                    name="fullName"
                    placeholder="Johnathan Sterling"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <FormInput
                    label={<FormLabel style={s.fieldLabel}>PHONE NUMBER</FormLabel>}
                    wrapStyle={{}}
                    inputStyle={s.input}
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <FormInput
                label={<FormLabel style={s.fieldLabel}>EMAIL ADDRESS</FormLabel>}
                wrapStyle={{}}
                inputStyle={{ ...s.input, width: "100%", marginBottom: 12 }}
                name="email"
                type="email"
                placeholder="j.sterling@exclusive.com"
                value={form.email}
                onChange={handleChange}
              />

              <FormInput
                label={<FormLabel style={s.fieldLabel}>SECURE PASSWORD</FormLabel>}
                wrapStyle={s.inputWrap}
                inputStyle={s.inputInner}
                name="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                showToggle={true}
                onToggle={() => setShowPass(!showPass)}
                eyeBtnStyle={s.eyeBtn}
                inputProps={{ type: showPass ? "text" : "password" }}
              />
            </div>

            <label style={s.checkRow}>
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
              <span style={s.checkText}>
                I agree to the <span style={s.link}>Terms of Service</span> and{" "}
                <span style={s.link}>Privacy Policy.</span>
              </span>
            </label>

            <SubmitButton style={s.submitBtn} disabled={loading}>
              {loading ? "PROCESSING..." : "Complete Registration 🔒"}
            </SubmitButton>

            {/* ── OAuth ── */}
            <div style={{ display: "flex", alignItems: "center", margin: "24px 0 16px" }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ padding: "0 10px", fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={(res) => handleOAuthSuccess("google", res.credential)}
                  onError={() => setError("Google login failed.")}
                  useOneTap
                />
              </div>
              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID || "1234567890"}
                onSuccess={(res) => handleOAuthSuccess("facebook", res.accessToken)}
                onFail={() => setError("Facebook login failed.")}
                onProfileSuccess={() => {}}
                style={{
                  width: "100%", padding: "10px", background: "#1877F2",
                  color: "#fff", border: "none", borderRadius: 4,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  height: 40
                }}
              >
                <span style={{ fontSize: 18, background: "#fff", color: "#1877f2", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>f</span>
                Continue with Facebook
              </FacebookLogin>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const s = {
  page:        { minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans',sans-serif", background: "#fff" },
  nav:         { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 32px", borderBottom: "1px solid #eee" },
  logo:        { fontWeight: 700, fontSize: 18, color: "#1A1814", textDecoration: "none", letterSpacing: 1 },
  navText:     { fontSize: 13, color: "#888" },
  navLink:     { fontSize: 13, color: "#1A1814", fontWeight: 600, textDecoration: "none", marginLeft: 4 },
  main:        { display: "flex", flex: 1 },
  leftPanel:   { width: "40%", position: "relative", minHeight: 600, overflow: "hidden" },
  bgImg:       { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  overlay:     { position: "absolute", inset: 0, background: "rgba(10,16,24,0.75)" },
  leftContent: { position: "relative", zIndex: 2, padding: "48px 36px" },
  leftTitle:   { fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 12 },
  gold:        { color: "#C9A84C" },
  leftSub:     { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 28 },
  badge:       { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, background: "rgba(255,255,255,0.06)", padding: "12px 14px", borderRadius: 6 },
  badgeTitle:  { fontSize: 13, fontWeight: 600, color: "#fff" },
  badgeSub:    { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  rightPanel:  { flex: 1, padding: "40px 48px", overflowY: "auto" },
  formTitle:   { fontSize: 26, fontWeight: 700, marginBottom: 4 },
  formSub:     { fontSize: 13, color: "#888", marginBottom: 24 },
  section:     { marginBottom: 28 },
  sectionLabel:{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#C9A84C", marginBottom: 12 },
  roleRow:     { display: "flex", gap: 12 },
  roleCard:    { flex: 1, border: "1.5px solid #e0e0e0", borderRadius: 8, padding: "14px 16px", cursor: "pointer" },
  roleActive:  { border: "1.5px solid #C9A84C", background: "#FFFBF0" },
  roleTitle:   { fontSize: 14, fontWeight: 600, margin: "6px 0 3px" },
  roleSub:     { fontSize: 12, color: "#888", lineHeight: 1.4 },
  row2:        { display: "flex", gap: 12, marginBottom: 12 },
  fieldLabel:  { display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#999", marginBottom: 5 },
  input:       { border: "1px solid #e0e0e0", borderRadius: 6, padding: "10px 12px", fontSize: 13, outline: "none", color: "#333", background: "#fafafa", width: "100%" },
  inputWrap:   { display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: 6, background: "#fafafa", paddingRight: 8 },
  inputInner:  { flex: 1, border: "none", background: "transparent", padding: "10px 12px", fontSize: 13, outline: "none", color: "#333" },
  eyeBtn:      { background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: 4 },
  checkRow:    { display: "flex", gap: 8, alignItems: "flex-start", margin: "16px 0 20px", cursor: "pointer" },
  checkText:   { fontSize: 12, color: "#666", lineHeight: 1.5 },
  link:        { color: "#1A1814", fontWeight: 600 },
  submitBtn:   { width: "100%", padding: "14px", background: "#1A1814", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, cursor: "pointer" },
  error:       { color: "#e05252", fontSize: 13, marginBottom: 16, background: "#fff0f0", padding: "8px 12px", borderRadius: 4 },
  footer:      { borderTop: "1px solid #eee", padding: "18px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "#1A1814" },
  footerLogo:  { fontWeight: 700, fontSize: 13, letterSpacing: 1, color: "#fff" },
  footerLinks: { display: "flex", gap: 24 },
  footerLink:  { fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "none", letterSpacing: 0.5 },
  footerCopy:  { fontSize: 11, color: "rgba(255,255,255,0.3)" },
};
