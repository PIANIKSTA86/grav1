import { useState } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Suscriptores() {
  const [searchTerm, setSearchTerm] = useState("");

  //todo: remove mock functionality
  const suscriptores = [
    {
      id: "1",
      nombre: "Edificio Torres del Parque",
      nit: "900123456",
      direccion: "Cra 5 # 26-00, Bogotá",
      telefono: "601 234 5678",
      email: "admin@torresdelparque.com",
      activo: true,
      unidades: 125,
    },
    {
      id: "2",
      nombre: "Conjunto Residencial Los Alamos",
      nit: "900987654",
      direccion: "Calle 85 # 15-20, Bogotá",
      telefono: "601 345 6789",
      email: "info@losarrayanes.com",
      activo: true,
      unidades: 68,
    },
    {
      id: "3",
      nombre: "Conjunto Campestre El Retiro",
      nit: "900345678-9",
      direccion: "Km 4 Vía La Calera",
      telefono: "601 456 7890",
      email: "contacto@elretiro.com",
      activo: false,
      unidades: 42,
    },
  ];

  const filteredSuscriptores = suscriptores.filter((s) =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nit.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Suscriptores</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestión de copropiedades registradas en el sistema
          </p>
        </div>
        <Button data-testid="button-nuevo-suscriptor" onClick={() => console.log("Nuevo suscriptor")}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Suscriptor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o NIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-suscriptores"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuscriptores.map((suscriptor) => (
                <TableRow key={suscriptor.id} data-testid={`row-suscriptor-${suscriptor.id}`}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{suscriptor.nombre}</p>
                      <p className="text-xs text-muted-foreground">{suscriptor.direccion}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{suscriptor.nit}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{suscriptor.email}</p>
                      <p className="text-muted-foreground">{suscriptor.telefono}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{suscriptor.unidades}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={suscriptor.activo ? "default" : "secondary"}>
                      {suscriptor.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-actions-${suscriptor.id}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log("Editar", suscriptor.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Eliminar", suscriptor.id)} className="text-destructive">
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