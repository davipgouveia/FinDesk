import { memo } from "react";
import { motion, type PanInfo } from "framer-motion";
import { Check, LoaderCircle, X, CircleAlert, LifeBuoy, ArrowRight } from "lucide-react";
import type { SileoItem, SileoState } from "./types";
import { Button } from "../Button";
import { cn } from "../../../lib/utils";

interface ToastProps {
  item: SileoItem;
  onDismiss: (id: string) => void;
}

const STATE_ICON: Record<SileoState, React.ReactNode> = {
  success: <Check className="w-5 h-5 text-emerald-500" />,
  loading: <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin" />,
  error: <X className="w-5 h-5 text-red-500" />,
  warning: <CircleAlert className="w-5 h-5 text-amber-500" />,
  info: <LifeBuoy className="w-5 h-5 text-blue-500" />,
  action: <ArrowRight className="w-5 h-5 text-purple-500" />,
};

export const Toast = memo(function Toast({ item, onDismiss }: ToastProps) {
  const hasDesc = Boolean(item.description) || Boolean(item.button);

  const handleDragEnd = (_: any, info: PanInfo) => {
    // Dismiss if swiped fast or far enough
    if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 500) {
      onDismiss(item.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95 }}
      className={cn(
        "pointer-events-auto flex flex-col w-full min-w-[300px] overflow-hidden touch-none",
        "rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="shrink-0 mt-0.5">
          {item.icon ?? STATE_ICON[item.state ?? "info"]}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground tracking-tight">
            {item.title}
          </p>
          
          {hasDesc && (
            <div className="text-sm text-muted-foreground mt-1 leading-snug">
              {item.description}
              
              {item.button && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="w-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      item.button?.onClick();
                      onDismiss(item.id);
                    }}
                  >
                    {item.button.title}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="shrink-0 p-1 rounded-full text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});
