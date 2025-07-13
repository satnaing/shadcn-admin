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
import { MessageSquare, Settings, Smile, Info, Hash, ArrowLeft } from "lucide-react"
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
import { useGetUserQuery } from '@/features/auth/query/user.query'
import { planSetting } from '@/features/settings/config/plan-setting.config'

const commentSettingsSchema = z.object({
  about: z.string().min(10, {
    message: "Profile description must be at least 10 characters.",
  }),
  length: z.enum(['short', 'medium', 'long']),
  commentsPerDay: z.number().min(0).max(100),
  turnOnEmoji: z.boolean().default(true),
  turnOnExclamations: z.boolean().default(true),
  turnOnHashtags: z.boolean().default(false),
  tagAuthor: z.boolean().default(false),
  rules: z.string().optional(),
})

type CommentSettingsValues = z.infer<typeof commentSettingsSchema>

const defaultValues: Partial<CommentSettingsValues> = {
  length: 'medium',
  commentsPerDay: 10,
  turnOnEmoji: true,
  turnOnExclamations: true,
  turnOnHashtags: false,
  tagAuthor: false,
  rules: '',
}

export function CommentsForm({ prev }: { prev?: () => void }) {
  const { data: user } = useGetUserQuery()
  const userPlan = user?.subscribedProduct?.name?.toLowerCase() as 'starter' | 'pro' | 'premium'
  
  const shouldDisplayTagAuthorSetting = planSetting['tagAuthor']?.[userPlan] ?? false
  const shouldDisplayCommentRulesSetting = planSetting['commentRules']?.[userPlan] ?? false

  const form = useForm<CommentSettingsValues>({
    resolver: zodResolver(commentSettingsSchema),
    defaultValues,
  })

  const onSubmit = (data: CommentSettingsValues) => {
    // Prepare payload for API
    const payload = {
      ...data,
      // Add any additional transformations here
    }
    showSubmittedData(payload)
    
    // If you need to call an API:
    // if (activeProfile?._id) {
    //   updateOrCreateSetting({
    //     profileId: activeProfile._id,
    //     commentSetting: payload,
    //     userPlan
    //   })
    // }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Profile Info */}
        

        {/* About Profile Section */}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <FormLabel className="text-foreground font-semibold">About You</FormLabel>
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
                  placeholder="I'm a digital marketer... I help people... I've helped 50+ founders to... After many failures, I learned that..."
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

        {/* Additional Rules Section */}
        {shouldDisplayCommentRulesSetting && (
          <FormField
            control={form.control}
            name="rules"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <FormLabel className="text-foreground font-semibold">Additional Comment Generation Rules</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Write additional rules to customize<br/>how comments should be generated</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Write additional rules, e.g., Avoid phrases like 'Great post' or 'Nice work."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            {/* Comment Length */}
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select comment length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="short">Short (10 words)</SelectItem>
                      <SelectItem value="medium">Medium (15 words)</SelectItem>
                      <SelectItem value="long">Long (25 words)</SelectItem>
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

        {/* Writer Settings Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-lg font-medium">Writer Settings</h3>
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
              name="turnOnEmoji"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Turn on emoji
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
              name="turnOnExclamations"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Turn on exclamations
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

            <FormField
              control={form.control}
              name="turnOnHashtags"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Turn on hashtags
                    </FormLabel>
                    <FormDescription>
                      Include relevant hashtags in comments
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

            {shouldDisplayTagAuthorSetting && (
              <FormField
                control={form.control}
                name="tagAuthor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Tag Post Author
                      </FormLabel>
                      <FormDescription>
                        Mention the author in your comments
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
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between">
          {prev && (
            <Button 
              variant="outline" 
              onClick={prev}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button type="submit">Update settings</Button>
        </div>
      </form>
    </Form>
  )
}