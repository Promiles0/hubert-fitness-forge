
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface TrainerSelectorProps {
  selectedTrainerId: string;
  onTrainerChange: (trainerId: string) => void;
}

const TrainerSelector = ({ selectedTrainerId, onTrainerChange }: TrainerSelectorProps) => {
  const { data: trainers, isLoading: trainersLoading } = useQuery({
    queryKey: ['trainers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trainers')
        .select('id, first_name, last_name')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="trainer">Trainer *</Label>
      <Select 
        value={selectedTrainerId} 
        onValueChange={onTrainerChange}
        disabled={trainersLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder={trainersLoading ? "Loading trainers..." : "Select trainer"} />
        </SelectTrigger>
        <SelectContent>
          {trainers?.map((trainer) => (
            <SelectItem key={trainer.id} value={trainer.id}>
              {trainer.first_name} {trainer.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TrainerSelector;
