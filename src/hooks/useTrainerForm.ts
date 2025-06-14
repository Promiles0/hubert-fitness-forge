
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TrainerSpecialty = Database["public"]["Enums"]["trainer_specialty"];

interface TrainerFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  hourly_rate: string;
  photo_url: string;
  specialties: TrainerSpecialty[];
}

const initialFormData: TrainerFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  bio: "",
  hourly_rate: "",
  photo_url: "",
  specialties: []
};

export const useTrainerForm = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<TrainerFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const updateFormData = (updates: Partial<TrainerFormData>) => {
    console.log('Updating form data:', updates);
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSpecialtyChange = (specialty: TrainerSpecialty, checked: boolean) => {
    console.log('Specialty change:', specialty, checked);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== specialty)
      }));
    }
  };

  const resetForm = () => {
    console.log('Resetting form data');
    setFormData(initialFormData);
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      console.log('useTrainerForm: Submitting form with data:', formData);
      
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email) {
        toast.error('Please fill in all required fields (first name, last name, email)');
        return;
      }

      const { data, error } = await supabase
        .from('trainers')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone || null,
          bio: formData.bio || null,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          photo_url: formData.photo_url || null,
          specialties: formData.specialties,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('useTrainerForm: Error adding trainer:', error);
        throw error;
      }

      console.log('useTrainerForm: Trainer added successfully:', data);
      toast.success('Trainer added successfully!');
      
      // Invalidate all trainer-related queries to refresh the data
      console.log('useTrainerForm: Invalidating trainer queries...');
      await queryClient.invalidateQueries({ queryKey: ['trainers'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-trainers'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-comprehensive-stats'] });
      
      // Force refetch to ensure data is updated
      await queryClient.refetchQueries({ queryKey: ['trainers'] });
      
      console.log('useTrainerForm: Queries invalidated and refetched');
      
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      console.error('useTrainerForm: Submit error:', error);
      toast.error(error.message || 'Failed to add trainer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    handleSpecialtyChange,
    submitForm,
    resetForm,
    isSubmitting
  };
};
