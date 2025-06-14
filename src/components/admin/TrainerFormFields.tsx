
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TrainerFormFieldsProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio: string;
    hourly_rate: string;
    photo_url: string;
  };
  onUpdate: (updates: Partial<TrainerFormFieldsProps['formData']>) => void;
}

const TrainerFormFields = ({ formData, onUpdate }: TrainerFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => onUpdate({ first_name: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => onUpdate({ last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
          <Input
            id="hourly_rate"
            type="number"
            step="0.01"
            value={formData.hourly_rate}
            onChange={(e) => onUpdate({ hourly_rate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo_url">Photo URL</Label>
        <Input
          id="photo_url"
          type="url"
          value={formData.photo_url}
          onChange={(e) => onUpdate({ photo_url: e.target.value })}
          placeholder="https://example.com/trainer-photo.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          rows={3}
          placeholder="Tell us about this trainer's experience and background..."
        />
      </div>
    </>
  );
};

export default TrainerFormFields;
