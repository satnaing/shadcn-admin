// src/components/your-notification-bell.tsx
import React from 'react';
import { Bell, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'; // Lucide icons
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// 1. Define the data structure for a notification
interface Notification {
  id: string;
  icon: React.ElementType;
  iconStyling: string; // Tailwind classes for icon background and color
  title: string;
  timestamp: string;
  read?: boolean; // Optional: for styling unread notifications
}

// 2. Mock data (replace this with your actual data source and state management)
const mockNotificationsData: Notification[] = [
  {
    id: 'notif1',
    icon: FileText,
    // Corresponds to your blue "assignment" icon
    iconStyling: 'bg-primary/10 text-primary', 
    title: 'New asset request from HR',
    timestamp: '5 minutes ago',
    read: false,
  },
  {
    id: 'notif2',
    icon: CheckCircle2,
    // Corresponds to your green "check_circle" icon
    // Using common Tailwind green shades as an example
    iconStyling: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400', 
    title: 'Laptop assignment approved',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif3',
    icon: AlertTriangle,
    // Corresponds to your orange/yellow "warning" icon
    // Using common Tailwind yellow shades as an example
    iconStyling: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400', 
    title: 'Low ink alert for printer HP LaserJet Pro M203dw',
    timestamp: 'Yesterday',
    read: false,
  },
  {
    id: 'notif4',
    icon: FileText,
    iconStyling: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400', // Another example color
    title: 'Maintenance scheduled for Server X',
    timestamp: '3 days ago',
    read: true, // Example of a read notification
  },
];

// 3. Individual Notification List Item Component
type NotificationListItemProps = Notification;

function NotificationListItem({
  icon: IconComponent,
  iconStyling,
  title,
  timestamp,
  read,
}: NotificationListItemProps) {
  return (
    <div
      className={cn(
        "flex p-3 items-start cursor-pointer hover:bg-muted/60 dark:hover:bg-muted/30",
        !read && "bg-muted/30 dark:bg-muted/20"
      )}
    >
      <div
        className={cn(
          "mr-3 mt-0.5 p-1.5 rounded-full flex items-center justify-center flex-shrink-0",
          iconStyling
        )}
      >
        <IconComponent className="size-4" />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium text-foreground leading-tight">
          {title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{timestamp}</p>
      </div>
    </div>
  );
}

// 4. Main NotificationBell Component
export function NotificationBell() {
  // In a real app, notifications and open state would come from props or context/state management
  const [notifications ] = React.useState<Notification[]>(mockNotificationsData);
  const [isOpen, setIsOpen] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // TODO: Implement logic for "View all notifications" click
  // const handleViewAll = () => { console.log("View all notifications clicked"); setIsOpen(false); };

  // TODO: Implement logic for individual notification clicks (e.g., mark as read)

  return (
    <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-9 w-9" // Standard icon button size
        >
          <Bell className="size-5" /> {/* Adjust icon size as needed */}
          {unreadCount > 0 && (
            <span
              className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
              aria-label={`${unreadCount} new notifications`}
            >
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 overflow-hidden shadow-lg border" // Removed default padding, added border
        // Your original HTML used: w-80 mt-1 bg-surface rounded-lg shadow-lg border border-border z-50
        // Shadcn DropdownMenuContent already provides most of this styling.
      >
        {/* Header Section */}
        <div className="p-3 flex justify-between items-center">
          <h3 className="font-semibold text-sm text-foreground">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <Separator />

        {/* Notification Items List */}
        <ScrollArea className="max-h-72"> {/* Your original: max-h-72 */}
          {notifications.length > 0 ? (
            notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <NotificationListItem {...item} />
                {/* Add Separator if not the last item */}
                {index < notifications.length - 1 && <Separator />}
              </React.Fragment>
            ))
          ) : (
            <p className="p-6 text-sm text-center text-muted-foreground">
              You're all caught up!
            </p>
          )}
        </ScrollArea>
        
        {/* Separator before footer only if there are items */}
        {notifications.length > 0 && <Separator />}

        {/* Footer Section */}
        <div className="p-2 text-center">
          <Button
            variant="link"
            className="text-sm h-auto p-1 text-primary hover:text-primary/90 w-full"
            // onClick={handleViewAll}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}