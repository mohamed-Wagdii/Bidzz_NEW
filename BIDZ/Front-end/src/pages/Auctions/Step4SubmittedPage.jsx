import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import StepProgress from "../../components/layout/Stepprogress";
import SubmissionConfirmation from "../../components/Create_Auctions/SubmissionConfirmation";
import SubmissionFooterCards from "../../components/Create_Auctions/SubmissionFooterCards";

export default function Step4SubmittedPage({ onDashboard, onAddAnother }) {
  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />
      <div style={styles.container}>
        <StepProgress currentStep={4} />
        <SubmissionConfirmation onDashboard={onDashboard} onAddAnother={onAddAnother} />
        <SubmissionFooterCards />
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: { background: "#f5f4f0", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" },
  container: { maxWidth: "760px", margin: "0 auto", padding: "0 24px 80px" },
};