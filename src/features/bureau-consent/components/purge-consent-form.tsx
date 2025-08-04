import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { getToken } from '@/lib/utils';
import { toast } from 'sonner';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

interface PurgeResponse {
  status: number;
  message: string;
  success: boolean;
}

interface PurgeConsentFormProps {
  onResponse: (response: PurgeResponse) => void;
}

export function PurgeConsentForm({ onResponse }: PurgeConsentFormProps) {
  const [customerId, setCustomerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurgeConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId.trim()) {
      toast.error('Please enter a Customer ID');
      return;
    }

    setIsLoading(true);

    try {
      const token = getToken();
      const response = await axios.post(`${BACKEND_BASE_URL}/v1/bureau/purge-bureau`, {
        data: { customer_id: Number(customerId) },
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
      });

      const result: PurgeResponse = {
        status: response.status,
        message: response.data?.message || 'Consent purged successfully',
        success: response.status === 200
      };

      onResponse(result);

      if (result.success) {
        toast.success(`Consent purged successfully for Customer ID: ${customerId}`);
      } else {
        toast.error(`Failed to purge consent for Customer ID: ${customerId}`);
      }

    } catch (error: any) {
      const result: PurgeResponse = {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to purge consent',
        success: false
      };

      onResponse(result);
      toast.error(`Failed to purge consent for Customer ID: ${customerId}. ${result.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCustomerId('');
    onResponse({
      status: 0,
      message: '',
      success: false
    });
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Purge Bureau Consent</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePurgeConsent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Customer ID
            </label>
            <Input
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter Customer ID"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={!customerId.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Purging...' : 'Purge Consent'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 