import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Heart, Palette, Code, Sprout, GraduationCap } from "lucide-react";

const communities = [
  {
    icon: Briefcase,
    name: "Coaches Professionnels",
    members: 85,
    category: "Développement personnel",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Heart,
    name: "Professionnels de Santé",
    members: 120,
    category: "Santé & bien-être",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: Palette,
    name: "Créatifs & Artistes",
    members: 95,
    category: "Arts & Culture",
    color: "bg-accent/10 text-accent"
  },
  {
    icon: Code,
    name: "Tech & Innovation",
    members: 110,
    category: "Technologie",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Sprout,
    name: "Écologie & Durabilité",
    members: 78,
    category: "Environnement",
    color: "bg-secondary/10 text-secondary"
  },
  {
    icon: GraduationCap,
    name: "Éducation & Formation",
    members: 92,
    category: "Éducation",
    color: "bg-accent/10 text-accent"
  }
];

const Communities = () => {
  return (
    <section id="communities" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nos communautés
          </h2>
          <p className="text-lg text-muted-foreground">
            Rejoignez des professionnels de votre secteur et développez votre réseau dans un esprit de collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => {
            const Icon = community.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-lg ${community.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{community.members} membres</Badge>
                  </div>
                  <CardTitle className="text-xl">{community.name}</CardTitle>
                  <CardDescription>{community.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Échangez compétences, contacts et opportunités avec des professionnels de votre domaine
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Communities;
