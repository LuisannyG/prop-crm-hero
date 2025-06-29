
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SALES_STAGES } from '@/utils/stageRecommendations';

interface SalesFunnelChartProps {
  data: { stage: string; count: number }[];
}

const SalesFunnelChart = ({ data }: SalesFunnelChartProps) => {
  // Asegurar que todas las etapas están representadas, incluyendo "No Compra"
  const completeData = SALES_STAGES.map(stage => {
    const found = data.find(d => d.stage === stage.id);
    return {
      stage: stage.name,
      count: found ? found.count : 0,
      color: stage.color,
      bgColor: stage.bgColor,
      order: stage.order
    };
  }).sort((a, b) => a.order - b.order);

  const total = completeData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embudo de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completeData.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  nameKey="stage"
                >
                  {completeData.filter(d => d.count > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [
                    `${value} contactos (${((value/total)*100).toFixed(1)}%)`,
                    'Cantidad'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {completeData.map((item) => (
              <div 
                key={item.stage} 
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {item.count} contactos
                  </Badge>
                  {total > 0 && (
                    <Badge variant="secondary">
                      {((item.count/total)*100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesFunnelChart;
