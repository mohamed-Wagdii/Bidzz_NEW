import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import StepProgress from "../../components/layout/Stepprogress";
import BasicInfoForm from "../../components/Create_Auctions/BasicInfoForm";
import BasicInfoSidebar from "../../components/Create_Auctions/BasicInfoSidebar";

export default function Step1BasicInfoPage({ formData, onUpdate, onNext }) {
  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <div style={styles.container}>
        <StepProgress currentStep={1} />
        <div style={styles.body}>
          <BasicInfoForm formData={formData} onUpdate={onUpdate} onNext={onNext} />
          <BasicInfoSidebar />
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
