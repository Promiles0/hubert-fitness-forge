
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MemberActionsMenu } from "./MemberActionsMenu";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  join_date: string;
  expiry_date: string | null;
  is_blocked: boolean;
  user_id: string | null;
  membership_plan: {
    name: string;
  } | null;
  trainer: {
    first_name: string;
    last_name: string;
  } | null;
  gender: string | null;
  profile?: {
    avatar?: string;
  };
}

interface MembersTableProps {
  members: Member[] | undefined;
  isLoading: boolean;
  onBlockToggle: (memberId: string, block: boolean) => void;
  onDelete: (memberId: string) => void;
}

export const MembersTable = ({ members, isLoading, onBlockToggle, onDelete }: MembersTableProps) => {
  // Status badge color mapping
  const getStatusColor = (status: string, isBlocked: boolean) => {
    if (isBlocked) return 'bg-red-500 hover:bg-red-600';
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'suspended': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'expired': return 'bg-red-500 hover:bg-red-600';
      case 'pending': return 'bg-blue-500 hover:bg-blue-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Card className="bg-fitness-darkGray border-gray-800">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-fitness-red" />
            <span className="ml-2 text-white">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-fitness-black">
                <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Plan</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Join Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                      <TableCell className="text-white font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.profile?.avatar} />
                            <AvatarFallback className="bg-fitness-red text-white">
                              {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.first_name} {member.last_name}</div>
                            <div className="text-sm text-gray-400">ID: {member.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{member.email}</TableCell>
                      <TableCell className="text-gray-300">
                        {member.membership_plan?.name || "No Plan"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status, member.is_blocked)}>
                          {member.is_blocked ? 'Blocked' : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {member.join_date ? format(new Date(member.join_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <MemberActionsMenu 
                          member={member}
                          onBlockToggle={onBlockToggle}
                          onDelete={onDelete}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-white">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
