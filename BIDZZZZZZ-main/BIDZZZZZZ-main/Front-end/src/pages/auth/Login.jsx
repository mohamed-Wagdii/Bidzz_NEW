import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";



const TEXT = {
  en: {
    title: "Welcome Back",
    subtitle: "Sign in to your auction account",
    email: "Email Address",
    password: "Password",
    keep: "Keep me signed in",
    btn: "Sign In",
    loading: "Signing in...",
    forgot: "Forgot password?",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    demoTitle: "Demo Accounts — Click to fill",
    hint: "Make sure the server is running:",
    errWrong: "Wrong email or password.",
    errLocked: "Account is temporarily locked.",
    errNetwork: "Server is offline. Run: npm run dev in back-end folder.",
    errGeneral: "Something went wrong. Try again.",
  },
  ar: {
    title: "مرحباً بعودتك",
    subtitle: "سجّل دخولك إلى حساب المزادات",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    keep: "ابق متصلاً",
    btn: "تسجيل الدخول",
    loading: "جاري الدخول...",
    forgot: "نسيت كلمة المرور؟",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
    demoTitle: "حسابات تجريبية — اضغط للملء",
    hint: "تأكد أن السيرفر شغال:",
    errWrong: "إيميل أو كلمة مرور غلط.",
    errLocked: "الحساب مقفول مؤقتاً.",
    errNetwork: "السيرفر مش شغال. شغّل: npm run dev في مجلد back-end.",
    errGeneral: "حصل خطأ. حاول مرة تانية.",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { lang, toggleLang } = useTheme();
  const t = TEXT[lang] || TEXT.en;
  const isRTL = lang === "ar";

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError(t.errWrong); return; }
    setLoading(true);
    try {
      const data = await authAPI.login({ email: form.email, password: form.password });
      login(data.token, data.user);
      if (data.user.role === "admin")       navigate("/admin");
      else if (data.user.role === "seller") navigate("/seller-dashboard");
      else                                  navigate("/buyer-dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (err.code === "ERR_NETWORK" || !err.response) setError(t.errNetwork);
      else if (msg.toLowerCase().includes("locked"))   setError(t.errLocked);
      else if (msg.toLowerCase().includes("invalid"))  setError(t.errWrong);
      else                                             setError(t.errGeneral);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...page, direction: isRTL ? "rtl" : "ltr", fontFamily: isRTL ? "'Cairo',sans-serif" : "'Inter',sans-serif" }}>

      {/* ── Top bar ── */}
      <nav style={topBar}>
        <Link to="/" style={logo}>
          <span style={{ color: "#0f1117" }}>BID</span>
          <span style={{ color: "#C9A84C" }}>ZONE</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Language toggle */}
          <button onClick={toggleLang} style={langBtn}>
            {lang === "en" ? "🌐 عربي" : "🌐 English"}
          </button>
          <span style={{ fontSize: 13, color: "#666" }}>
            {t.noAccount}&nbsp;
            <Link to="/register" style={{ color: "#C9A84C", fontWeight: 700 }}>{t.signUp}</Link>
          </span>
        </div>
      </nav>

      <div style={wrapper}>



        {/* ── Login card ── */}
        <div style={card}>
          {/* Header */}
          <div style={cardHeader}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🔐</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{t.title}</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>{t.subtitle}</p>
          </div>

          {/* Body */}
          <div style={{ padding: "24px 28px" }}>
            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fca5a5",
                borderRadius: 8, padding: "11px 14px",
                fontSize: 13, color: "#dc2626", marginBottom: 16, lineHeight: 1.6,
              }}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={fieldLabel}>{t.email}</label>
                <div style={inputWrap}>
                  <span style={{ padding: "0 10px", fontSize: 15 }}>✉️</span>
                  <input
                    type="email" name="email"
                    placeholder="name@example.com"
                    value={form.email} onChange={handleChange}
                    style={inputStyle} autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <label style={fieldLabel}>{t.password}</label>
                <div style={inputWrap}>
                  <span style={{ padding: "0 10px", fontSize: 15 }}>🔑</span>
                  <input
                    type={showPass ? "text" : "password"} name="password"
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    style={inputStyle} autoComplete="current-password"
                  />
                  <button
                    type="button" onClick={() => setShowPass(v => !v)}
                    style={{ background: "none", border: "none", padding: "0 10px", cursor: "pointer", fontSize: 16 }}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px",
                  background: loading ? "#999" : "linear-gradient(135deg,#C9A84C,#a8872e)",
                  color: "#fff", border: "none", borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.15s",
                }}
              >
                {loading ? `⏳ ${t.loading}` : `🚀 ${t.btn}`}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 14 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: "#3b82f6" }}>
                {t.forgot}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Server hint ── */}
        <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", maxWidth: 480 }}>
          💡 {t.hint}&nbsp;
          <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontFamily: "monospace" }}>
            cd back-end &amp;&amp; npm run dev
          </code>
        </div>

      </div>
    </div>
  );
}

/* ── Styles ── */
const page    = { minHeight: "100vh", background: "#f8f9fb", display: "flex", flexDirection: "column" };
const topBar  = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 32px", background: "#fff", borderBottom: "1px solid #e5e7eb" };
const logo    = { fontWeight: 800, fontSize: 22, letterSpacing: 1, textDecoration: "none", fontFamily: "Sora,Inter,sans-serif" };
const langBtn = { background: "none", border: "1px solid #e5e7eb", borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#555" };
const wrapper = { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px", gap: 20 };

const card    = { width: "100%", maxWidth: 480, background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" };
const cardHeader = { background: "linear-gradient(135deg,#0d1117,#1e2a3a)", padding: "24px 28px", textAlign: "center" };
const fieldLabel = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
const inputWrap  = { display: "flex", alignItems: "center", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", overflow: "hidden" };
const inputStyle = { flex: 1, border: "none", background: "transparent", padding: "11px 8px", fontSize: 14, outline: "none", color: "#111", fontFamily: "inherit" };
