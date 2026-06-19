import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Pendencias from './pages/Pendencias';
import LembreteForm from './pages/LembreteForm';
import LembreteDetail from './pages/LembreteDetail';
import Pacientes from './pages/Pacientes';
import PacientesForm from './pages/PacientesForm';
import PacienteDetail from './pages/PacienteDetail';
import Relatorios from './pages/Relatorios';
import Medicos from './pages/Medicos';
import MedicosForm from './pages/MedicosForm';
import Configuracoes from './pages/Configuracoes';
import { ThemeToggleFloat } from './components/ui/ThemeToggleFloat';

const queryClient = new QueryClient();

// Placeholder components for pages not yet implemented
const Placeholder = ({ title }: { title: string }) => <div className="text-slate-500">Página {title} em construção...</div>;

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="findesk-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pendencias" element={<Pendencias />} />
              <Route path="lembretes/novo" element={<LembreteForm />} />
              <Route path="pendencias/:id" element={<LembreteDetail />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="pacientes/novo" element={<PacientesForm />} />
              <Route path="pacientes/:id" element={<PacienteDetail />} />
              <Route path="medicos" element={<Medicos />} />
              <Route path="medicos/novo" element={<MedicosForm />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" richColors />
          <ThemeToggleFloat />
        </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
