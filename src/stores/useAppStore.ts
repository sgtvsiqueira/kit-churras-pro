import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Navigation
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Global search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  
  // Loading states
  loading: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Navigation
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Global search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      
      // Loading states
      loading: {},
      setLoading: (key, loading) => 
        set((state) => ({ 
          loading: { ...state.loading, [key]: loading } 
        })),
    }),
    {
      name: 'kit-churras-app-store',
      partialize: (state) => ({ 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const store = useAppStore.getState();
  if (store.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
}