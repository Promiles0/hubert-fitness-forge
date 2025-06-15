
import { 
  Users, 
  Activity, 
  Calendar, 
  BarChart2, 
  User, 
  DollarSign, 
  Edit, 
  MessageSquare, 
  FileText, 
  Store, 
  Settings
} from "lucide-react";

export const getAdminNavigation = (currentPath: string) => [
  { 
    name: "Dashboard", 
    href: "/admin", 
    icon: BarChart2, 
    description: "Overview & Analytics",
    active: currentPath === "/admin"
  },
  { 
    name: "Members", 
    href: "/admin/members", 
    icon: Users, 
    description: "Manage Members",
    active: currentPath === "/admin/members"
  },
  { 
    name: "Classes", 
    href: "/admin/classes", 
    icon: Calendar, 
    description: "Schedule & Bookings",
    active: currentPath === "/admin/classes"
  },
  { 
    name: "Trainers", 
    href: "/admin/trainers", 
    icon: User, 
    description: "Staff Management",
    active: currentPath === "/admin/trainers"
  },
  { 
    name: "Payments", 
    href: "/admin/payments", 
    icon: DollarSign, 
    description: "Financial Records",
    active: currentPath === "/admin/payments"
  },
  { 
    name: "Plans", 
    href: "/admin/membership-plans", 
    icon: Edit, 
    description: "Membership Plans",
    active: currentPath === "/admin/membership-plans"
  },
  { 
    name: "Messages", 
    href: "/admin/messages", 
    icon: MessageSquare, 
    description: "Communications",
    active: currentPath === "/admin/messages"
  },
  { 
    name: "Reports", 
    href: "/admin/reports", 
    icon: FileText, 
    description: "Analytics & Logs",
    active: currentPath === "/admin/reports"
  },
  { 
    name: "Store", 
    href: "/admin/store", 
    icon: Store, 
    description: "Product Management",
    active: currentPath === "/admin/store"
  },
  { 
    name: "Settings", 
    href: "/admin/settings", 
    icon: Settings, 
    description: "System Configuration",
    active: currentPath === "/admin/settings"
  }
];
