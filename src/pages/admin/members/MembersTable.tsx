
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { MembersTableProps } from "./types";
import { MemberActions } from "./MemberActions";

export const MembersTable = ({ 
  members, 
  isLoading, 
  getStatusColor, 
  handleDeleteMember 
}: MembersTableProps) => {
  return (
    <Card className="bg-fitness-darkGray border-gray-800">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-fitness-red" />
            <span className="ml-2 text-white">Loading members...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-fitness-black">
                <TableRow className="border-b border-gray-800 hover:bg-fitness-black/70">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Plan</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Join Date</TableHead>
                  <TableHead className="text-white">Expiry Date</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members && members.length > 0 ? (
                  members.map((member) => (
                    <TableRow key={member.id} className="border-b border-gray-800 hover:bg-fitness-black/30">
                      <TableCell className="text-white font-medium">
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell className="text-gray-300">{member.email}</TableCell>
                      <TableCell className="text-gray-300">
                        {member.membership_plan?.name || "No Plan"}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {member.join_date ? format(new Date(member.join_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {member.expiry_date ? format(new Date(member.expiry_date), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <MemberActions 
                          member={member} 
                          onDelete={handleDeleteMember} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-white">
                      No members found.
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
