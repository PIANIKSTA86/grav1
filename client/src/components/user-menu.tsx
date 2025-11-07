import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    return null;
  }

  const iniciales = `${user.nombre[0]}${user.apellido[0]}`;

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/landing");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt={`${user.nombre} ${user.apellido}`} />
            <AvatarFallback>{iniciales}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{`${user.nombre} ${user.apellido}`}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="menu-item-perfil" onClick={() => console.log("Ver perfil")}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="menu-item-configuracion" onClick={() => console.log("Configuración")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="menu-item-logout" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}