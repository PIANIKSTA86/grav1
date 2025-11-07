import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Folder, Upload, Download, Eye, Trash2 } from "lucide-react";

export function Documentos() {
  const documentos = [
    {
      id: "DOC-001",
      nombre: "Reglamento de Propiedad Horizontal",
      tipo: "PDF",
      categoria: "Normativo",
      tamano: "2.5 MB",
      fechaSubida: "2025-10-15",
      estado: "Publicado"
    },
    {
      id: "DOC-002",
      nombre: "Acta Asamblea Ordinaria 2025",
      tipo: "PDF",
      categoria: "Actas",
      tamano: "1.8 MB",
      fechaSubida: "2025-10-20",
      estado: "Publicado"
    },
    {
      id: "DOC-003",
      nombre: "Presupuesto Anual 2026",
      tipo: "XLSX",
      categoria: "Financiero",
      tamano: "856 KB",
      fechaSubida: "2025-11-01",
      estado: "Borrador"
    },
    {
      id: "DOC-004",
      nombre: "Manual de Convivencia",
      tipo: "PDF",
      categoria: "Normativo",
      tamano: "3.2 MB",
      fechaSubida: "2025-09-10",
      estado: "Publicado"
    },
    {
      id: "DOC-005",
      nombre: "Plan de Mantenimiento 2025",
      tipo: "DOCX",
      categoria: "Mantenimiento",
      tamano: "1.2 MB",
      fechaSubida: "2025-10-25",
      estado: "Revisión"
    }
  ];

  const categorias = [
    { nombre: "Normativo", count: 2, color: "bg-blue-100 text-blue-800" },
    { nombre: "Actas", count: 1, color: "bg-green-100 text-green-800" },
    { nombre: "Financiero", count: 1, color: "bg-yellow-100 text-yellow-800" },
    { nombre: "Mantenimiento", count: 1, color: "bg-purple-100 text-purple-800" }
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-600" />;
      case "XLSX":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "DOCX":
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Publicado":
        return "bg-green-100 text-green-800";
      case "Borrador":
        return "bg-yellow-100 text-yellow-800";
      case "Revisión":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión Documental</h1>
          <p className="text-muted-foreground">
            Administra todos los documentos de la comunidad organizados por categorías
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentos.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documentos.filter(d => d.estado === "Publicado").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles para todos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documentos.filter(d => d.estado === "Revisión").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Pendientes de aprobación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorias.length}</div>
            <p className="text-xs text-muted-foreground">
              Organizadas por tipo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
            <CardDescription>
              Documentos organizados por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categorias.map((categoria) => (
                <div key={categoria.nombre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">{categoria.nombre}</span>
                  </div>
                  <Badge className={categoria.color}>
                    {categoria.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Documentos Recientes</CardTitle>
            <CardDescription>
              Lista de todos los documentos disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getTipoIcon(doc.tipo)}
                    <div>
                      <h4 className="font-medium">{doc.nombre}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{doc.tipo}</span>
                        <span>{doc.tamano}</span>
                        <span>{doc.fechaSubida}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.categoria}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getEstadoColor(doc.estado)}>
                      {doc.estado}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}