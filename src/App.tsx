import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Toaster } from './components/ui/toast/toaster';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsqueciSenha from './pages/EsqueciSenha';
import RedefinirSenha from './pages/RedefinirSenha';
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
import NotFound from './pages/NotFound';
import Calendario from './pages/Calendario';
import { ThemeToggleFloat } from './components/ui/ThemeToggleFloat';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 5, // 5 seconds
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
});

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="findesk-theme">
      <ErrorBoundary>
        <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />

            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pendencias" element={<Pendencias />} />
              <Route path="calendario" element={<Calendario />} />
              <Route path="lembretes/novo" element={<LembreteForm />} />
              <Route path="lembretes/:id/editar" element={<LembreteForm />} />
              <Route path="pendencias/:id" element={<LembreteDetail />} />
              <Route path="pacientes" element={<Pacientes />} />
              <Route path="pacientes/novo" element={<PacientesForm />} />
              <Route path="pacientes/:id" element={<PacienteDetail />} />
              <Route path="medicos" element={<Medicos />} />
              <Route path="medicos/novo" element={<MedicosForm />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
          <ThemeToggleFloat />
        </BrowserRouter>
        </AuthProvider>
        </PersistQueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
