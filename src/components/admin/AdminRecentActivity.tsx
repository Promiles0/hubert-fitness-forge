
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from "lucide-react";

interface AdminRecentActivityProps {
  stats: {
    recentMembers: Array<{
      first_name: string;
      last_name: string;
      created_at: string;
    }>;
    recentBookings: Array<{
      created_at: string;
      members: {
        first_name: string;
        last_name: string;
      };
      classes: {
        name: string;
      };
    }>;
  } | undefined;
}

const AdminRecentActivity = ({ stats }: AdminRecentActivityProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-fitness-red" />
            Recent Member Registrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats?.recentMembers?.length ? (
            stats.recentMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-fitness-red text-white">
                      {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Joined {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  New
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent registrations
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-fitness-red" />
            Recent Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats?.recentBookings?.length ? (
            stats.recentBookings.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {booking.classes.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    by {booking.members.first_name} {booking.members.last_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                  <Badge variant="outline" className="border-fitness-red text-fitness-red">
                    Booked
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent bookings
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRecentActivity;
