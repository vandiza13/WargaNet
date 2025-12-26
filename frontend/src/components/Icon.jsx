import React from 'react';
import {
  Home, FileText, AlertCircle, Mail, Users, ShoppingBag,
  TrendingUp, MessageSquare, Calendar, Clock, MapPin,
  Megaphone, Settings, Edit, Trash2, Plus, Search
} from 'lucide-react';

const iconMap = {
  home: Home,
  fileText: FileText,
  alert: AlertCircle,
  mail: Mail,
  users: Users,
  shopping: ShoppingBag,
  trending: TrendingUp,
  message: MessageSquare,
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  megaphone: Megaphone,
  settings: Settings,
  edit: Edit,
  delete: Trash2,
  plus: Plus,
  search: Search,
};

export default function Icon({ name, className = 'w-6 h-6' }) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} />;
}
