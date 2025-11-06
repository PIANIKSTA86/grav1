import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

//todo: remove mock functionality
const mockSuscriptores = [
  { id: "1", nombre: "Edificio Torres del Parque", nit: "900123456-7" },
  { id: "2", nombre: "Conjunto Residencial Los Arrayanes", nit: "900234567-8" },
  { id: "3", nombre: "Conjunto Campestre El Retiro", nit: "900345678-9" },
];

export function SuscriptorSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("1");

  const selectedSuscriptor = mockSuscriptores.find((s) => s.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
          data-testid="button-suscriptor-selector"
        >
          <span className="truncate">
            {selectedSuscriptor ? selectedSuscriptor.nombre : "Seleccionar copropiedad..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Buscar copropiedad..." data-testid="input-search-suscriptor" />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {mockSuscriptores.map((suscriptor) => (
                <CommandItem
                  key={suscriptor.id}
                  value={suscriptor.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    console.log("Suscriptor seleccionado:", suscriptor.nombre);
                  }}
                  data-testid={`item-suscriptor-${suscriptor.id}`}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === suscriptor.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{suscriptor.nombre}</span>
                    <span className="text-xs text-muted-foreground">{suscriptor.nit}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}