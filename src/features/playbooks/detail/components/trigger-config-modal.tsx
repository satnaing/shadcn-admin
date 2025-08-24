import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { type Trigger, TriggerType, TrackingScriptIdentificationMode } from '@/graphql/global/types.generated';
import CountrySelector from '@/components/country-selector';
import { useTrackingScriptUpdateMutation, useTrackingScriptQuery } from '../../graphql/operations.generated';

const websiteVisitorSchema = z.object({
  excludedPaths: z.array(z.object({ path: z.string().min(1, 'Path is required') })).optional(),
  allowedCountryCodes: z.array(z.string()).optional(),
  minimumSessionTimeSec: z.number().min(1).max(120).optional(),
  identificationMode: z.nativeEnum(TrackingScriptIdentificationMode).optional(),
  dailyLimit: z.number().min(1).max(1000).optional(),
});

type WebsiteVisitorConfig = z.infer<typeof websiteVisitorSchema>;

interface TriggerConfigModalProps {
  trigger: Trigger | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TriggerConfigModal({
  trigger,
  isOpen,
  onClose,
  onSuccess,
}: TriggerConfigModalProps) {
  const [updateTrackingScript, { loading }] = useTrackingScriptUpdateMutation();
  const { data: trackingScriptData } = useTrackingScriptQuery({
    skip: !isOpen || trigger?.type !== TriggerType.NewWebsiteVisitor,
  });

  const trackingScript = trackingScriptData?.trackingScript;

  // Use tracking script data if available, otherwise fall back to trigger config or defaults
  const defaultConfig: WebsiteVisitorConfig = React.useMemo(() => {
      return {
        excludedPaths: trackingScript?.excludedPaths || [],
        allowedCountryCodes: trackingScript?.allowedCountryCodes || [],
        minimumSessionTimeSec: trackingScript?.minimumSessionTimeSec || 10,
        identificationMode: trackingScript?.identificationMode || TrackingScriptIdentificationMode.All,
        dailyLimit: trackingScript?.dailyLimit || 100,
      };
  }, [trackingScript]);

  const form = useForm<WebsiteVisitorConfig>({
    resolver: zodResolver(websiteVisitorSchema),
    defaultValues: defaultConfig,
  });

  // Reset form when tracking script data changes
  React.useEffect(() => {
    if (trackingScript) {
      form.reset(defaultConfig);
    }
  }, [trackingScript, defaultConfig, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'excludedPaths',
  });

  const handleSave = async (data: WebsiteVisitorConfig) => {
    try {
      await updateTrackingScript({
        variables: {
          input: {
            excludedPaths: data.excludedPaths,
            allowedCountryCodes: data.allowedCountryCodes,
            minimumSessionTimeSec: data.minimumSessionTimeSec,
            identificationMode: data.identificationMode || TrackingScriptIdentificationMode.All,
            dailyLimit: data.dailyLimit,
          }
        }
      });
      
      toast.success('Trigger configuration saved');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(`Failed to save configuration: ${error.message}`);
    }
  };

  if (!trigger || trigger.type !== TriggerType.NewWebsiteVisitor) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Website Visitor Trigger</DialogTitle>
          
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
            {/* Excluded Paths */}
            <FormItem>
              <FormLabel>Excluded Paths</FormLabel>
              <FormDescription>
                The script will not be loaded on pages containing these paths
              </FormDescription>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`excludedPaths.${index}.path`}
                    render={({ field }) => (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-6">
                          {index + 1}.
                        </span>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="/excluded-path"
                            className="flex-1"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ path: '' })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Path
                </Button>
              </div>
            </FormItem>

            {/* Minimum Session Time */}
            <FormField
              control={form.control}
              name="minimumSessionTimeSec"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Session Time (seconds)</FormLabel>
                  <FormDescription>
                    Sessions shorter than this will not be identified
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={1}
                        max={120}
                        step={1}
                        value={[field.value || 10]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-right text-sm font-medium">
                        {field.value || 10}s
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allowed Countries */}
            <FormItem>
              <FormLabel>Allowed Countries</FormLabel>
              <FormDescription>
                Only identify visitors from these countries
              </FormDescription>
              <FormControl>
                <CountrySelector
                  control={form.control}
                  name="allowedCountryCodes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Identification Mode */}
            <FormField
              control={form.control}
              name="identificationMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Who should we identify?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={TrackingScriptIdentificationMode.All} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          People (USA Only) & Companies (Global)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={TrackingScriptIdentificationMode.OnlyContacts} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Only People (USA Only)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Daily Limit */}
            <FormField
              control={form.control}
              name="dailyLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Identification Limit</FormLabel>
                  <FormDescription>
                    Maximum identifications per day
                  </FormDescription>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={1000}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">
                        identifications
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
