import React from 'react';
import {
  ShoppingBag,
  Pill,
  Stethoscope,
  Car,
  Wrench,
  Smartphone,
  Heart,
  FileText,
  HeartHandshake,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

interface Props {
  iconName: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  Pill,
  Stethoscope,
  Car,
  Wrench,
  Smartphone,
  Heart,
  FileText,
  HeartHandshake,
};

export const CategoryIcon: React.FC<Props> = ({ iconName, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[iconName] || HelpCircle;
  return <IconComponent className={className} />;
};
