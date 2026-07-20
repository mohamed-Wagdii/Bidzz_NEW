// HowItWorksPage.jsx
import HowItWorksHero   from "../components/HowitWorks/HowItWorksHero";
import HowItWorksSteps  from "../components/HowitWorks/HowItWorksSteps";
import HowItWorksFooter from "../components/HowitWorks/HowItWorksFooter";

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight:"100vh", background:"#f9f8f5" }}>
      <HowItWorksHero />
      <HowItWorksSteps />
      <HowItWorksFooter />
    </div>
  );
}