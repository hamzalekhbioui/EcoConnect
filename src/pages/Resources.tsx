import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="bg-green-500 py-20">
        <div className="container mx-auto px-4">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">
              Community Resources
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Discover and share valuable resources within our collaborative community. Access free and paid content created by fellow members to support your sustainable projects.
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
              placeholder="Rechercher une ressource..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Catégories</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Tous</Button>
            <Button variant="outline" size="sm">Outils</Button>
            <Button variant="outline" size="sm">Guides</Button>
            <Button variant="outline" size="sm">Templates</Button>
            <Button variant="outline" size="sm">Formations</Button>
            <Button variant="outline" size="sm">Rapports</Button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder cards - will be empty for now */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ressource 1</CardTitle>
                  <CardDescription>Description de la ressource</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>PDF • 2.3 MB</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ressource 2</CardTitle>
                  <CardDescription>Description de la ressource</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>DOCX • 1.8 MB</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Ressource 3</CardTitle>
                  <CardDescription>Description de la ressource</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>XLSX • 3.1 MB</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State Message */}
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aucune ressource disponible pour le moment
          </h3>
          <p className="text-muted-foreground mb-4">
            Les ressources seront bientôt disponibles. Revenez plus tard !
          </p>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Partager une ressource
          </Button>
        </div>

        
      </div>
    </div>
  );
};

export default Resources;
