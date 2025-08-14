import { Search, Moon, Sun, Bell, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/stores/useAppStore";

export const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        <SidebarTrigger />
        
        <div className="flex-1 flex items-center gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pedidos, kits, clientes... (⌘K)"
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                AD
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline text-sm">Admin</span>
          </Button>
        </div>
      </div>
    </header>
  );
};