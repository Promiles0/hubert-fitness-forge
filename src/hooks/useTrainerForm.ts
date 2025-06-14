
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
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSpecialtyChange = (specialty: TrainerSpecialty, checked: boolean) => {
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
    setFormData(initialFormData);
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      console.log('Adding trainer with data:', formData);
      
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
        .select();

      if (error) {
        console.error('Error adding trainer:', error);
        throw error;
      }

      console.log('Trainer added successfully:', data);
      toast.success('Trainer added successfully!');
      
      // Invalidate all trainer-related queries
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-trainers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-comprehensive-stats'] });
      
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      console.error('Submit error:', error);
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
