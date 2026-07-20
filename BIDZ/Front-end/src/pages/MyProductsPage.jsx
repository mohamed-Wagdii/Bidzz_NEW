import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";

export default function MyProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    productsAPI.getMy()
      .then(data => setProducts(data.products || []))
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout role="seller">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", margin: "0 0 4px" }}>My Products</h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Manage your product listings. Select one to create an auction.</p>
        </div>
        <button
          onClick={() => navigate("/add-product")}
          style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", marginBottom: 20 }}>{error}</div>
      )}

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 280, background: "#eee", borderRadius: 12 }} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", padding: "4rem", textAlign: "center" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>📦</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#555", marginBottom: 8 }}>No products yet</p>
          <p style={{ fontSize: 14, color: "#aaa", marginBottom: 24 }}>Add your first product to start creating auctions.</p>
          <button
            onClick={() => navigate("/add-product")}
            style={{ background: "#1A1814", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 600, cursor: "pointer" }}
          >
            Add Product
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #ede8df", overflow: "hidden" }}>
              <div style={{ height: 180, background: "#f0ede6", overflow: "hidden" }}>
                {p.image?.[0]
                  ? <img src={p.image[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, opacity: 0.3 }}>📷</div>
                }
              </div>
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 700, color: "#1A1814", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 12, color: "#888", margin: "0 0 12px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {p.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 700, color: "#1A1814" }}>
                    ${p.price?.toLocaleString()}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase",
                    background: p.status === "approved" ? "#e6f9f0" : "#fff8e1",
                    color: p.status === "approved" ? "#1a9e5a" : "#b8962e",
                  }}>
                    {p.status}
                  </span>
                </div>
                <button
                  onClick={() => navigate("/auctions/new", { state: { productId: p._id } })}
                  style={{ width: "100%", background: "#C9A84C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                >
                  Create Auction
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
