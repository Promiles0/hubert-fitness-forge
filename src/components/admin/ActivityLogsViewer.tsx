
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { Search, Clock, User, Activity } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ActivityLogsViewer = () => {
  const { logs, isLoading } = useActivityLogs();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs?.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner size={40} className="flex items-center justify-center h-96" />;
  }

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'insert':
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'edit':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'remove':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Logs
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge className={getActionBadgeColor(log.action)}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{log.entity_type}</div>
                  {log.entity_id && (
                    <div className="text-sm text-gray-500">
                      ID: {log.entity_id.slice(0, 8)}...
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </TableCell>
                <TableCell>
                  {log.details && (
                    <div className="text-xs text-gray-600 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                  {log.ip_address && (
                    <div className="text-xs text-gray-500">
                      IP: {log.ip_address}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsViewer;
