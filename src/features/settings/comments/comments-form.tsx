"use client"

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { MessageSquare, Settings, Smile, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const commentSettingsSchema = z.object({
  aboutProfile: z.string().min(10, {
    message: "Profile description must be at least 10 characters.",
  }),
  commentStyle: z.enum(['balanced', 'casual', 'enthusiastic']),
  commentsPerDay: z.number().min(0).max(100),
  useEmojis: z.boolean().default(true),
  useExclamations: z.boolean().default(true),
})

type CommentSettingsValues = z.infer<typeof commentSettingsSchema>

const defaultValues: Partial<CommentSettingsValues> = {
  commentStyle: 'balanced',
  commentsPerDay: 10,
  useEmojis: true,
  useExclamations: true,
}

export function CommentsForm() {
  const form = useForm<CommentSettingsValues>({
    resolver: zodResolver(commentSettingsSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className="space-y-8"
      >
        {/* About Profile Section */}
        <FormField
          control={form.control}
          name="aboutProfile"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <FormLabel className="text-foreground font-semibold">About Your Profile</FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>Describe your background to help generate<br/>comments that match your expertise<br/>and professional voice</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Describe your professional background, expertise, and interests to help generate relevant comments"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This helps our AI understand your voice and expertise
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Comment Settings Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Comment Settings</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Control the length of generated comments and<br/>set your preferred daily comment volume</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Comment Size */}
            <FormField
              control={form.control}
              name="commentStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select comment style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="balanced">Short (10 words)</SelectItem>
                      <SelectItem value="casual">Medium (15 words)</SelectItem>
                      <SelectItem value="enthusiastic">Large (25 words)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments Per Day */}
            <FormField
              control={form.control}
              name="commentsPerDay"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Comments Per Day</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p>Set your preferred daily comment volume</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      {...field}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, Number(e.target.value)))
                        field.onChange(val)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Style Preferences Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Style Preferences</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Customize the tone and style of your automated comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="useEmojis"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Use Emojis
                    </FormLabel>
                    <FormDescription>
                      Include relevant emojis in comments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useExclamations"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Use Exclamations
                    </FormLabel>
                    <FormDescription>
                      Add emphasis with exclamation points
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Update settings</Button>
      </form>
    </Form>
  )
}