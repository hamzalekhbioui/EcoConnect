import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, User, Shield, Mail, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  role: 'admin' | 'member' | 'visitor';
}

interface MembershipRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  project_description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/auth';
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleData?.role !== 'admin') {
        toast({
          title: "Accès refusé",
          description: "Vous devez être administrateur pour accéder à ce panel",
          variant: "destructive",
        });
        window.location.href = '/dashboard';
        return;
      }

      setCurrentUser(user);
      loadData();
    } catch (error) {
      console.error('Auth check error:', error);
      window.location.href = '/auth';
    }
  };

  const loadData = async () => {
    try {
      // Load users with their roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name,
          email,
          created_at,
          user_roles!inner(role)
        `);

      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        role: (profile.user_roles as any)?.[0]?.role || 'visitor'
      })) || [];

      setUsers(usersWithRoles);

      // Load membership requests
      const { data: requests } = await (supabase as any)
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      setMembershipRequests((requests || []).map(request => ({
        ...request,
        status: request.status as 'pending' | 'approved' | 'rejected'
      })));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'member' | 'visitor') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Rôle mis à jour",
        description: `Le rôle de l'utilisateur a été changé en ${newRole}`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      });
    }
  };

  const updateMembershipRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await (supabase as any)
        .from('membership_requests')
        .update({ 
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUser?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      // If approved, update user role to member
      if (status === 'approved') {
        const request = membershipRequests.find(r => r.id === requestId);
        if (request) {
          console.log('Approving request for email:', request.email);
          
          // Find user by email directly from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('email', request.email)
            .single();

          console.log('Profile data:', profileData, 'Error:', profileError);

          if (profileData) {
            // Use upsert to handle both insert and update cases
            const { error: roleError } = await supabase
              .from('user_roles')
              .upsert({ 
                user_id: profileData.user_id, 
                role: 'member' 
              }, {
                onConflict: 'user_id'
              });

            console.log('Role update error:', roleError);
            
            if (roleError) {
              console.error('Failed to update user role:', roleError);
            } else {
              console.log('Successfully updated user role to member');
            }
          } else {
            console.error('No profile found for email:', request.email);
          }
        }
      }

      toast({
        title: "Demande mise à jour",
        description: `La demande a été ${status === 'approved' ? 'approuvée' : 'rejetée'}`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la demande",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'member':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel d'Administration</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs et les demandes d'adhésion
          </p>
        </div>

        <div className="grid gap-8">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les rôles et permissions des utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle Actuel</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span>{user.first_name} {user.last_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'member' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value: 'admin' | 'member' | 'visitor') => 
                            updateUserRole(user.user_id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor">Visiteur</SelectItem>
                            <SelectItem value="member">Membre</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Membership Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Demandes d'Adhésion
              </CardTitle>
              <CardDescription>
                Approuvez ou rejetez les demandes d'adhésion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membershipRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span>{request.first_name} {request.last_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.project_description}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            request.status === 'approved' ? 'default' : 
                            request.status === 'rejected' ? 'destructive' : 
                            'secondary'
                          }
                        >
                          {request.status === 'approved' ? 'Approuvée' :
                           request.status === 'rejected' ? 'Rejetée' : 'En attente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateMembershipRequest(request.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateMembershipRequest(request.id, 'rejected')}
                            >
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
