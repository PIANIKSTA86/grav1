import { Link, useLocation } from "wouter";
import {
  Home,
  Building2,
  Package,
  Users,
  FileSpreadsheet,
  FileText,
  ClipboardList,
  Receipt,
  Wallet,
  UserCog,
  DollarSign,
  Package2,
  FileBarChart,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function HorizontalHeader() {
  const [location] = useLocation();

  //todo: remove mock functionality
  const suscriptorActual = {
    nombre: "Edificio Torres del Parque",
    nit: "900123456-7",
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 mr-6" data-testid="link-home">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground font-bold">
              G
            </div>
            <span className="font-semibold text-lg hidden md:inline-block">Gravi</span>
          </a>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isActive("/") && "bg-accent"
                  )}
                  data-testid="nav-dashboard"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-gestion">
                Gestión
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <li>
                    <Link href="/suscriptores">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/suscriptores") && "bg-accent"
                        )}
                        data-testid="nav-suscriptores"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div className="text-sm font-medium">Suscriptores</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/unidades">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/unidades") && "bg-accent"
                        )}
                        data-testid="nav-unidades"
                      >
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <div className="text-sm font-medium">Unidades</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terceros">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/terceros") && "bg-accent"
                        )}
                        data-testid="nav-terceros"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <div className="text-sm font-medium">Terceros</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-contabilidad">
                Contabilidad
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <li>
                    <Link href="/plan-cuentas">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/plan-cuentas") && "bg-accent"
                        )}
                        data-testid="nav-plan-cuentas"
                      >
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <div className="text-sm font-medium">Plan de Cuentas</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/comprobantes">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/comprobantes") && "bg-accent"
                        )}
                        data-testid="nav-comprobantes"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div className="text-sm font-medium">Comprobantes</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/periodos">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/periodos") && "bg-accent"
                        )}
                        data-testid="nav-periodos"
                      >
                        <div className="flex items-center gap-2">
                          <ClipboardList className="h-4 w-4" />
                          <div className="text-sm font-medium">Períodos</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-operaciones">
                Operaciones
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <li>
                    <Link href="/facturacion">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/facturacion") && "bg-accent"
                        )}
                        data-testid="nav-facturacion"
                      >
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4" />
                          <div className="text-sm font-medium">Facturación</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/tesoreria">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/tesoreria") && "bg-accent"
                        )}
                        data-testid="nav-tesoreria"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          <div className="text-sm font-medium">Tesorería</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/nomina">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/nomina") && "bg-accent"
                        )}
                        data-testid="nav-nomina"
                      >
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4" />
                          <div className="text-sm font-medium">Nómina</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-administracion">
                Administración
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-1 p-2">
                  <li>
                    <Link href="/presupuestos">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/presupuestos") && "bg-accent"
                        )}
                        data-testid="nav-presupuestos"
                      >
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <div className="text-sm font-medium">Presupuestos</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/activos-fijos">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/activos-fijos") && "bg-accent"
                        )}
                        data-testid="nav-activos-fijos"
                      >
                        <div className="flex items-center gap-2">
                          <Package2 className="h-4 w-4" />
                          <div className="text-sm font-medium">Activos Fijos</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <li>
                    <Link href="/exogena">
                      <NavigationMenuLink
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          isActive("/exogena") && "bg-accent"
                        )}
                        data-testid="nav-exogena"
                      >
                        <div className="flex items-center gap-2">
                          <FileBarChart className="h-4 w-4" />
                          <div className="text-sm font-medium">Información Exógena</div>
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-xs font-medium">{suscriptorActual.nombre}</span>
            <span className="text-xs text-muted-foreground font-mono">NIT: {suscriptorActual.nit}</span>
          </div>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}