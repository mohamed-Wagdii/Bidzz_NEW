import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsAPI } from "../services/api";
import DashboardLayout from "../components/shared/DashboardLayout";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price) return setError("Please fill in all fields.");
    if (parseFloat(form.price) <= 0) return setError("Price must be greater than 0.");
    if (!imageFile) return setError("Product image is required.");

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // Send everything in one multipart/form-data request
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("images", imageFile);

      await productsAPI.create(fd);
      setSuccess("Product saved successfully!");
      setTimeout(() => navigate("/my-products"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="seller">
      {/* Breadcrumb */}
      <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
        <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => navigate("/seller-dashboard")}>Dashboard</span>
        {" › "}
        <span style={{ cursor: "pointer", color: "#C9A84C" }} onClick={() => navigate("/my-products")}>My Products</span>
        {" › "} Add Product
      </p>

      <div style={{ maxWidth: 680 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#1A1814", marginBottom: 6 }}>
          Add New Product
        </h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 28, lineHeight: 1.6 }}>
          Create your product listing. You can create an auction for it separately from My Products.
        </p>

        <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid #ede8df" }}>
          {error && <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8, padding: "12px 16px", color: "#e05252", fontSize: 13, marginBottom: 20 }}>{error}</div>}
          {success && <div style={{ background: "#e6f9f0", border: "1px solid #b2dfdb", borderRadius: 8, padding: "12px 16px", color: "#1a9e5a", fontSize: 13, marginBottom: 20 }}>{success}</div>}

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>PRODUCT NAME</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. 1963 Rolex Daytona Cosmograph" style={inp} />
          </div>

          {/* Price */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>STARTING PRICE ($)</label>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0ddd5", borderRadius: 8, background: "#fafaf7", overflow: "hidden" }}>
              <span style={{ padding: "0 14px", color: "#aaa", fontSize: "1rem", borderRight: "1px solid #eee" }}>$</span>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" style={{ ...inp, border: "none", borderRadius: 0, background: "transparent" }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the provenance, condition, and unique features..." rows={5} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {/* Image */}
          <div style={{ marginBottom: 28 }}>
            <label style={lbl}>PRODUCT IMAGE <span style={{ color: "#e05252" }}>*</span></label>
            <div
              style={{ border: `1.5px dashed ${dragOver ? "#C9A84C" : "#d4c9a8"}`, borderRadius: 12, background: dragOver ? "#fffdf5" : "#fafaf7", padding: previewImg ? 0 : "40px 20px", textAlign: "center", cursor: "pointer", overflow: "hidden", minHeight: previewImg ? 0 : 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("pImg").click()}
            >
              {previewImg ? (
                <div style={{ position: "relative" }}>
                  <img src={previewImg} alt="preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block", borderRadius: 10 }} />
                  <button onClick={e => { e.stopPropagation(); setPreviewImg(null); setImageFile(null); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 10, opacity: 0.35 }}>📷</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#555", margin: "0 0 4px" }}>Click to upload or drag and drop</p>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>PNG, JPG or WebP (max 10MB)</p>
                </>
              )}
              <input id="pImg" type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFileChange(e.target.files[0])} />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => navigate("/my-products")} style={{ background: "none", border: "none", color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ← Back to Products
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? "#ccc" : "#1A1814", border: "none", color: "#fff", padding: "12px 28px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const lbl = { display: "block", fontSize: 10, letterSpacing: "0.12em", color: "#888", fontWeight: 700, marginBottom: 8 };
const inp = { width: "100%", padding: "11px 14px", border: "1px solid #e0ddd5", borderRadius: 8, background: "#fafaf7", fontSize: 13, color: "#222", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans',sans-serif" };
