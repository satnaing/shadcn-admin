//code when api will be ready

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// export function ViewCustomerButton({ customerId }: { customerId: string }) {
//   const [open, setOpen] = useState(false);

//   // Fetch customer details when modal is open
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ['customer', customerId],
//     queryFn: async () => {
//       const response = await axios.get(`${BACKEND_URL}/v1/superadmin/customers/${customerId}`);
//       return response.data;
//     },
//     enabled: open, // Only fetch when modal is open
//   });

//   return (
//     <>
//       <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
//         View
//       </Button>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogTitle>Customer Details</DialogTitle>
//           {isLoading && <div>Loading...</div>}
//           {isError && <div>Error loading customer details.</div>}
//           {data && (
//             <div className="space-y-2">
//               <div><strong>Name:</strong> {data.firstName} {data.lastName}</div>
//               <div><strong>Email:</strong> {data.email}</div>
//               <div><strong>Phone:</strong> {data.phoneNumber}</div>
//               <div><strong>Referral Code:</strong> {data.refferal_code}</div>
//               {/* Add more fields as needed */}
//             </div>
//           )}
//           <DialogClose asChild>
//             <Button variant="secondary">Close</Button>
//           </DialogClose>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }


//codde using the mock data created
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { customer as mockCustomers } from '../data/customer'; // Import your mock data
import {IconEyeDotted} from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
export function ViewCustomerButton({ customerId }: { customerId: string }) {
  const [open, setOpen] = useState(false);

  // Find the customer in the mock data
  const customer = mockCustomers.find((c) => c.id === customerId);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              <IconEyeDotted className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            View Details
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Customer Details</DialogTitle>
          {!customer && <div>Customer not found.</div>}
          {customer && (
            <div className="space-y-2">
              <div><strong>Name:</strong> {customer.firstName} {customer.lastName}</div>
              <div><strong>Email:</strong> {customer.email}</div>
              <div><strong>Phone:</strong> {customer.phoneNumber}</div>
              <div><strong>Referral Code:</strong> {customer.refferal_code}</div>
              {/* Add more fields as needed */}
            </div>
          )}
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}