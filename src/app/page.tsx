import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
