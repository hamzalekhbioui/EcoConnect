import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";


const JoinForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectorValue, setSectorValue] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const userData = {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        project_description: formData.get('project') as string,
        sector: sectorValue,
        skills: formData.get('skills') as string,
      };
      if (!sectorValue) {
        throw new Error("Veuillez sélectionner votre secteur d'activité");
      }
      
      // Save to Supabase database
      const { error } = await (supabase as any)
        .from('membership_requests')
        .insert([userData]);
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Demande envoyée !",
        description: "Un membre de notre équipe vous contactera prochainement pour un entretien.",
      });
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      setSectorValue("");
      
    } catch (error) {
      console.error("Error saving join request:", error);
      let message = "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        message = (error as any).message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: "Erreur",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <>
    {/* Yellow background section */}
    <section id="join" className="relative overflow-hidden bg-yellow-500 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prêt à faire partie du changement ?

          </h2>
          <p className="text-lg text-muted-foreground">
            Rejoignez EcoConnect dès aujourd’hui et faites partie d’une communauté mondiale qui œuvre ensemble pour un monde plus durable et équitable
          </p>
        </div>
      </div>
    </section>

    <br></br>
    <br></br>

    <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Inscrivez-vous</h3>
              <p className="text-muted-foreground">
                Créez votre compte et remplissez votre profil pour rejoindre la communauté
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Explorez</h3>
              <p className="text-muted-foreground">
                Découvrez les communautés, ressources et opportunités disponibles
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Collaborez</h3>
              <p className="text-muted-foreground">
                Participez à des projets et créez des synergies avec d'autres membres
              </p>
            </div>
          </div>
        </div>
    {/* Form section without yellow background */}
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Demande d'adhésion</CardTitle>
              <CardDescription>
                Partagez-nous votre projet et comment vous souhaitez contribuer à la communauté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" type="tel" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité</Label>
                  <Select value={sectorValue} onValueChange={setSectorValue} required>
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Sélectionnez votre secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coaching">Coaching professionnel</SelectItem>
                      <SelectItem value="health">Santé & bien-être</SelectItem>
                      <SelectItem value="creative">Créatifs & Artistes</SelectItem>
                      <SelectItem value="tech">Tech & Innovation</SelectItem>
                      <SelectItem value="ecology">Écologie & Durabilité</SelectItem>
                      <SelectItem value="education">Éducation & Formation</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Compétences (skills)</Label>
                  <Input id="skills" name="skills" placeholder="Ex: React, Node.js, Leadership, Gestion de projet" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Parlez-nous de votre projet</Label>
                  <Textarea
                    id="project"
                    name="project"
                    placeholder="Décrivez votre projet et comment vous souhaitez contribuer à la communauté..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </>
);

};

export default JoinForm;
