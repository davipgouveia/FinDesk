import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CheckSquare, LayoutDashboard, Users, LogOut, Settings, Stethoscope, BarChart2, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import packageJson from '../../../package.json';

import { useLembretesNotifications } from '../../hooks/useLembretesNotifications';
import { QuickActionsBar } from '../ui/QuickActionsBar';

export const AppLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  useLembretesNotifications();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendário', href: '/calendario', icon: Calendar },
    { name: 'Pendências', href: '/pendencias', icon: CheckSquare },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Médicos', href: '/medicos', icon: Stethoscope },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart2 },
  ];

  // Mostramos na barra inferiror do mobile apenas os itens mais acessados e "Relatórios" condensado num menu? 
  // No, vamos colocar até 5 itens mais essenciais na barra inferior. 
  const mobileNavItems = [
    { name: 'Início', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pendências', href: '/pendencias', icon: CheckSquare },
    { name: 'Calendário', href: '/calendario', icon: Calendar },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Config', href: '/configuracoes', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      
      {/* Sidebar - Ocultada no Mobile (lg:flex) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 border-r bg-card flex-col">
        <div className="flex h-16 items-center px-6 border-b">
          <img src="/logo-h-colorida.png" alt="Findesk Logo" className="h-8 w-auto block dark:hidden" />
          <img src="/logo-h-branca.png" alt="Findesk Logo" className="h-8 w-auto hidden dark:block" />
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
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
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>

          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={signOut}>
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>

          <div className="mt-2 text-center text-[10px] text-muted-foreground opacity-50">
            v{packageJson.version}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
        
        {/* Header Glassmorphism */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-white/20 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl px-4 lg:px-6 shadow-sm">
          <div className="flex flex-1 items-center gap-3">
             <div className="flex lg:hidden items-center gap-3">
               <img src="/logo-h-colorida.png" alt="Findesk Logo" className="h-6 w-auto block dark:hidden" />
               <img src="/logo-h-branca.png" alt="Findesk Logo" className="h-6 w-auto hidden dark:block" />
               <div className="h-4 w-px bg-border mx-1" />
             </div>
             <h1 className="text-xl font-semibold text-foreground tracking-tight capitalize">
                {location.pathname.split('/')[1] || 'Dashboard'}
             </h1>
          </div>
        </header>

        {/* Quick Actions Bar Sempre Visível Logo Abaixo do Header */}
        <div className="sticky top-16 z-20">
          <QuickActionsBar />
        </div>

        {/* Content Area (pb-28 garante espaço livre do bottom-bar no mobile) */}
        <div className="p-4 sm:p-6 pb-28 lg:pb-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation Bar - Mobile Apenas */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 px-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] transition-colors">
        <nav className="flex items-center justify-around h-16">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_4px_12px_theme(colors.primary.DEFAULT)]" />
                )}
                <item.icon className={cn("h-5 w-5 mt-1 transition-transform", isActive && "scale-110")} />
                <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
};
