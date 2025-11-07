import { useState } from "react";
import { Plus, Search, Edit, Trash2, Calculator, Percent, DollarSign, Building2, Users, FileText, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConceptoFacturacion {
  id: string;
  nombre: string;
  descripcion: string;
  tipoAplicacion: 'area' | 'coeficiente' | 'fijo' | 'individual' | 'producto';
  valorBase?: number;
  porcentajeBase?: number;
  conceptosRelacionados?: string[];
  esBaseImpuestos: boolean;
  impuestosAplicables: string[];
  aplicaIntereses: boolean;
  tasaInteres?: number;
  activo: boolean;
  fechaCreacion: string;
  ultimaModificacion: string;
}

type Impuesto = 'iva' | 'ica' | 'fuente';

export function FacturacionConceptos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingConcepto, setEditingConcepto] = useState<ConceptoFacturacion | null>(null);
  const [newConcepto, setNewConcepto] = useState<Partial<ConceptoFacturacion>>({
    nombre: "",
    descripcion: "",
    tipoAplicacion: "fijo",
    esBaseImpuestos: false,
    impuestosAplicables: [],
    aplicaIntereses: false,
    activo: true
  });

  // Mock data
  const [conceptos, setConceptos] = useState<ConceptoFacturacion[]>([
    {
      id: "CF-001",
      nombre: "Cuota de Administración",
      descripcion: "Cuota mensual de administración del conjunto residencial",
      tipoAplicacion: "coeficiente",
      valorBase: 850000,
      esBaseImpuestos: true,
      impuestosAplicables: ["iva"],
      aplicaIntereses: true,
      tasaInteres: 2,
      activo: true,
      fechaCreacion: "2024-01-15",
      ultimaModificacion: "2024-01-15"
    },
    {
      id: "CF-002",
      nombre: "Fondo de Reserva",
      descripcion: "Aporte mensual al fondo de reserva para emergencias",
      tipoAplicacion: "area",
      porcentajeBase: 0.5,
      esBaseImpuestos: false,
      impuestosAplicables: [],
      aplicaIntereses: false,
      activo: true,
      fechaCreacion: "2024-01-20",
      ultimaModificacion: "2024-01-20"
    },
    {
      id: "CF-003",
      nombre: "Intereses de Mora",
      descripcion: "Intereses por pagos atrasados",
      tipoAplicacion: "producto",
      conceptosRelacionados: ["CF-001"],
      porcentajeBase: 2,
      esBaseImpuestos: false,
      impuestosAplicables: [],
      aplicaIntereses: false,
      activo: true,
      fechaCreacion: "2024-02-01",
      ultimaModificacion: "2024-02-01"
    },
    {
      id: "CF-004",
      nombre: "Cuota Extraordinaria",
      descripcion: "Cuota especial para mantenimiento mayor",
      tipoAplicacion: "fijo",
      valorBase: 200000,
      esBaseImpuestos: true,
      impuestosAplicables: ["iva"],
      aplicaIntereses: true,
      tasaInteres: 2,
      activo: true,
      fechaCreacion: "2024-03-01",
      ultimaModificacion: "2024-03-01"
    },
    {
      id: "CF-005",
      nombre: "Multa por Ruido",
      descripcion: "Multa por disturbios después de las 10 PM",
      tipoAplicacion: "individual",
      valorBase: 50000,
      esBaseImpuestos: false,
      impuestosAplicables: [],
      aplicaIntereses: true,
      tasaInteres: 3,
      activo: true,
      fechaCreacion: "2024-03-15",
      ultimaModificacion: "2024-03-15"
    }
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getTipoAplicacionIcon = (tipo: string) => {
    switch (tipo) {
      case "area":
        return <Building2 className="h-4 w-4 text-blue-600" />;
      case "coeficiente":
        return <Users className="h-4 w-4 text-green-600" />;
      case "fijo":
        return <DollarSign className="h-4 w-4 text-purple-600" />;
      case "individual":
        return <FileText className="h-4 w-4 text-orange-600" />;
      case "producto":
        return <Calculator className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTipoAplicacionLabel = (tipo: string) => {
    switch (tipo) {
      case "area":
        return "Por Área";
      case "coeficiente":
        return "Por Coeficiente";
      case "fijo":
        return "Valor Fijo";
      case "individual":
        return "Valor Individual";
      case "producto":
        return "Producto de Conceptos";
      default:
        return tipo;
    }
  };

  const getTipoAplicacionColor = (tipo: string) => {
    switch (tipo) {
      case "area":
        return "bg-blue-100 text-blue-800";
      case "coeficiente":
        return "bg-green-100 text-green-800";
      case "fijo":
        return "bg-purple-100 text-purple-800";
      case "individual":
        return "bg-orange-100 text-orange-800";
      case "producto":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredConceptos = conceptos.filter((concepto) =>
    concepto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    concepto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateConcepto = () => {
    if (!newConcepto.nombre || !newConcepto.descripcion) return;

    const concepto: ConceptoFacturacion = {
      id: `CF-${Date.now()}`,
      nombre: newConcepto.nombre!,
      descripcion: newConcepto.descripcion!,
      tipoAplicacion: newConcepto.tipoAplicacion as any,
      valorBase: newConcepto.valorBase,
      porcentajeBase: newConcepto.porcentajeBase,
      conceptosRelacionados: newConcepto.conceptosRelacionados,
      esBaseImpuestos: newConcepto.esBaseImpuestos || false,
      impuestosAplicables: newConcepto.impuestosAplicables || [],
      aplicaIntereses: newConcepto.aplicaIntereses || false,
      tasaInteres: newConcepto.tasaInteres,
      activo: true,
      fechaCreacion: new Date().toISOString().split('T')[0],
      ultimaModificacion: new Date().toISOString().split('T')[0]
    };

    setConceptos(prev => [...prev, concepto]);
    setNewConcepto({
      nombre: "",
      descripcion: "",
      tipoAplicacion: "fijo",
      esBaseImpuestos: false,
      impuestosAplicables: [],
      aplicaIntereses: false,
      activo: true
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditConcepto = () => {
    if (!editingConcepto) return;

    setConceptos(prev =>
      prev.map(concepto =>
        concepto.id === editingConcepto.id
          ? { ...editingConcepto, ultimaModificacion: new Date().toISOString().split('T')[0] }
          : concepto
      )
    );
    setIsEditDialogOpen(false);
    setEditingConcepto(null);
  };

  const handleDeleteConcepto = (id: string) => {
    setConceptos(prev => prev.filter(concepto => concepto.id !== id));
  };

  const handleImpuestoToggle = (impuesto: Impuesto, isForNew: boolean = false) => {
    if (isForNew) {
      setNewConcepto(prev => ({
        ...prev,
        impuestosAplicables: prev.impuestosAplicables?.includes(impuesto)
          ? prev.impuestosAplicables.filter(i => i !== impuesto)
          : [...(prev.impuestosAplicables || []), impuesto]
      }));
    } else if (editingConcepto) {
      setEditingConcepto(prev => ({
        ...prev!,
        impuestosAplicables: prev!.impuestosAplicables.includes(impuesto)
          ? prev!.impuestosAplicables.filter(i => i !== impuesto)
          : [...prev!.impuestosAplicables, impuesto]
      }));
    }
  };

  const ConceptoForm = ({ concepto, isNew = false }: { concepto?: ConceptoFacturacion; isNew?: boolean }) => {
    const currentConcepto = isNew ? newConcepto : (concepto || editingConcepto);
    const setCurrentConcepto = isNew ? setNewConcepto : setEditingConcepto;

    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nombre" className="text-right">
            Nombre *
          </Label>
          <Input
            id="nombre"
            value={currentConcepto?.nombre || ""}
            onChange={(e) => setCurrentConcepto?.(prev => ({ ...prev!, nombre: e.target.value }))}
            className="col-span-3"
            placeholder="Nombre del concepto"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="descripcion" className="text-right">
            Descripción *
          </Label>
          <Textarea
            id="descripcion"
            value={currentConcepto?.descripcion || ""}
            onChange={(e) => setCurrentConcepto?.(prev => ({ ...prev!, descripcion: e.target.value }))}
            className="col-span-3"
            placeholder="Descripción detallada del concepto"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="tipoAplicacion" className="text-right">
            Tipo de Aplicación
          </Label>
          <Select
            value={currentConcepto?.tipoAplicacion || "fijo"}
            onValueChange={(value) => setCurrentConcepto?.(prev => ({ ...prev!, tipoAplicacion: value as any }))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fijo">Valor Fijo</SelectItem>
              <SelectItem value="area">Por Área</SelectItem>
              <SelectItem value="coeficiente">Por Coeficiente</SelectItem>
              <SelectItem value="individual">Valor Individual</SelectItem>
              <SelectItem value="producto">Producto de Conceptos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(currentConcepto?.tipoAplicacion === "fijo" || currentConcepto?.tipoAplicacion === "individual") && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="valorBase" className="text-right">
              Valor Base
            </Label>
            <Input
              id="valorBase"
              type="number"
              value={currentConcepto?.valorBase || ""}
              onChange={(e) => setCurrentConcepto?.(prev => ({ ...prev!, valorBase: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="Valor en pesos"
            />
          </div>
        )}

        {(currentConcepto?.tipoAplicacion === "area" || currentConcepto?.tipoAplicacion === "producto") && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="porcentajeBase" className="text-right">
              Porcentaje Base (%)
            </Label>
            <Input
              id="porcentajeBase"
              type="number"
              step="0.01"
              value={currentConcepto?.porcentajeBase || ""}
              onChange={(e) => setCurrentConcepto?.(prev => ({ ...prev!, porcentajeBase: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="Porcentaje"
            />
          </div>
        )}

        {currentConcepto?.tipoAplicacion === "producto" && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Conceptos Relacionados
            </Label>
            <div className="col-span-3 space-y-2">
              {conceptos.map((c) => (
                <div key={c.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`concepto-${c.id}`}
                    checked={currentConcepto?.conceptosRelacionados?.includes(c.id) || false}
                    onCheckedChange={() => {
                      const relacionados = currentConcepto?.conceptosRelacionados || [];
                      const nuevosRelacionados = relacionados.includes(c.id)
                        ? relacionados.filter(id => id !== c.id)
                        : [...relacionados, c.id];
                      setCurrentConcepto?.(prev => ({ ...prev!, conceptosRelacionados: nuevosRelacionados }));
                    }}
                  />
                  <Label htmlFor={`concepto-${c.id}`} className="text-sm">
                    {c.nombre}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Base de Impuestos
          </Label>
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="esBaseImpuestos"
                checked={currentConcepto?.esBaseImpuestos || false}
                onCheckedChange={(checked) => setCurrentConcepto?.(prev => ({ ...prev!, esBaseImpuestos: checked as boolean }))}
              />
              <Label htmlFor="esBaseImpuestos">
                Este concepto sirve como base para calcular impuestos
              </Label>
            </div>
          </div>
        </div>

        {currentConcepto?.esBaseImpuestos && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Impuestos Aplicables
            </Label>
            <div className="col-span-3 space-y-2">
              {(['iva', 'ica', 'fuente'] as Impuesto[]).map((impuesto) => (
                <div key={impuesto} className="flex items-center space-x-2">
                  <Checkbox
                    id={`impuesto-${impuesto}`}
                    checked={currentConcepto?.impuestosAplicables?.includes(impuesto) || false}
                    onCheckedChange={() => handleImpuestoToggle(impuesto, isNew)}
                  />
                  <Label htmlFor={`impuesto-${impuesto}`} className="text-sm uppercase">
                    {impuesto}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Aplica Intereses
          </Label>
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="aplicaIntereses"
                checked={currentConcepto?.aplicaIntereses || false}
                onCheckedChange={(checked) => setCurrentConcepto?.(prev => ({ ...prev!, aplicaIntereses: checked as boolean }))}
              />
              <Label htmlFor="aplicaIntereses">
                Este concepto genera intereses por mora
              </Label>
            </div>
          </div>
        </div>

        {currentConcepto?.aplicaIntereses && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tasaInteres" className="text-right">
              Tasa de Interés (%)
            </Label>
            <Input
              id="tasaInteres"
              type="number"
              step="0.01"
              value={currentConcepto?.tasaInteres || ""}
              onChange={(e) => setCurrentConcepto?.(prev => ({ ...prev!, tasaInteres: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="Tasa mensual de interés"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conceptos de Facturación</h1>
          <p className="text-muted-foreground">
            Gestión completa de conceptos para facturación masiva
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Concepto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Concepto de Facturación</DialogTitle>
              <DialogDescription>
                Define un nuevo concepto que podrá ser usado en la facturación por lotes.
              </DialogDescription>
            </DialogHeader>
            <ConceptoForm isNew={true} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateConcepto}>
                <Save className="mr-2 h-4 w-4" />
                Crear Concepto
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conceptos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {conceptos.length}
            </div>
            <p className="text-xs text-muted-foreground">
              conceptos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Intereses</CardTitle>
            <Percent className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-green-600">
              {conceptos.filter(c => c.aplicaIntereses).length}
            </div>
            <p className="text-xs text-muted-foreground">
              generan intereses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Impuestos</CardTitle>
            <Calculator className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-purple-600">
              {conceptos.filter(c => c.esBaseImpuestos).length}
            </div>
            <p className="text-xs text-muted-foreground">
              sirven como base
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Fijo</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-orange-600">
              {conceptos.filter(c => c.tipoAplicacion === 'fijo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              conceptos fijos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conceptos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Concepto</TableHead>
                <TableHead>Tipo Aplicación</TableHead>
                <TableHead>Valor/%</TableHead>
                <TableHead>Impuestos</TableHead>
                <TableHead>Intereses</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConceptos.map((concepto) => (
                <TableRow key={concepto.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{concepto.nombre}</div>
                      <div className="text-sm text-muted-foreground">{concepto.descripcion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTipoAplicacionIcon(concepto.tipoAplicacion)}
                      <Badge className={getTipoAplicacionColor(concepto.tipoAplicacion)}>
                        {getTipoAplicacionLabel(concepto.tipoAplicacion)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {concepto.tipoAplicacion === 'area' || concepto.tipoAplicacion === 'producto'
                      ? `${concepto.porcentajeBase}%`
                      : concepto.valorBase
                      ? formatCurrency(concepto.valorBase)
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {concepto.esBaseImpuestos ? (
                      <div className="flex gap-1">
                        {concepto.impuestosAplicables.map((imp) => (
                          <Badge key={imp} variant="outline" className="text-xs">
                            {imp.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No aplica</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {concepto.aplicaIntereses ? (
                      <Badge variant="secondary">
                        {concepto.tasaInteres}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No aplica</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={concepto.activo ? "default" : "secondary"}>
                      {concepto.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog open={isEditDialogOpen && editingConcepto?.id === concepto.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (open) setEditingConcepto(concepto);
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Editar Concepto de Facturación</DialogTitle>
                            <DialogDescription>
                              Modifica los detalles del concepto de facturación.
                            </DialogDescription>
                          </DialogHeader>
                          <ConceptoForm concepto={editingConcepto!} />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleEditConcepto}>
                              <Save className="mr-2 h-4 w-4" />
                              Guardar Cambios
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar Concepto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El concepto será eliminado permanentemente
                              y ya no estará disponible para facturación.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteConcepto(concepto.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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