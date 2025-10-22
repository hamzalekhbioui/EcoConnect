import { Users, RefreshCw, TreePine } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Connecter",
    description: "Trouvez des professionnels et des collaborateurs partageant vos valeurs et votre passion pour la durabilité et l’impact positif."
  },
  {
    icon: RefreshCw,
    title: "Échanger",
    description: "Partagez et accédez à des ressources, outils et connaissances précieux grâce à notre marché communautaire."
  },
  {
    icon: TreePine,
    title: "Transformer",
    description: "Collaborez sur des projets qui génèrent un changement positif durable et contribuent à une économie circulaire et durable."
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Pourquoi nous rejoindre ?
          </h2>
          <p className="text-lg text-muted-foreground">
          EcoConnect est la plateforme communautaire qui transforme les échanges en opportunités : ressources, savoirs et collaborations. Nous permettons aux professionnels, entrepreneurs sociaux et acteurs de la durabilité de construire ensemble une économie circulaire
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-16 w-16 rounded-xl bg-green-50 flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
                  <Icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-left leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
