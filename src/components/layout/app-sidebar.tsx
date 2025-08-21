import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Beef, 
  Users, 
  Settings,
  Plus,
  PackagePlus,
  Store
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Pedidos",
    url: "/pedidos",
    icon: ShoppingCart,
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: Package,
  },
  {
    title: "Kits",
    url: "/kits",
    icon: Beef,
  },
  {
    title: "Clientes",
    url: "/clientes",
    icon: Users,
  },
];

const quickActions = [
  {
    title: "Novo Pedido",
    url: "/pedidos/novo",
    icon: Plus,
  },
  {
    title: "Entrada Estoque",
    url: "/estoque?tab=entrada",
    icon: PackagePlus,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          {!collapsed && (
            <>
              <Beef className="h-8 w-8 text-primary" />
              <div>
                <h2 className="font-bold text-lg bg-gradient-warm bg-clip-text text-transparent">
                  Kit Churras
                </h2>
                <p className="text-xs text-sidebar-foreground/60">Pro</p>
              </div>
            </>
          )}
          {collapsed && <Beef className="h-6 w-6 text-primary mx-auto" />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed ? "Menu Principal" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavClasses}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <>
            <Separator className="mx-4" />
            
            {/* Botão especial para a Loja */}
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="px-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                    asChild
                  >
                    <a href="/loja" target="_blank" rel="noopener noreferrer">
                      <Store className="h-4 w-4 mr-2" />
                      Abrir Loja
                    </a>
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="mx-4" />
            
            <SidebarGroup>
              <SidebarGroupLabel>Ações Rápidas</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-2 px-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.title}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      asChild
                    >
                      <NavLink to={action.url}>
                        <action.icon className="h-4 w-4 mr-2" />
                        {action.title}
                      </NavLink>
                    </Button>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/config" className={getNavClasses}>
                <Settings className="h-4 w-4" />
                {!collapsed && <span>Configurações</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}