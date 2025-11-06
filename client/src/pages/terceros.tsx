import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Terceros() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("todos");

  //todo: remove mock functionality
  const terceros = [
    {
      id: "1",
      tipo: "natural",
      tipoId: "CC",
      numeroId: "1234567890",
      nombre: "María González Pérez",
      email: "maria.gonzalez@email.com",
      telefono: "310 123 4567",
      activo: true,
    },
    {
      id: "2",
      tipo: "natural",
      tipoId: "CC",
      numeroId: "9876543210",
      nombre: "Carlos Rodríguez López",
      email: "carlos.rodriguez@email.com",
      telefono: "320 987 6543",
      activo: true,
    },
    {
      id: "3",
      tipo: "juridica",
      tipoId: "NIT",
      numeroId: "900123456-7",
      nombre: "Constructora ABC S.A.S.",
      email: "info@constructoraabc.com",
      telefono: "601 234 5678",
      activo: true,
    },
    {
      id: "4",
      tipo: "natural",
      tipoId: "CE",
      numeroId: "CE123456",
      nombre: "Ana Martínez Silva",
      email: "ana.martinez@email.com",
      telefono: "315 456 7890",
      activo: true,
    },
    {
      id: "5",
      tipo: "juridica",
      tipoId: "NIT",
      numeroId: "900234567-8",
      nombre: "Servicios Generales XYZ Ltda.",
      email: "contacto@serviciosxyz.com",
      telefono: "601 345 6789",
      activo: false,
    },
  ];

  const filteredTerceros = terceros.filter((t) => {
    const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.numeroId.includes(searchTerm);
    const matchesTab = activeTab === "todos" ||
      (activeTab === "natural" && t.tipo === "natural") ||
      (activeTab === "juridica" && t.tipo === "juridica");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Terceros</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de propietarios, inquilinos y proveedores
          </p>
        </div>
        <Button data-testid="button-nuevo-tercero" onClick={() => console.log("Nuevo tercero")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tercero
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o identificación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-terceros"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="todos" data-testid="tab-todos">Todos</TabsTrigger>
                <TabsTrigger value="natural" data-testid="tab-natural">Personas Naturales</TabsTrigger>
                <TabsTrigger value="juridica" data-testid="tab-juridica">Personas Jurídicas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Identificación</TableHead>
                <TableHead>Nombre / Razón Social</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTerceros.map((tercero) => (
                <TableRow key={tercero.id} data-testid={`row-tercero-${tercero.id}`}>
                  <TableCell>
                    {tercero.tipo === "natural" ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Natural</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Jurídica</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-mono text-sm">{tercero.numeroId}</p>
                      <p className="text-xs text-muted-foreground">{tercero.tipoId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{tercero.nombre}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{tercero.email}</p>
                      <p className="text-muted-foreground">{tercero.telefono}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tercero.activo ? "default" : "secondary"}>
                      {tercero.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${tercero.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Editar", tercero.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Eliminar", tercero.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}