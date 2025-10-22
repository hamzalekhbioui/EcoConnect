import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('visitor');
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      } else {
        setUserRole('visitor');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (data) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur CollectivIA",
      });
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow" />
            <span className="text-xl font-bold text-foreground">CollectivIA</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate("/home")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => navigate("/communities")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Communautés
            </button>
            <button 
              onClick={() => navigate("/resources")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Ressources
            </button>
            {/* <button 
              onClick={() => navigate("/join")} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Nous rejoindre
            </button> */}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" className="group bg-orange-500 text-white hover:bg-orange-400" onClick={() => navigate("/dashboard")}>
                  Profile
                </Button>
                {userRole === 'admin' && (
                  <Button variant="ghost" onClick={() => navigate("/admin")}>
                    Administration
                  </Button>
                )}
                
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                  </Button> 
              </>
            ) : (
              <>
                {/* <Button variant="ghost" onClick={() => navigate("/app")}>
                  <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                </Button> */}
                
              </>
            )}
          </div>

          {/* Mobile menu button
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div> */}

        {/* Mobile Navigation
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                À propos
              </a>
              <a href="#communities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Communautés
              </a>
              <a href="#resources" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Ressources
              </a>
              <a href="#join" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Nous rejoindre
              </a>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground px-2">
                      {user.email}
                    </span>
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    
                  </>
                )}
              </div>
            </div>
          </div>
        )} */}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
