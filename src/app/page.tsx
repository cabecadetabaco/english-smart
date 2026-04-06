import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingNumbers from "@/components/landing/LandingNumbers";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingHowItWorks from "@/components/landing/LandingHowItWorks";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingLocation from "@/components/landing/LandingLocation";
import LandingFooter from "@/components/landing/LandingFooter";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050A18",
        color: "#fff",
      }}
    >
      <LandingNavbar />
      <LandingHero />
      <LandingNumbers />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFAQ />
      <LandingLocation />
      <LandingFooter />
      <WhatsAppButton />
    </div>
  );
}
