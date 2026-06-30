import { useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { Lembrete } from '../types';

export function useLembretesNotifications() {
  const checkInterval = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkLembretes = async () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      try {
        const lembretes = await api.getLembretesDashboard();
        const agora = new Date();
        
        // Evita o bug do toISOString() gerando a data baseada no fuso horário local
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        const hoje = `${ano}-${mes}-${dia}`; 
        
        // Converte a hora atual para minutos totais para facilitar a matemática
        const horaAtualEmMinutos = agora.getHours() * 60 + agora.getMinutes();

        const notifiedIds = JSON.parse(localStorage.getItem('notified_lembretes') || '[]');
        const newNotifiedIds = [...notifiedIds];

        lembretes.forEach((lembrete: Lembrete) => {
          if (lembrete.status === 'pendente') {
            const isVencendoHoje = lembrete.data_vencimento === hoje;
            const isAtrasado = lembrete.data_vencimento < hoje;
            
            if ((isVencendoHoje || isAtrasado) && !notifiedIds.includes(lembrete.id)) {
              let shouldNotify = false;
              
              if (lembrete.hora_vencimento && isVencendoHoje) {
                 const [horaVenc, minVenc] = lembrete.hora_vencimento.split(':').map(Number);
                 const vencimentoEmMinutos = horaVenc * 60 + minVenc;
                 
                 const minutosRestantes = vencimentoEmMinutos - horaAtualEmMinutos;

                 // Notifica se faltam 10 minutos ou menos, ou se já passou do horário
                 if (minutosRestantes <= 10) {
                   shouldNotify = true;
                 }
              } else {
                 shouldNotify = true;
              }

              if (shouldNotify) {
                new Notification('Lembrete Pendente: ' + lembrete.titulo, {
                  body: `Vencimento: ${lembrete.data_vencimento.split('-').reverse().join('/')}${lembrete.hora_vencimento ? ` às ${lembrete.hora_vencimento}` : ''}`,
                  icon: '/icon-colorido.png'
                });
                newNotifiedIds.push(lembrete.id);
              }
            }
          }
        });

        if (newNotifiedIds.length !== notifiedIds.length) {
          localStorage.setItem('notified_lembretes', JSON.stringify(newNotifiedIds));
        }
      } catch (err) {
        console.error('Erro ao verificar lembretes para notificação:', err);
      }
    };

    checkLembretes();
    // Reduzido para 1 minuto (60000ms) para maior precisão nos alertas
    checkInterval.current = window.setInterval(checkLembretes, 60000);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);
}