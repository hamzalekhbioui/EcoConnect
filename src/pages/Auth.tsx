import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email non confirmé",
            description: "Veuillez vérifier votre email et cliquer sur le lien de confirmation",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur CollectivIA",
        });
        
        // Reset form
        setLoginEmail("");
        setLoginPassword("");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if email already exists in profiles table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', signupEmail)
        .single();

      if (existingProfile) {
        toast({
          title: "Erreur d'inscription",
          description: "Cette adresse email est déjà utilisée",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
          data: {
            first_name: signupFirstName,
            last_name: signupLastName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
          toast({
            title: "Erreur d'inscription",
            description: "Cette adresse email est déjà utilisée",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: authError.message,
            variant: "destructive",
          });
        }
      } else if (authData.user) {
        // Store additional user data in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            user_id: authData.user.id,
            email: signupEmail,
            first_name: signupFirstName,
            last_name: signupLastName,
            phone: '', // Will be filled later
            sector: '', // Will be filled later
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Create user role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: 'visitor'
          }]);

        if (roleError) {
          console.error('Error creating user role:', roleError);
        }

        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vérifiez votre email pour confirmer votre compte.",
        });

        // Reset form
        setSignupEmail("");
        setSignupPassword("");
        setSignupFirstName("");
        setSignupLastName("");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-glow" />
            <span className="text-3xl font-bold text-foreground">CollectivIA</span>
          </div>
          <p className="text-muted-foreground">Plateforme d'Intelligence Collective</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="bg-card border border-border rounded-lg p-6 shadow-elegant">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="bg-card border border-border rounded-lg p-6 shadow-elegant">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">Prénom</Label>
                    <Input
                      id="signup-firstname"
                      type="text"
                      value={signupFirstName}
                      onChange={(e) => setSignupFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Nom</Label>
                    <Input
                      id="signup-lastname"
                      type="text"
                      value={signupLastName}
                      onChange={(e) => setSignupLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Inscription..." : "Créer mon compte"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>

        
      </div>
    </div>
  );
};

export default Auth;
