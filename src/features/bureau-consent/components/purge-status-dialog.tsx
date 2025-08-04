import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconCheck, IconX } from '@tabler/icons-react';

interface PurgeStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: number;
  status: number;
  message: string;
  success: boolean;
}

export function PurgeStatusDialog({ 
  isOpen, 
  onClose, 
  customerId, 
  status, 
  message, 
  success 
}: PurgeStatusDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {success ? (
              <IconCheck className="h-5 w-5 text-green-600" />
            ) : (
              <IconX className="h-5 w-5 text-red-600" />
            )}
            Purge Result for Customer ID: {customerId}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status Code:</span>
            <Badge 
              variant={success ? "default" : "destructive"}
              className={success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {status}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Result:</span>
            <Badge 
              variant={success ? "default" : "destructive"}
              className={success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
            >
              {success ? "Success" : "Failed"}
            </Badge>
          </div>
          
          <div>
            <span className="text-sm font-medium">Message:</span>
            <p className="mt-1 text-sm text-muted-foreground bg-muted p-2 rounded">
              {message}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 