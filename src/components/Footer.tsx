import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow" />
              <span className="text-xl font-bold">CollectivIA</span>
            </div>
            <p className="text-sm text-background/80">
              Ensemble vers une économie circulaire et durable
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#about" className="hover:text-background transition-colors">À propos</a></li>
              <li><a href="#communities" className="hover:text-background transition-colors">Communautés</a></li>
              <li><a href="#resources" className="hover:text-background transition-colors">Ressources</a></li>
              <li><a href="#join" className="hover:text-background transition-colors">Nous rejoindre</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Communauté</h3>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Boutique</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Espace membres</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Événements</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Projets</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-background/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@collectivia.fr
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Paris, France
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
          <p>© 2025 CollectivIA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
