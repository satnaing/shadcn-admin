import { type ReactElement, type ReactNode, useState, cloneElement } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface ConfirmableProps {
  titleText?: string;
  bodyText?: string | ReactNode;
  buttonText?: string;
  variant?: 'danger' | 'info';
  onConfirm: () => any;
  children: ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
  isLoading?: boolean;
  isOpen?: boolean;
  onCancel?: () => void;
}

export default function Confirmable({
  bodyText,
  titleText,
  onConfirm,
  variant = 'danger',
  buttonText,
  onCancel,
  children,
  isLoading,
  isOpen: controlledIsOpen,
}: ConfirmableProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleOpen = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  };

  const handleClose = () => {
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
    onCancel?.();
  };

  const handleConfirm = async () => {
    await onConfirm();
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(false);
    }
  };

  // Clone the child element and add onClick handler
  const childWithProps = cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      // Call the child's onClick if it exists
      if (children.props.onClick) {
        children.props.onClick(e);
      }
      handleOpen();
    },
  });

  return (
    <>
      {childWithProps}
      <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{titleText || 'Are you sure?'}</AlertDialogTitle>
            {bodyText && (
              <AlertDialogDescription>
                {typeof bodyText === 'string' ? bodyText : bodyText}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                variant === 'danger' && 'bg-destructive hover:bg-destructive/90'
              )}
            >
              {isLoading ? 'Loading...' : buttonText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
