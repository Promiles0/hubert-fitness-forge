
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ClassScheduleSectionProps {
  scheduleData: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
  onScheduleChange: (data: any) => void;
}

const ClassScheduleSection = ({ scheduleData, onScheduleChange }: ClassScheduleSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Schedule (Optional)</Label>
      <div className="grid grid-cols-3 gap-2">
        <Select value={scheduleData.day_of_week} onValueChange={(value) => onScheduleChange({ ...scheduleData, day_of_week: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Sunday</SelectItem>
            <SelectItem value="1">Monday</SelectItem>
            <SelectItem value="2">Tuesday</SelectItem>
            <SelectItem value="3">Wednesday</SelectItem>
            <SelectItem value="4">Thursday</SelectItem>
            <SelectItem value="5">Friday</SelectItem>
            <SelectItem value="6">Saturday</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="time"
          placeholder="Start time"
          value={scheduleData.start_time}
          onChange={(e) => onScheduleChange({ ...scheduleData, start_time: e.target.value })}
        />
        
        <Input
          type="time"
          placeholder="End time"
          value={scheduleData.end_time}
          onChange={(e) => onScheduleChange({ ...scheduleData, end_time: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ClassScheduleSection;
