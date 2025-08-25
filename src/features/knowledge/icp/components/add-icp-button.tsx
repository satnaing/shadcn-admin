import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MAX_ICP_PROFILES } from '../constants';

interface AddICPButtonProps {
  icpProfiles?: any[];
}

export default function AddICPButton({ icpProfiles = [] }: AddICPButtonProps) {
  const navigate = useNavigate();
  const isDisabled = icpProfiles.length >= MAX_ICP_PROFILES;

  const handleClick = () => {
    navigate({ to: '/knowledge/icp/new' });
  };

  const button = (
    <Button 
      onClick={handleClick} 
      disabled={isDisabled}
    >
      <Plus className="mr-2 h-4 w-4" />
      Create ICP Profile
    </Button>
  );

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>You can only have up to {MAX_ICP_PROFILES} ICP profiles</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
