import { createContext, useState, useEffect, useMemo, useCallback } from 'react';

// Buat context dengan nilai default
export const SidebarContext = createContext();

export default function SidebarProvider({ children }) {
  // Lazy initializer untuk useState, membaca dari localStorage hanya sekali saat komponen mount
  // Ini mencegah error saat SSR (Server-Side Rendering) karena localStorage tidak ada di server.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const storedValue = localStorage.getItem('sidebar-open');
      // Default ke `true` jika tidak ada nilai di localStorage
      return storedValue !== null ? JSON.parse(storedValue) : true;
    } catch (error) {
      console.error('Failed to parse sidebar state from localStorage', error);
      return true;
    }
  });

  // Gunakan useEffect untuk menyimpan state ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-open', JSON.stringify(isSidebarOpen));
    } catch (error) {
      console.error('Failed to save sidebar state to localStorage', error);
    }
  }, [isSidebarOpen]);

  // Gunakan useCallback untuk memoize fungsi agar tidak dibuat ulang di setiap render
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Gunakan useMemo untuk memoize nilai context, mencegah re-render yang tidak perlu
  // pada komponen consumer.
  const value = useMemo(() => ({ isSidebarOpen, toggleSidebar, closeSidebar }), [isSidebarOpen, toggleSidebar, closeSidebar]);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}
