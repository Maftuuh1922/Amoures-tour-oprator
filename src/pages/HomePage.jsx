import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import DestinationsSection from "../components/sections/DestinationsSection";
import WhyUs from "../components/sections/WhyUs";
import FeaturedTours from "../components/sections/FeaturedTours";
import CompanyProfile from "../components/sections/CompanyProfile";
import Testimonials from "../components/sections/Testimonials";
import ContactSection from "../components/sections/ContactSection";
import B2BSection from "../components/sections/B2BSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <DestinationsSection />
        <WhyUs />
        <FeaturedTours />
        <CompanyProfile />
        <Testimonials />
        <B2BSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
