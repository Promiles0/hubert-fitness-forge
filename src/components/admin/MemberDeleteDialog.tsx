
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
}

interface MemberDeleteDialogProps {
  member: Member;
  onDelete: (memberId: string) => void;
}

export const MemberDeleteDialog = ({ member, onDelete }: MemberDeleteDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem 
          className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete User</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="bg-fitness-black border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Delete User</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to permanently delete {member.first_name} {member.last_name}'s account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onDelete(member.id)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
