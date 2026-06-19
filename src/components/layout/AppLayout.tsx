import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, LayoutDashboard, Users, LogOut, Settings, Stethoscope, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';

export const AppLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pendências', href: '/pendencias', icon: CheckSquare },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Médicos', href: '/medicos', icon: Stethoscope },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart2 },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <img src="/logo-h-colorida.png" alt="Findesk Logo" className="h-8 w-auto block dark:hidden" />
          <img src="/logo-h-branca.png" alt="Findesk Logo" className="h-8 w-auto hidden dark:block" />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t p-4 flex flex-col gap-2">
          <div className="px-3 py-2 text-xs text-muted-foreground font-medium truncate">
            {user?.email}
          </div>
          <Link
            to="/configuracoes"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>

          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={signOut}>
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 lg:px-6 transition-colors">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
               <h1 className="text-xl font-semibold text-foreground capitalize">
                  {location.pathname.split('/')[1] || 'Dashboard'}
               </h1>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
