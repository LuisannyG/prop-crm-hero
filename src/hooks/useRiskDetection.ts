
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RiskCalculationResult {
  risk_score: number;
  risk_factors: string[];
  recommendations: string[];
  last_contact_days: number;
  interaction_frequency: number;
  engagement_score: number;
}

interface RecoveryAction {
  contactId: string;
  actionType: 'priority_call' | 'discount_offer' | 'alternative_proposal' | 'escalation' | 'follow_up_email';
  description: string;
  outcome?: 'successful' | 'failed' | 'pending';
}

export const useRiskDetection = (userId: string | undefined) => {
  const { toast } = useToast();
  const [calculating, setCalculating] = useState(false);

  const calculateRiskScore = useCallback(async (contactId: string): Promise<RiskCalculationResult | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .rpc('calculate_client_risk_score', {
          contact_uuid: contactId,
          user_uuid: userId
        });

      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error calculating risk score:', error);
      return null;
    }
  }, [userId]);

  const updateRiskMetrics = useCallback(async (contactId: string, riskData: RiskCalculationResult) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('client_risk_metrics')
        .upsert({
          user_id: userId,
          contact_id: contactId,
          risk_score: riskData.risk_score,
          last_contact_days: riskData.last_contact_days,
          interaction_frequency: riskData.interaction_frequency,
          engagement_score: riskData.engagement_score,
          risk_factors: riskData.risk_factors,
          recommendations: riskData.recommendations,
          last_calculated: new Date().toISOString()
        }, {
          onConflict: 'user_id,contact_id'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating risk metrics:', error);
      return false;
    }
  }, [userId]);

  const createRiskAlert = useCallback(async (contactId: string, contactName: string, riskScore: number) => {
    if (!userId || riskScore < 70) return false;

    try {
      const alertType = riskScore >= 80 ? 'high_risk' : 'stage_stagnation';
      const alertMessage = riskScore >= 80 
        ? `${contactName} tiene un riesgo crítico (${riskScore}%) de abandonar el proceso`
        : `${contactName} muestra señales de desinterés (${riskScore}% de riesgo)`;

      const { error } = await supabase
        .from('risk_alerts')
        .insert({
          user_id: userId,
          contact_id: contactId,
          alert_type: alertType,
          alert_message: alertMessage,
          risk_score: riskScore
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating risk alert:', error);
      return false;
    }
  }, [userId]);

  const applyRecoveryAction = useCallback(async (action: RecoveryAction) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('recovery_actions')
        .insert({
          user_id: userId,
          contact_id: action.contactId,
          action_type: action.actionType,
          action_description: action.description,
          outcome: action.outcome || 'pending'
        });

      if (error) throw error;

      toast({
        title: "Acción registrada",
        description: action.description,
      });

      return true;
    } catch (error) {
      console.error('Error applying recovery action:', error);
      toast({
        title: "Error",
        description: "Error al registrar la acción de recuperación",
        variant: "destructive",
      });
      return false;
    }
  }, [userId, toast]);

  const calculateRiskForAllContacts = useCallback(async (contactIds: string[], contactNames: { [key: string]: string }) => {
    if (!userId) return false;

    setCalculating(true);
    let successCount = 0;
    let alertsCreated = 0;

    try {
      for (const contactId of contactIds) {
        const riskData = await calculateRiskScore(contactId);
        
        if (riskData) {
          const updated = await updateRiskMetrics(contactId, riskData);
          if (updated) {
            successCount++;
            
            // Crear alerta si es necesario
            const contactName = contactNames[contactId] || 'Cliente';
            const alertCreated = await createRiskAlert(contactId, contactName, riskData.risk_score);
            if (alertCreated) alertsCreated++;
          }
        }

        // Pequeña pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Análisis completado",
        description: `Se analizaron ${successCount} clientes. ${alertsCreated} alertas creadas.`,
      });

      return true;
    } catch (error) {
      console.error('Error in bulk risk calculation:', error);
      toast({
        title: "Error",
        description: "Error durante el análisis masivo de riesgos",
        variant: "destructive",
      });
      return false;
    } finally {
      setCalculating(false);
    }
  }, [userId, calculateRiskScore, updateRiskMetrics, createRiskAlert, toast]);

  const getRiskMetrics = useCallback(async () => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('client_risk_metrics')
        .select(`
          *,
          contacts!inner(
            id,
            full_name,
            email,
            phone,
            sales_stage
          )
        `)
        .eq('user_id', userId)
        .order('risk_score', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
      return [];
    }
  }, [userId]);

  const getRiskAlerts = useCallback(async (includeResolved = false) => {
    if (!userId) return [];

    try {
      let query = supabase
        .from('risk_alerts')
        .select(`
          *,
          contacts!inner(
            id,
            full_name
          )
        `)
        .eq('user_id', userId);

      if (!includeResolved) {
        query = query.eq('is_resolved', false);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching risk alerts:', error);
      return [];
    }
  }, [userId]);

  return {
    calculating,
    calculateRiskScore,
    updateRiskMetrics,
    createRiskAlert,
    applyRecoveryAction,
    calculateRiskForAllContacts,
    getRiskMetrics,
    getRiskAlerts
  };
};
