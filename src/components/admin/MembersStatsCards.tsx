
import { Card, CardContent } from "@/components/ui/card";

interface Member {
  id: string;
  status: string;
  is_blocked: boolean;
  trainer: {
    first_name: string;
    last_name: string;
  } | null;
}

interface MembersStatsCardsProps {
  members: Member[] | undefined;
}

export const MembersStatsCards = ({ members }: MembersStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-green-500">
            {members?.filter(m => m.status === 'active' && !m.is_blocked).length || 0}
          </div>
          <p className="text-sm text-gray-400">Active Users</p>
        </CardContent>
      </Card>
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-blue-500">
            {members?.length || 0}
          </div>
          <p className="text-sm text-gray-400">Total Users</p>
        </CardContent>
      </Card>
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-red-500">
            {members?.filter(m => m.is_blocked).length || 0}
          </div>
          <p className="text-sm text-gray-400">Blocked Users</p>
        </CardContent>
      </Card>
      <Card className="bg-fitness-darkGray border-gray-800">
        <CardContent className="p-6">
          <div className="text-2xl font-bold text-orange-500">
            {members?.filter(m => m.trainer).length || 0}
          </div>
          <p className="text-sm text-gray-400">With Trainers</p>
        </CardContent>
      </Card>
    </div>
  );
};
