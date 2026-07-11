import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import StepProgress from "../../components/layout/Stepprogress";
import MediaUploader from "../../components/Create_Auctions/MediaUploader";
import MediaSidebar from "../../components/Create_Auctions/MediaSidebar";

export default function Step2MediaPage({ formData, onUpdate, onNext, onBack }) {
  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <div style={styles.container}>
        <StepProgress currentStep={2} />
        <div style={styles.body}>
          <MediaSidebar />
          <MediaUploader formData={formData} onUpdate={onUpdate} onNext={onNext} onBack={onBack} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { background: "#f5f4f0", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" },
  container: { maxWidth: "1100px", margin: "0 auto", padding: "0 24px" },
  body: { display: "flex", gap: "28px", alignItems: "flex-start", padding: "32px 0 60px" },
};