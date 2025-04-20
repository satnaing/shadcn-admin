import { useState } from 'react'
import { useAccountListContext } from '../context/account-list-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ImportAccountsInput, importAccountsSchema } from '../data/schema'
import { accountService, ImportResult } from '@/services/account-services'
import { accountGroupService } from '@/services/account-group-service'

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
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'

// 账号列表导入对话框组件实现
export function AccountListImportDialog() {
  const { open, setOpen } = useAccountListContext()
  const [searchTerm, setSearchTerm] = useState<string>('')

  // 创建表单
  const form = useForm<ImportAccountsInput>({
    resolver: zodResolver(importAccountsSchema),
    defaultValues: {
      jsonl: undefined,
      groupId: undefined,
    },
  })

  const { data: groupOptions, isLoading: groupOptionsLoading } = useQuery({
    queryKey: [`${accountGroupService.path}/options`, searchTerm],
    queryFn: () => accountGroupService.getOptions(searchTerm),
    placeholderData: keepPreviousData,
  })

  const queryClient = useQueryClient()

  const improtMutation = useMutation({
    mutationFn: (data: ImportAccountsInput) => accountService.importAccounts(data),
    onSuccess: (data) => {
      var result = data.data
      toast.success(`成功导入 ${result.importCount} 个账号${result.errorCount ? `，${result.errorCount} 个失败` : ''}`, { duration: 2000 })
      queryClient.invalidateQueries({ queryKey: [accountService.path] })
      // 关闭对话框
      setOpen(null)
    },
    onError: (error) => {
      console.error('导入账号失败:', error)
      toast.error('导入账号失败')
    },
  })




  // 提交导入
  const onSubmit = async (data: ImportAccountsInput) => {
    improtMutation.mutate(data)

  }

  return (
    <Dialog open={open === 'import'} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入账号</DialogTitle>
          <DialogDescription>
            从JSONL或JSON文件导入账号数据。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
            {/* json文本 */}
            <FormField
              control={form.control}
              name='jsonl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>账号数据</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请在此处粘贴jsonl文件内容"
                      className="resize-none h-50"
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
                  <FormLabel>选择分组</FormLabel>
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
                      <Command>
                        <CommandInput placeholder="搜索分组..." onValueChange={setSearchTerm} />
                        <CommandList>
                          <CommandEmpty>未能找到组.</CommandEmpty>
                          <CommandGroup>
                            {groupOptions?.map((group) => (
                              <CommandItem
                                value={group.label}
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
                type='button'
                variant='secondary'
                onClick={() => setOpen(null)}
                disabled={improtMutation.isPending}
              >
                取消
              </Button>
              <Button type='submit' disabled={improtMutation.isPending}>
                {improtMutation.isPending ? '导入中...' : '开始导入'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 