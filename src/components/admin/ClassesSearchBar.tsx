
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClassesSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClassesSearchBar = ({ searchTerm, onSearchChange }: ClassesSearchBarProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassesSearchBar;
