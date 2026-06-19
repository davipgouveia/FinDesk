import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, UserPlus, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface QuickActionsBarProps {
  className?: string;
}

export function QuickActionsBar({ className }: QuickActionsBarProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("bg-white/60 dark:bg-black/60 backdrop-blur-md border-b border-white/20 dark:border-white/10 px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 overflow-x-auto shadow-[0_4px_24px_rgba(0,0,0,0.02)] z-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", className)}>
      <Button onClick={() => navigate('/lembretes/novo')} className="shrink-0 gap-1.5 rounded-full px-4 sm:px-5 h-9 sm:h-10 text-xs sm:text-[13px] font-semibold shadow-sm">
        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Novo Lembrete
      </Button>

      <div className="h-4 sm:h-5 w-px bg-border mx-0.5 sm:mx-1 shrink-0" />

      <Button onClick={() => navigate('/pendencias?filtro=hoje')} variant="secondary" className="shrink-0 gap-1.5 rounded-full text-xs sm:text-[13px] h-9 sm:h-10 px-3 sm:px-4">
        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
        Hoje
      </Button>
      
      <Button onClick={() => navigate('/pendencias?filtro=atrasados')} variant="secondary" className="shrink-0 gap-1.5 rounded-full text-xs sm:text-[13px] h-9 sm:h-10 px-3 sm:px-4">
        <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
        Atrasados
      </Button>

      <Button onClick={() => navigate('/pendencias?filtro=concluidos')} variant="secondary" className="shrink-0 gap-1.5 rounded-full text-xs sm:text-[13px] h-9 sm:h-10 px-3 sm:px-4">
        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
        Concluídos
      </Button>

      <div className="h-4 sm:h-5 w-px bg-border mx-0.5 sm:mx-1 shrink-0" />

      <Button onClick={() => navigate('/pacientes/novo')} variant="ghost" className="shrink-0 gap-1.5 rounded-full text-xs sm:text-[13px] h-9 sm:h-10 px-3 sm:px-4 text-muted-foreground hover:text-foreground">
        <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Novo Paciente
      </Button>
      
      <Button onClick={() => navigate('/calendario')} variant="ghost" className="shrink-0 gap-1.5 rounded-full text-xs sm:text-[13px] h-9 sm:h-10 px-3 sm:px-4 text-muted-foreground hover:text-foreground">
        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Calendário
      </Button>

    </div>
  );
}
