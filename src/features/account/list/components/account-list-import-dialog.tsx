import { useEffect, useState } from 'react'
import { useAccountListContext } from '../context/account-list-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ImportAccountsInput, importAccountsSchema } from '../data/schema'
import { accountService } from '@/services/account-services'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// 账号列表导入对话框组件实现
export function AccountListImportDialog() {
  const { open, setOpen, refreshData } = useAccountListContext()
  const [isLoading, setIsLoading] = useState(false)
  const [accountGroups, setAccountGroups] = useState<{ id: number, name: string }[]>([])

  // 创建表单
  const form = useForm<ImportAccountsInput>({
    resolver: zodResolver(importAccountsSchema),
    defaultValues: {
      file: undefined,
      groupId: undefined,
    },
  })

  // 获取账号分组
  useEffect(() => {
    const fetchAccountGroups = async () => {
      try {
        const response = await accountService.getAccountGroups()
        setAccountGroups(response.content || [])
      } catch (error) {
        console.error('获取账号分组失败', error)
      }
    }

    if (open === 'import') {
      fetchAccountGroups()
    }
  }, [open])

  // 提交导入
  const onSubmit = async (data: ImportAccountsInput) => {
    setIsLoading(true)
    try {
      // 调用导入API
      const result = await accountService.importAccounts(data.file, data.groupId)
      
      // 操作成功提示
      toast.success(`成功导入 ${result.importCount} 个账号`)
      
      // 刷新数据
      refreshData()
      
      // 关闭对话框
      setOpen(null)
    } catch (error) {
      console.error('导入账号失败', error)
      toast.error('导入账号时发生错误，请检查文件格式')
    } finally {
      setIsLoading(false)
    }
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
            {/* 文件选择 */}
            <FormField
              control={form.control}
              name='file'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>选择文件</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='file'
                      accept='.json,.jsonl'
                      disabled={isLoading}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          onChange(file)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* 分组选择 */}
            <FormField
              control={form.control}
              name='groupId'
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>选择分组（可选）</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => onChange(Number(value))}
                      {...fieldProps}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='不分配分组' />
                      </SelectTrigger>
                      <SelectContent>
                        {accountGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type='button' 
                variant='secondary' 
                onClick={() => setOpen(null)} 
                disabled={isLoading}
              >
                取消
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? '导入中...' : '开始导入'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 