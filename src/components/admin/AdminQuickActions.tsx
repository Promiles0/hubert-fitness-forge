
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, User, BarChart2, Zap } from "lucide-react";

const AdminQuickActions = () => {
  return (
    <Card className="bg-white dark:bg-fitness-darkGray border-gray-200 dark:border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="h-5 w-5 text-fitness-red" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/members">
            <Button className="w-full bg-fitness-red hover:bg-red-700 h-12">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </Link>
          <Link to="/admin/classes">
            <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Class
            </Button>
          </Link>
          <Link to="/admin/trainers">
            <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
              <User className="h-4 w-4 mr-2" />
              Manage Staff
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" className="w-full h-12 border-gray-300 dark:border-gray-600">
              <BarChart2 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
