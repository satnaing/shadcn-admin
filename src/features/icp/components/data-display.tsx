import { type LucideIcon } from 'lucide-react';

interface DataDisplayProps {
  icon: LucideIcon;
  label: string;
}

export default function DataDisplay({ icon: Icon, label }: DataDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
