import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'success' | 'warning';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isLoading = false
}: ConfirmModalProps) {
  
  const getIcon = () => {
    if (type === 'success') return <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />;
    if (type === 'danger') return <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />;
    return <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />;
  };

  const getConfirmVariant = () => {
    if (type === 'danger') return 'destructive';
    if (type === 'success') return 'default'; // Modificaremos para aplicar Emerald no botão depois
    return 'default';
  };

  const getConfirmClass = () => {
    if (type === 'success') return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    return '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center">
        {getIcon()}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button 
            variant={getConfirmVariant()} 
            className={`flex-1 ${getConfirmClass()}`} 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Aguarde...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
