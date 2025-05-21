
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Business } from '../types/business';

interface PDFExportProps {
  businesses: Business[];
  location: string;
}

export function PDFExport({ businesses, location }: PDFExportProps) {
  const exportToPDF = async () => {
    try {
      // Dynamically import the libraries to avoid SSR issues
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title to PDF
      doc.setFontSize(18);
      doc.text(`Empresas sem site em ${location}`, 14, 22);
      
      // Add date of report
      const today = new Date().toLocaleDateString('pt-BR');
      doc.setFontSize(10);
      doc.text(`Relatório gerado em: ${today}`, 14, 30);
      
      // Add description
      doc.setFontSize(12);
      doc.text('Lista de empresas sem presença digital - Potenciais oportunidades de negócio', 14, 38);
      
      // Prepare table data
      const tableData = businesses.map(business => [
        business.name,
        business.type,
        business.phone || 'Sem telefone',
        business.address,
        business.rating > 0 ? `${business.rating.toFixed(1)}/5` : 'Sem avaliação'
      ]);
      
      // Add table to PDF
      autoTable(doc, {
        startY: 45,
        head: [['Empresa', 'Tipo', 'Telefone', 'Endereço', 'Avaliação']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { 
          fontSize: 10,
          cellPadding: 3
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          3: { cellWidth: 'auto' }
        },
      });
      
      // Add footer with page number
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount} - BuscaSemSite`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF with a name based on location and date
      const fileName = `Empresas_sem_site_${location.replace(/\s+/g, '_')}_${today.replace(/\//g, '-')}.pdf`;
      doc.save(fileName);
      
      toast({
        title: "Sucesso!",
        description: `Relatório exportado com sucesso: ${fileName}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erro na exportação do PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button 
      onClick={exportToPDF}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileText size={16} />
      Exportar PDF
    </Button>
  );
}
