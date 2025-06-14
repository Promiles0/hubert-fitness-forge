
import { FileText, Edit, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberDeleteDialog } from "./MemberDeleteDialog";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  is_blocked: boolean;
}

interface MemberActionsMenuProps {
  member: Member;
  onBlockToggle: (memberId: string, block: boolean) => void;
  onDelete: (memberId: string) => void;
}

export const MemberActionsMenu = ({ member, onBlockToggle, onDelete }: MemberActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 text-white">
          <span className="sr-only">Open menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-fitness-black border-gray-700 text-white">
        <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Edit Info</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          className="text-white hover:bg-fitness-darkGray cursor-pointer"
          onClick={() => onBlockToggle(member.id, !member.is_blocked)}
        >
          {member.is_blocked ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              <span>Unblock User</span>
            </>
          ) : (
            <>
              <UserX className="mr-2 h-4 w-4" />
              <span>Block User</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <MemberDeleteDialog member={member} onDelete={onDelete} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
