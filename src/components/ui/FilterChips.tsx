import { cn } from '../../lib/utils';
import { useSearchParams } from 'react-router-dom';

interface FilterChipProps {
  label: string;
  value: string;
  activeValue: string | null;
  onClick: (val: string) => void;
}

function FilterChip({ label, value, activeValue, onClick }: FilterChipProps) {
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      {label}
    </button>
  );
}

export function FilterChips() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtroAtual = searchParams.get('filtro') || 'todos';

  const handleSelect = (val: string) => {
    if (val === 'todos') {
      searchParams.delete('filtro');
    } else {
      searchParams.set('filtro', val);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
      <FilterChip label="Todas Abertas" value="todos" activeValue={filtroAtual} onClick={handleSelect} />
      <FilterChip label="Hoje" value="hoje" activeValue={filtroAtual} onClick={handleSelect} />
      <FilterChip label="Atrasados" value="atrasados" activeValue={filtroAtual} onClick={handleSelect} />
      <FilterChip label="Concluídos" value="concluidos" activeValue={filtroAtual} onClick={handleSelect} />
      {/* Podemos adicionar mais filtros como 'Alta Prioridade', etc */}
    </div>
  );
}
