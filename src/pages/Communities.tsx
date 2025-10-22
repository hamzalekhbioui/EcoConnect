import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const Communities = () => {
  const [communities, setCommunities] = useState<Tables<"communities">[]>([]);
  const [membersByCommunity, setMembersByCommunity] = useState<Record<string, { id: string; name: string }[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data: comms, error: cErr } = await supabase
        .from("communities")
        .select("id,name,description,sector,member_count,icon,created_at,updated_at")
        .order("name", { ascending: true });
      if (cErr) {
        setError(cErr.message);
        setLoading(false);
        return;
      }
      setCommunities(comms || []);
      const ids = (comms || []).map((c) => c.id);
      if (ids.length === 0) {
        setMembersByCommunity({});
        setLoading(false);
        return;
      }
      const { data: cmRows, error: cmErr } = await supabase
        .from("community_members")
        .select("community_id,user_id")
        .in("community_id", ids);
      const cmList = cmErr ? [] : (cmRows || []);
      const userIds = Array.from(new Set(cmList.map((r) => r.user_id)));
      let profiles: { user_id: string; first_name: string | null; last_name: string | null }[] = [];
      if (userIds.length > 0) {
        const { data: profs, error: pErr } = await supabase
          .rpc("get_public_profiles", { user_ids: userIds });
        if (pErr) {
          setError(pErr.message);
          setLoading(false);
          return;
        }
        profiles = profs || [];
      }
      const nameByUser: Record<string, string> = {};
      for (const p of profiles) {
        const first = (p.first_name || "").trim();
        const last = (p.last_name || "").trim();
        const full = `${first} ${last}`.trim() || "Membre";
        nameByUser[p.user_id] = full;
      }
      const agg: Record<string, { id: string; name: string }[]> = {};
      for (const row of cmList) {
        const name = nameByUser[row.user_id] || "Membre";
        if (!agg[row.community_id]) agg[row.community_id] = [];
        agg[row.community_id].push({ id: row.user_id, name });
      }
      for (const k of Object.keys(agg)) {
        agg[k] = agg[k]
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 6);
      }
      setMembersByCommunity(agg);
      setLoading(false);
    };
    load();
  }, []);

  const sectors = useMemo(() => {
    return Array.from(new Set(communities.map((c) => c.sector))).sort();
  }, [communities]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return communities.filter((c) => {
      const matchesText = !q || c.name.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
      const matchesSector = !sector || c.sector === sector;
      return matchesText && matchesSector;
    });
  }, [communities, search, sector]);

  const open = (id: string) => setOpenId(id);
  const close = () => setOpenId(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="bg-green-500 py-20">
        <div className="container mx-auto px-4">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              Annuaire des sous-communautés
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Explorez toutes les sous-communautés, filtrez par secteur et consultez leurs membres
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher une sous-communauté..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="min-w-[220px]">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tous les secteurs</option>
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Créer une communauté
          </Button>
        </div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards - will be empty for now */}
          {loading && (
            <div className="col-span-full text-center text-muted-foreground">Chargement...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">Aucune sous-communauté trouvée</div>
          )}
          {!loading && filtered.map((c) => (
            <Card key={c.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <CardDescription>{c.sector}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {(c.description || "").slice(0, 120)}{(c.description && c.description.length > 120) ? "…" : ""}
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Membres</div>
                    <div className="flex flex-wrap gap-2">
                      {(membersByCommunity[c.id] || []).map((m) => (
                        <span key={m.id} className="px-2 py-1 text-xs rounded bg-muted text-foreground">
                          {m.name}
                        </span>
                      ))}
                      {(!membersByCommunity[c.id] || membersByCommunity[c.id].length === 0) && (
                        <span className="text-sm text-muted-foreground">Aucun membre</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{c.member_count || 0} membres</span>
                    <Button variant="outline" size="sm" onClick={() => open(c.id)}>
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Message */}
        {!loading && communities.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune communauté disponible pour le moment
            </h3>
            <p className="text-muted-foreground mb-4">
              Les communautés seront bientôt disponibles. Revenez plus tard !
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Créer la première communauté
            </Button>
          </div>
        )}
      </div>

      {openId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-xl rounded-lg bg-background border border-border shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="font-semibold text-lg">
                {communities.find((x) => x.id === openId)?.name}
              </div>
              <button aria-label="Fermer" className="p-1 hover:opacity-80" onClick={close}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                {communities.find((x) => x.id === openId)?.description || "Aucune description"}
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Membres</div>
                <div className="flex flex-wrap gap-2">
                  {(membersByCommunity[openId] || []).map((m) => (
                    <span key={m.id} className="px-2 py-1 text-xs rounded bg-muted text-foreground">
                      {m.name}
                    </span>
                  ))}
                  {(!membersByCommunity[openId] || membersByCommunity[openId].length === 0) && (
                    <span className="text-sm text-muted-foreground">Aucun membre</span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border text-right">
              <Button variant="outline" onClick={close}>Fermer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;
