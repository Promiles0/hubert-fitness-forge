
import {
  Calendar,
  Edit,
  FileText,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberActionsProps } from "./types";

export const MemberActions = ({ member, onDelete }: MemberActionsProps) => {
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
        <DropdownMenuItem className="text-white hover:bg-fitness-darkGray cursor-pointer">
          <Calendar className="mr-2 h-4 w-4" />
          <span>View Attendance</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem 
              className="text-red-500 hover:bg-fitness-darkGray cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Member</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="bg-fitness-black border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Member</DialogTitle>
              <DialogDescription className="text-gray-400">
                Are you sure you want to delete {member.first_name} {member.last_name}'s account? This action cannot be undone.
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
