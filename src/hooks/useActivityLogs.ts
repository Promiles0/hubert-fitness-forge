
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useActivityLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const logActivity = useMutation({
    mutationFn: async ({ 
      action, 
      entityType, 
      entityId, 
      details 
    }: { 
      action: string; 
      entityType: string; 
      entityId?: string; 
      details?: any 
    }) => {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action,
          entity_type: entityType,
          entity_id: entityId,
          details,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    }
  });

  return {
    logs,
    isLoading,
    logActivity: logActivity.mutate
  };
};
