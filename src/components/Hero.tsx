import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X } from "lucide-react";
import heroImage from "@/assets/hero-community.jpg";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToJoinForm = () => {
    const joinSection = document.getElementById("join");
    if (joinSection) {
      joinSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-green-500 py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        {/* Centered content on green background */}
        <div className="text-center mb-12">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mx-auto">
              <Sparkles className="h-4 w-4" />
              Intelligence Collective
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to EcoConnect
            </h1>

            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Construire un avenir durable grâce à l'intelligence collective et à
              la collaboration communautaire
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="group bg-orange-500 text-white hover:bg-orange-400"
                onClick={scrollToJoinForm}
              >
                Demander l'accès
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* New “En savoir plus” button */}
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-green-700 hover:bg-gray-100"
                onClick={() => setIsOpen(true)}
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-sm text-white/80">Membres actifs</div>
          </div>
          <div className="h-12 w-px bg-white/30" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-sm text-white/80">Projets collaboratifs</div>
          </div>
          <div className="h-12 w-px bg-white/30" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">15</div>
            <div className="text-sm text-white/80">Communautés</div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Présentation de la plateforme
            </h3>
            <p className="text-gray-600 mb-4">
              EcoConnect est une plateforme communautaire qui facilite les échanges
              de ressources, de compétences et de savoirs entre professionnels
              engagés pour un avenir durable.
            </p>
            <p className="text-gray-600 mb-6">
              Notre mission est de favoriser la collaboration, de créer des synergies
              et de développer une économie circulaire fondée sur le partage, la
              solidarité et l’innovation.
            </p>

            <Button
              onClick={() => setIsOpen(false)}
              className="bg-yellow-500 text-white px-5 py-2 rounded-full font-medium hover:bg-yellow-600 transition"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
