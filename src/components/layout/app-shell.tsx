import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";
import { useAppStore } from "@/stores/useAppStore";

export const AppShell: React.FC = () => {
  const { sidebarOpen } = useAppStore();

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="flex min-h-screen w-full bg-gradient-surface">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};