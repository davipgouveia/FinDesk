import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 dark:bg-black/40 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`w-[95%] sm:w-full ${maxWidth} bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl text-card-foreground rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-white/50 dark:border-white/10 pointer-events-auto flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden`}
            >
              {true && (
                <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 border-b border-white/20 dark:border-white/5 shrink-0 bg-white/30 dark:bg-black/20">
                  {title && <h2 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h2>}
                  <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 sm:h-8 sm:w-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 ml-auto flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="p-4 sm:p-6 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
