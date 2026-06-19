import { useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { Lembrete } from '../types';

export function useLembretesNotifications() {
  const checkInterval = useRef<number | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    const checkLembretes = async () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      try {
        const lembretes = await api.getLembretesDashboard();
        const hoje = new Date().toISOString().split('T')[0];
        const agora = new Date();
        const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');

        const notifiedIds = JSON.parse(localStorage.getItem('notified_lembretes') || '[]');
        let newNotifiedIds = [...notifiedIds];

        lembretes.forEach((lembrete: Lembrete) => {
          if (lembrete.status === 'pendente') {
            const isVencendoHoje = lembrete.data_vencimento === hoje;
            const isAtrasado = lembrete.data_vencimento < hoje;
            
            if ((isVencendoHoje || isAtrasado) && !notifiedIds.includes(lembrete.id)) {
              let shouldNotify = false;
              
              if (lembrete.hora_vencimento && isVencendoHoje) {
                 if (horaAtual >= lembrete.hora_vencimento) {
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

    // Verifica ao carregar e a cada 5 minutos
    checkLembretes();
    checkInterval.current = window.setInterval(checkLembretes, 300000);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);
}
