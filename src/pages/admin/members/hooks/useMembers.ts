
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Member } from "../types";

export const useMembers = () => {
  const { data: members, isLoading, error, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select(`
          id, 
          first_name, 
          last_name, 
          email, 
          phone, 
          status, 
          join_date, 
          expiry_date, 
          gender,
          membership_plan: membership_plan_id (name),
          trainer: assigned_trainer_id (first_name, last_name)
        `);
      
      if (error) throw error;
      
      // Handle potential trainer errors by normalizing the data
      const normalizedData = data.map(member => ({
        ...member,
        trainer: (typeof member.trainer === 'object' && member.trainer !== null) 
          ? member.trainer 
          : null
      }));
      
      return normalizedData as Member[];
    },
  });

  return { members, isLoading, error, refetch };
};

export const useMembershipPlans = () => {
  return useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_plans')
        .select('id, name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTrainers = () => {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('id, first_name, last_name');
      
      if (error) throw error;
      return data;
    },
  });
};
