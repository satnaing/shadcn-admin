import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PurgeResponse {
  status: number | string;
  message: string;
  status_code?: number | string;
  success?: boolean;
}

interface ResponseDisplayProps {
  response: PurgeResponse | null;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  if (!response) {
    return null;
  }

  const statusCode = Number(response.status_code ?? response.status);
  
  const isSuccess = typeof response.success === 'boolean' 
    ? response.success 
    : response.status !== 'error';

  return (
    <Card className="mt-6 max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge 
            variant={isSuccess ? "default" : "destructive"}
            className={isSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {isSuccess ? 'Success' : 'Failed'} ({statusCode})
          </Badge>
          Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Status Code:</span>
            <p className="text-sm text-muted-foreground">{statusCode}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Message:</span>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
              {response.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

