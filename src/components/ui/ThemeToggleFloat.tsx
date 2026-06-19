import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggleFloat() {
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleTheme = () => {
    setExpanded(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    
    // Retorna a ficar escondido depois da animação
    setTimeout(() => {
      setExpanded(false);
    }, 1500);
  };

  return (
    <motion.button
      initial={{ x: "60%" }}
      animate={{ x: expanded ? 0 : "60%" }}
      whileHover={{ x: "20%" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={toggleTheme}
      className="fixed right-0 bottom-24 z-[100] flex h-14 w-14 items-center justify-start pl-2 rounded-l-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-foreground shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-r-0 border-white/40 dark:border-white/10"
      title="Alternar Tema"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.4 }}
        >
          {theme === 'dark' ? (
            <Sun className="h-7 w-7 text-yellow-500" />
          ) : (
            <Moon className="h-7 w-7 text-indigo-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
