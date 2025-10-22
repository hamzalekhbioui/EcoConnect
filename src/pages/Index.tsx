import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Communities from "@/components/Communities";
import JoinForm from "@/components/JoinForm";
import Footer from "@/components/Footer";
import Partenaires from "../components/Partenaires";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Communities />
      <Partenaires />
      <JoinForm />
      <Footer />
      
    </div>
  );
};

export default Index;
