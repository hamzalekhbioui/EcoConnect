import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Clock, CheckCircle, XCircle, User, Edit2, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";



interface JoinRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  project_description?: string;
  sector?: string;
  skills?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
}



interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'member' | 'visitor';
  created_at: string;
}

const UserDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [joinRequest, setJoinRequest] = useState<JoinRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    checkUserStatus();
  }, []);


  const checkUserStatus = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // Get user profile and role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      console.log('Profile data:', profileData);
      console.log('Profile error:', profileError);
      console.log('Role data:', roleData);

      if (profileData) {
        setProfile({
          ...profileData,
          role: roleData?.role || 'visitor'
        });
        // Attempt to read avatar if present
        // @ts-ignore - avatar_url may not exist on typed interface
        if ((profileData as any).avatar_url) {
          setAvatarUrl((profileData as any).avatar_url as string);
        }
      } else if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one
        console.log('Creating profile for user...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: user.id,
            email: user.email,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || ''
          }])
          .select()
          .single();

        if (newProfile) {
          setProfile({
            ...newProfile,
            role: 'visitor'
          });
        }
      }

      // Get membership request status
      // Use untyped call since generated Database types don't include membership_requests
      const { data: requestData, error: requestError } = await (supabase as any)
        .from('membership_requests')
        .select('id, first_name, last_name, email, phone, sector, project_description, skills, status, created_at, reviewed_at')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (requestData) {
        setJoinRequest(requestData as JoinRequest);
      }
    //     });
    //   }

    } catch (error) {
      console.error('Error checking user status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos informations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    setEditFirstName(profile?.first_name || "");
    setEditLastName(profile?.last_name || "");
    setEditSkills(joinRequest?.skills || "");
    
    
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: editFirstName, last_name: editLastName })
        .eq('user_id', user.id);

      if (error) throw error;

      // If there is a membership request loaded, persist the edited fields there too
      if (joinRequest?.id) {
        const { data: updatedReq, error: skillsError } = await (supabase as any)
          .from('membership_requests')
          .update({ skills: editSkills, first_name: editFirstName, last_name: editLastName })
          .eq('id', joinRequest.id)
          .select('id, skills, first_name, last_name')
          .single();

        if (skillsError) throw skillsError;

        if (updatedReq) {
          setJoinRequest(prev => prev ? { ...prev, skills: updatedReq.skills, first_name: updatedReq.first_name, last_name: updatedReq.last_name } : prev);
        }
      }

      setProfile(prev => prev ? { ...prev, first_name: editFirstName, last_name: editLastName } : prev);
      setIsEditing(false);
      toast({ title: 'Profil mis à jour', description: 'Vos informations ont été enregistrées.' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: "Impossible de mettre à jour le profil", variant: 'destructive' });
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      setAvatarUrl(publicUrl);

      // Try to persist URL in profiles table if column exists
      const { error: updateError } = await supabase
        .from('profiles')
        // @ts-ignore avatar_url may not exist; best-effort
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError && updateError.code !== '42703') {
        // 42703: undefined column — ignore silently if column doesn't exist
        throw updateError;
      }

      toast({ title: 'Photo mise à jour', description: 'Votre photo de profil a été mise à jour.' });
    } catch (e: any) {
      toast({ title: 'Erreur', description: "Échec du téléversement de la photo", variant: 'destructive' });
    } finally {
      setIsUploading(false);
      // reset input value to allow re-upload same file if needed
      event.target.value = '';
    }
  };

  

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  const getMembershipLevel = () => {
    if (profile?.role === 'admin') {
      return { level: 'Administrateur', icon: <Crown className="h-5 w-5 text-purple-500" />, color: 'text-purple-600' };
    } else if (profile?.role === 'member') {
      return { level: 'Membre Premium', icon: <Crown className="h-5 w-5 text-yellow-500" />, color: 'text-yellow-600' };
    } else {
      return { level: 'Visiteur', icon: <User className="h-5 w-5 text-gray-500" />, color: 'text-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour voir votre tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const membership = getMembershipLevel();

  return (
    
    <div className="min-h-screen bg-background">
      <Navbar></Navbar>
      {/* Header */}
      <div className="bg-green-500 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-serif">
              Mon Profil
            </h1>
            <p className="text-white/90 max-w-2xl text-lg">
              Gérez votre compte et consultez votre statut d'adhésion
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8">

        <div className="grid gap-6">
          {/* VIP Banner for Members */}
          {profile?.role === 'member' && (
            <Card className="border-yellow-300 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Membre VIP
                </CardTitle>
                <CardDescription className="text-yellow-700">
                  Félicitations ! Votre adhésion a été approuvée. Vous bénéficiez des privilèges VIP.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Membership Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {membership.icon}
                Statut d'adhésion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg font-semibold ${membership.color}`}>
                    {membership.level}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.role === 'member' || profile?.role === 'admin' 
                      ? 'Vous avez accès à toutes les fonctionnalités premium'
                      : 'Accès limité - Demandez l\'adhésion pour plus de fonctionnalités'
                    }
                  </p>
                </div>
                {(profile?.role === 'member' || profile?.role === 'admin') && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                    Premium
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Join Request Status
          {joinRequest && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(joinRequest.status)}
                  Demande d'adhésion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Statut:</span>
                    {getStatusBadge(joinRequest.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date de soumission:</span>
                    <span className="text-sm">
                      {new Date(joinRequest.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {joinRequest.reviewed_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Date de traitement:</span>
                      <span className="text-sm">
                        {new Date(joinRequest.reviewed_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}

                  {joinRequest.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Votre demande est en cours d'examen. Notre équipe vous contactera prochainement.
                      </p>
                    </div>
                  )}

                  {joinRequest.status === 'approved' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-800">
                        Félicitations ! Votre demande a été approuvée. Vous êtes maintenant membre premium.
                      </p>
                    </div>
                  )}

                  {joinRequest.status === 'rejected' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800">
                        Votre demande n'a pas été approuvée. Vous pouvez soumettre une nouvelle demande.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* User Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informations du compte</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleStartEdit}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>Enregistrer</Button>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>Annuler</Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-24 w-24 rounded-full bg-muted overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"  
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? 'Téléversement...' : 'Changer la photo'}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {!isEditing ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Nom et prénom:</span>
                        <span className="text-sm">{profile?.first_name} {profile?.last_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{profile?.email}</span>
                      </div>
                      {profile?.role === 'member' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Téléphone:</span>       
                            <span className="text-sm">{joinRequest?.phone || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Secteur d'activité:</span>
                            <span className="text-sm">{joinRequest?.sector || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Compétences (skills):</span>
                            <span className="text-sm">{joinRequest?.skills || '—'}</span>
                          </div>
                          {/* <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Bio:</span>
                            <span className="text-sm">{joinRequest?.sector || (profile as any)?.sector || '—'}</span>
                          </div> */}
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Membre depuis:</span>
                        <span className="text-sm">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Prénom</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                          value={editFirstName}
                          onChange={(e) => setEditFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Nom</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-1">Compétences (skills)</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                          value={editSkills}
                          onChange={(e) => setEditSkills(e.target.value)}
                        />
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
