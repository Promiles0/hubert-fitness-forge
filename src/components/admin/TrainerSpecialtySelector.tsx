
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

type TrainerSpecialty = Database["public"]["Enums"]["trainer_specialty"];

interface TrainerSpecialtySelectorProps {
  selectedSpecialties: TrainerSpecialty[];
  onSpecialtyChange: (specialty: TrainerSpecialty, checked: boolean) => void;
}

const specialtyOptions: { value: TrainerSpecialty; label: string }[] = [
  { value: "strength", label: "Strength Training" },
  { value: "cardio", label: "Cardio" },
  { value: "hiit", label: "HIIT" },
  { value: "yoga", label: "Yoga" },
  { value: "pilates", label: "Pilates" },
  { value: "crossfit", label: "CrossFit" },
  { value: "nutrition", label: "Nutrition" },
  { value: "rehabilitation", label: "Rehabilitation" }
];

const TrainerSpecialtySelector = ({ selectedSpecialties, onSpecialtyChange }: TrainerSpecialtySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Specialties</Label>
      <div className="grid grid-cols-2 gap-2">
        {specialtyOptions.map((specialty) => (
          <div key={specialty.value} className="flex items-center space-x-2">
            <Checkbox
              id={specialty.value}
              checked={selectedSpecialties.includes(specialty.value)}
              onCheckedChange={(checked) => onSpecialtyChange(specialty.value, !!checked)}
            />
            <Label htmlFor={specialty.value} className="text-sm">
              {specialty.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerSpecialtySelector;
