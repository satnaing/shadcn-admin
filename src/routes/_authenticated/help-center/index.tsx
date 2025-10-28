import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { VerificationCodeInput } from '@/features/components/verification-code-input'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: HelpCenter,
})

function HelpCenter() {
  const [code, setCode] = useState<string>('')
  const [isCodeComplete, setIsCodeComplete] = useState<boolean>(false)
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  const handleCodeComplete = (inputCode: string) => {
    setCode(inputCode)
    setIsCodeComplete(true)
    setIsVerified(null) // Reset verification status when new code is entered
  }

  const handleVerify = () => {
    // Simulate verification process
    setIsVerified(true)
  }

  const handleReset = () => {
    setCode('')
    setIsCodeComplete(false)
    setIsVerified(null)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card className="border border-border rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">验证码验证</CardTitle>
          <CardDescription>请输入发送到您手机的6位验证码</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="py-6">
            <VerificationCodeInput 
              onComplete={handleCodeComplete}
              length={6}
              className="my-6"
            />
          </div>
          
          {isCodeComplete && (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                已输入的验证码: <span className="font-mono font-medium">{code}</span>
              </div>
              <Button 
                className="w-full sm:w-auto mx-auto"
                onClick={handleVerify}
                disabled={isVerified !== null}
              >
                验证验证码
              </Button>
            </div>
          )}
          
          {isVerified !== null && (
            <Alert className={isVerified ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900'}>
              <AlertDescription className={isVerified ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {isVerified ? '验证码验证成功！' : '验证码验证失败，请重新输入。'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        {isVerified !== null && (
          <CardFooter className="justify-center pt-0 pb-6">
            <Button 
              variant="secondary" 
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              重新输入
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
