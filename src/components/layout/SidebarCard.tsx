'use client'

import logoWhite from '@/assets/images/logoWhite.png'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserSubscriptionStatus } from '@/features/auth/interface/user.interface'
import { useGetUserQuery } from '@/features/auth/query/user.query'
// import { Link } from '@tanstack/react-router'

export default function SidebarDocs() {
  const { data: user } = useGetUserQuery()
  const isTrialExpired = user?.status === UserSubscriptionStatus.TRIAL_EXPIRED

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-[30px] px-4 py-6 text-white',
        'bg-gradient-to-br from-[#868CFF] to-[#4318FF]'
      )}
    >
      <div
        className="absolute left-1/2 top-[-47px] flex h-[94px] w-[94px] -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[#868CFF] to-[#4318FF]"
      >
       <img src={logoWhite} alt="Logo" width={40} height={40} />
      </div>

      <div className="pt-[55px] text-center">
        <h3 className="text-lg font-bold">
          {isTrialExpired ? 'Trial Expired' : 'Talk to Founder'}
        </h3>
        <p className="mt-2 text-sm text-white/80">
          {isTrialExpired
            ? 'Your trial is over, but your journey doesn’t stop here!'
            : 'If you have any questions or need help setting up, feel free to contact.'}
        </p>
      </div>

      {/* <Link to={isTrialExpired ? '/settings' : 'https://cal.com/mithun-kumar/commentify-support'}> */}

      {/* <Link to='https://cal.com/mithun-kumar/commentify-support'> */}

  <Button
    variant="ghost"
    className="w-[185px] text-white hover:bg-white/20"
  >
    {isTrialExpired ? 'Upgrade Now' : 'Book a Call'}
  </Button>
{/* </Link> */}
    </div>
  )
}
