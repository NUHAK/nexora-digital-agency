import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import AboutSection from "../components/About/AboutSection";
import ServicesSection from "../components/Service/ServiceSection";
import WhyUs from "../components/WhyUs/WhyUs";
import SelectedWork from "../components/SelectedWork/SelectedWork";
import Pricing from "../components/Pricing/Pricing";
import ContactSection from "../components/Contact/ContactSection";
import Footer from "../components/Footer/Footer";
import TestimonialsSection from "../components/Testimonial/TestimonialsSection";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection/>
      <WhyUs/>
      <SelectedWork/>
      <TestimonialsSection/>
      <Pricing/>
      <ContactSection/>
      <Footer/>
    </>
  );
}

export default Home;