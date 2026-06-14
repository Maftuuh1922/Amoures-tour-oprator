import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import DestinationsSection from "../components/sections/DestinationsSection";
import FeaturedTours from "../components/sections/FeaturedTours";
import WhyUs from "../components/sections/WhyUs";
import CompanyProfile from "../components/sections/CompanyProfile";
import Testimonials from "../components/sections/Testimonials";
import B2BSection from "../components/sections/B2BSection";
import ContactSection from "../components/sections/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* 1. Hero — first impression & CTA */}
        <HeroSection />
        {/* 2. Destinations — inspire & explore */}
        <DestinationsSection />
        {/* 3. Featured Tours — concrete offerings */}
        <FeaturedTours />
        {/* 4. Why Us — value proposition after showing product */}
        <WhyUs />
        {/* 5. About — build trust & credibility */}
        <CompanyProfile />
        {/* 6. Testimonials — social proof */}
        <Testimonials />
        {/* 7. B2B — business partnership CTA */}
        <B2BSection />
        {/* 8. Contact — final conversion point */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
