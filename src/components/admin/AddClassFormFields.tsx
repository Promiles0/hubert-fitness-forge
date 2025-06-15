
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddClassFormFieldsProps {
  formData: {
    name: string;
    description: string;
    class_type: string;
    capacity: string;
    duration_minutes: string;
    room: string;
  };
  onFormDataChange: (data: any) => void;
}

const AddClassFormFields = ({ formData, onFormDataChange }: AddClassFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="class_type">Class Type *</Label>
          <Select value={formData.class_type} onValueChange={(value) => onFormDataChange({ ...formData, class_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="hiit">HIIT</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="pilates">Pilates</SelectItem>
              <SelectItem value="zumba">Zumba</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => onFormDataChange({ ...formData, capacity: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (min) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => onFormDataChange({ ...formData, duration_minutes: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="room">Room</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => onFormDataChange({ ...formData, room: e.target.value })}
          />
        </div>
      </div>
    </>
  );
};

export default AddClassFormFields;
