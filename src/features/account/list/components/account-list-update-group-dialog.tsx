import { useEffect, useState } from 'react'
import { useAccountListContext } from '../context/account-list-context'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UpdateAccountGroupInput, updateAccountGroupSchema } from '../data/schema'
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
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// 账号列表更新分组对话框组件实现
export function AccountListUpdateGroupDialog() {
  const { open, setOpen, selectedAccounts, refreshData } = useAccountListContext()
  const [isLoading, setIsLoading] = useState(false)
  const [accountGroups, setAccountGroups] = useState<{ id: number, name: string }[]>([])

  // 创建表单
  const form = useForm<UpdateAccountGroupInput>({
    resolver: zodResolver(updateAccountGroupSchema),
    defaultValues: {
      accountIds: [],
      groupId: 0,
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

    if (open === 'updateGroup') {
      fetchAccountGroups()
      
      // 设置选中的账号ID
      form.setValue(
        'accountIds',
        selectedAccounts.map((account) => account.id)
      )
    }
  }, [open, form, selectedAccounts])

  // 提交更新
  const onSubmit = async (data: UpdateAccountGroupInput) => {
    setIsLoading(true)
    try {
      // 调用更新分组API
      await accountService.updateAccountGroup(data.accountIds, data.groupId)
      
      // 操作成功提示
      const groupName = accountGroups.find(g => g.id === data.groupId)?.name || '未知分组'
      toast.success(`成功将 ${data.accountIds.length} 个账号移动到"${groupName}"分组`)
      
      // 刷新数据
      refreshData()
      
      // 关闭对话框
      setOpen(null)
    } catch (error) {
      console.error('更新分组失败', error)
      toast.error('更新账号分组时发生错误，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open === 'updateGroup'} onOpenChange={(isOpen) => !isOpen && setOpen(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改账号分组</DialogTitle>
          <DialogDescription>
            将选中的 {selectedAccounts.length} 个账号移动到指定分组。
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
            <FormField
              control={form.control}
              name='groupId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>选择分组</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='选择分组' />
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
                {isLoading ? '更新中...' : '确认更新'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 