import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const exportToPDF = (lembretes: any[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text('Relatório Geral - Findesk', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Data de Geração: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 30);
  doc.text(`Total de Registros: ${lembretes.length}`, 14, 36);

  // Define columns
  const tableColumn = ["Título", "Paciente", "Médico", "Data", "Tipo", "Prioridade", "Status"];
  const tableRows: any[] = [];

  // Populate rows
  lembretes.forEach(l => {
    const lembreteData = [
      l.titulo || '',
      l.pacientes?.nome || '-',
      l.medicos?.nome || '-',
      l.data_vencimento ? format(parseISO(l.data_vencimento), 'dd/MM/yyyy') : '',
      l.tipo || '',
      l.prioridade || '',
      l.status || ''
    ];
    tableRows.push(lembreteData);
  });

  // Generate table using autoTable plugin (augmented to jsPDF)
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 42,
    theme: 'striped',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 58, 138] }, // Navy Blue do logo
  });

  // Save the PDF
  const filename = `relatorio-findesk-${format(new Date(), 'dd-MM-yyyy')}.pdf`;
  doc.save(filename);
};
