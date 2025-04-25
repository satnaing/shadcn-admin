import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useDataTableContext } from '@/components/data-table/data-table-context'
import { followerCollectService } from '@/services/follower-collect-service'
import { CreateFollowerCollectTaskInput, createFollowerCollectTaskSchema } from '../data/schema'
import { Popover, PopoverTrigger } from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { accountGroupService } from '@/services/account-group-service'
import { Check, ChevronsUpDown } from 'lucide-react'
import { PopoverContent } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useState } from 'react'

export function FollowerCollectTaskCreateDialog() {
  const { open, setOpen, current, setCurrent } = useDataTableContext()
  const [searchTerm, setSearchTerm] = useState<string>('')


  const queryClient = useQueryClient()

  // 创建和更新的mutation hooks
  const createMutation = useMutation({
    mutationFn: (data: CreateFollowerCollectTaskInput) => followerCollectService.create(data),
    onSuccess: () => {
      toast.success('粉丝采集任务创建成功', { duration: 2000 })
      queryClient.invalidateQueries({ queryKey: [followerCollectService.path] })
    },
    onError: (error) => {
      console.error('创建粉丝采集任务失败:', error)
      toast.error('创建粉丝采集任务失败')
    },
  })

  // 表单实例
  const form = useForm<CreateFollowerCollectTaskInput>({
    resolver: zodResolver(createFollowerCollectTaskSchema),
    defaultValues: {
      name: current?.name || '',
      description: current?.description || '',
      groupId: current?.groupId || undefined,
    },
  })

  const { data: groupOptions } = useQuery({
    queryKey: [`${accountGroupService.path}/options`, searchTerm],
    queryFn: () => accountGroupService.getOptions(searchTerm),
    placeholderData: keepPreviousData,
  })

  // 提交表单
  const onSubmit = (data: CreateFollowerCollectTaskInput) => {
    createMutation.mutate(data, {
        onSuccess: () => {
          setOpen(null)
          form.reset()
        }
      })
  }

  // 关闭对话框
  const onClose = () => {
    setCurrent(null)
    setOpen(null)
    form.reset()
  }

  const isLoading = createMutation.isPending

  return (
    <Dialog open={!!open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>创建粉丝采集任务</DialogTitle>
          <DialogDescription>
            创建一个新的粉丝采集任务。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 名称字段 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入账号组名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />      

            {/* 描述字段 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="描述此账号组的用途"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             {/* 分组选择 - 使用Combobox替代简单Select以支持搜索 */}
             <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号组</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? groupOptions?.find(
                              (group) => group.value === field.value
                            )?.label
                            : "选择分组"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="搜索分组..." onValueChange={setSearchTerm} />
                        <CommandList>
                          <CommandEmpty>未能找到组.</CommandEmpty>
                          <CommandGroup>
                            {groupOptions?.map((group) => (
                              <CommandItem
                                value={group.value}
                                key={group.value}
                                onSelect={() => {
                                  form.setValue("groupId", group.value)
                                }}
                              >
                                {group.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    group.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '处理中...' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 