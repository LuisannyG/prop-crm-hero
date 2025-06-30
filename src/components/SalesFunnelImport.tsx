
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CSVRow {
  contact_name: string;
  stage: string;
  stage_date: string;
  notes?: string;
}

const SalesFunnelImport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const validStages = [
    'inicial',
    'seguimiento', 
    'presentacion',
    'presentacion_personalizada',
    'visita',
    'negociacion',
    'cierre',
    'perdido',
    'no_compra'
  ];

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    console.log('CSV Headers detected:', headers);
    
    const rows: CSVRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 3) {
        const row: CSVRow = {
          contact_name: values[0] || '',
          stage: values[1] || '',
          stage_date: values[2] || '',
          notes: values[3] || ''
        };
        rows.push(row);
      }
    }
    
    return rows;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      console.log('Parsed CSV data:', parsedData);
      
      setPreview(parsedData);
      setShowPreview(true);
      
      toast({
        title: "Archivo cargado",
        description: `${parsedData.length} registros encontrados. Revisa la vista previa.`,
      });
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({
        title: "Error",
        description: "Error al procesar el archivo CSV",
        variant: "destructive",
      });
    }
  };

  const handleImport = async () => {
    if (!user || preview.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Primero obtener todos los contactos del usuario
      const { data: contacts } = await supabase
        .from('contacts')
        .select('id, full_name')
        .eq('user_id', user.id);

      const contactMap = new Map(
        contacts?.map(c => [c.full_name.toLowerCase(), c.id]) || []
      );

      console.log('Available contacts:', contactMap);

      for (const row of preview) {
        try {
          // Buscar el contacto por nombre
          const contactId = contactMap.get(row.contact_name.toLowerCase());
          
          if (!contactId) {
            console.warn(`Contacto no encontrado: ${row.contact_name}`);
            errorCount++;
            continue;
          }

          // Validar etapa
          if (!validStages.includes(row.stage.toLowerCase())) {
            console.warn(`Etapa inválida: ${row.stage}`);
            errorCount++;
            continue;
          }

          // Validar fecha
          const stageDate = new Date(row.stage_date);
          if (isNaN(stageDate.getTime())) {
            console.warn(`Fecha inválida: ${row.stage_date}`);
            errorCount++;
            continue;
          }

          // Insertar en sales_funnel
          const { error } = await supabase
            .from('sales_funnel')
            .insert({
              user_id: user.id,
              contact_id: contactId,
              stage: row.stage.toLowerCase(),
              stage_date: stageDate.toISOString(),
              notes: row.notes || null
            });

          if (error) {
            console.error('Error inserting row:', error, row);
            errorCount++;
          } else {
            successCount++;
            
            // Actualizar la etapa del contacto también
            await supabase
              .from('contacts')
              .update({ 
                sales_stage: row.stage.toLowerCase(),
                updated_at: new Date().toISOString()
              })
              .eq('id', contactId);
          }
        } catch (error) {
          console.error('Error processing row:', error, row);
          errorCount++;
        }
      }

      toast({
        title: "Importación completada",
        description: `${successCount} registros importados correctamente. ${errorCount} errores.`,
      });

      if (successCount > 0) {
        setPreview([]);
        setShowPreview(false);
        // Reset file input
        const fileInput = document.getElementById('csv-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }

    } catch (error) {
      console.error('Error during import:', error);
      toast({
        title: "Error",
        description: "Error durante la importación",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Importar Embudo de Ventas desde CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Formato esperado del CSV: <code>Nombre del Contacto, Etapa, Fecha (YYYY-MM-DD), Notas</code>
          </p>
          <p className="text-xs text-gray-500">
            Etapas válidas: {validStages.join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {showPreview && (
            <Button
              onClick={handleImport}
              disabled={uploading || preview.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? 'Importando...' : `Importar ${preview.length} registros`}
            </Button>
          )}
        </div>

        {showPreview && preview.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Vista Previa ({preview.length} registros)
            </h3>
            <div className="max-h-64 overflow-y-auto border rounded">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Contacto</th>
                    <th className="px-3 py-2 text-left">Etapa</th>
                    <th className="px-3 py-2 text-left">Fecha</th>
                    <th className="px-3 py-2 text-left">Notas</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((row, index) => {
                    const isValidStage = validStages.includes(row.stage.toLowerCase());
                    const isValidDate = !isNaN(new Date(row.stage_date).getTime());
                    const isValid = isValidStage && isValidDate && row.contact_name;
                    
                    return (
                      <tr key={index} className={isValid ? 'bg-green-50' : 'bg-red-50'}>
                        <td className="px-3 py-2">{row.contact_name}</td>
                        <td className="px-3 py-2">{row.stage}</td>
                        <td className="px-3 py-2">{row.stage_date}</td>
                        <td className="px-3 py-2">{row.notes}</td>
                        <td className="px-3 py-2">
                          {isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {preview.length > 10 && (
                <p className="text-xs text-gray-500 p-2">
                  ... y {preview.length - 10} registros más
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesFunnelImport;
