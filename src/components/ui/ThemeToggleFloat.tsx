import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggleFloat() {
  const { theme, setTheme } = useTheme();
  const controls = useAnimation();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Posição inicial: Canto inferior direito (padding de 24px)
  const buttonSize = 56; // w-14 h-14 = 56px
  const padding = 24;

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dragConstraints = {
    top: 0,
    bottom: windowSize.height - buttonSize - padding * 2,
    left: -(windowSize.width - buttonSize - padding * 2),
    right: 0
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.8}
      dragMomentum={true}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring border border-primary-foreground/20"
      title="Alternar Tema (Arraste para mover)"
      style={{ touchAction: 'none' }} // Impede scroll indesejado no mobile
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </motion.button>
  );
}
