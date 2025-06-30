import { useLocation } from '@tanstack/react-router'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = {
  default: {
    quote:
      'linkify has transformed how I engage on LinkedIn. The AI-generated comments are thoughtful and have significantly increased my network growth.',
    author: 'Michael Chen',
    title: 'Marketing Director',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
  extension: {
    quote:
      'The Chrome extension is so easy to use! It took me less than a minute to set up and start automating my LinkedIn engagement.',
    author: 'Sarah Johnson',
    title: 'Startup Founder',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
  linkedin: {
    quote:
      "The LinkedIn integration is seamless. I was worried about security, but linkify's authentication process is top-notch and secure.",
    author: 'David Rodriguez',
    title: 'CTO',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
  'post-settings': {
    quote:
      'Being able to target specific keywords and author titles has helped me connect with the right people in my industry. Game changer!',
    author: 'Emily Wong',
    title: 'Business Development Manager',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
  'comment-settings': {
    quote:
      "The comment customization options are incredible. My automated comments sound exactly like me - my connections can't tell the difference!",
    author: 'Alex Thompson',
    title: 'Content Strategist',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
  demo: {
    quote:
      'Seeing the demo comments before committing was what sold me. The quality of AI-generated comments is impressive and has saved me hours each week.',
    author: 'Priya Patel',
    title: 'Growth Marketing Lead',
    avatar: '/placeholder.svg?height=64&width=64',
    rating: 5,
  },
}

export function OnboardingTestimonials() {
  const location = useLocation()
  const pathname = location.pathname

  // Determine which testimonial to show based on the current path
  const currentStep = pathname.split('/').pop() || 'default'
  const testimonial =
    TESTIMONIALS[currentStep as keyof typeof TESTIMONIALS] ||
    TESTIMONIALS.default

  return (
    <div className='bg-muted/30 hidden border-l p-8 lg:block lg:w-1/3'>
      <div className='sticky top-24 space-y-8'>
        <div>
          <h3 className='mb-2 text-xl font-bold'>What our users say</h3>
          <p className='text-muted-foreground text-sm'>
            Join thousands of professionals who are saving time and growing
            their network with linkify
          </p>
        </div>

        <div className='bg-card relative rounded-xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
          <div className='from-primary absolute top-0 left-0 h-1 w-full rounded-t-xl bg-gradient-to-r to-blue-400' />
          <Quote className='text-primary/20 mb-2 h-8 w-8' />
          <div className='mb-3 flex'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <blockquote className='mb-6 text-sm italic'>
            "{testimonial.quote}"
          </blockquote>
          <div className='flex items-center'>
            <div className='relative mr-3 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800'>
              <span className='font-medium text-blue-700 dark:text-blue-300'>
                {testimonial.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div>
              <p className='text-sm font-medium'>{testimonial.author}</p>
              <p className='text-muted-foreground text-xs'>
                {testimonial.title}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-800/50 dark:bg-blue-900/10'>
          <div className='mb-2 flex items-center gap-2'>
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10'>
              <span className='text-xs font-bold text-blue-500'>i</span>
            </div>
            <h4 className='font-medium'>Pro Tip</h4>
          </div>
          <p className='text-muted-foreground text-sm'>
            {currentStep === 'extension' &&
              'Install the extension once and use it across all your LinkedIn accounts.'}
            {currentStep === 'linkedin' &&
              "Ensure you're logged into LinkedIn before connecting for a smoother experience."}
            {currentStep === 'post-settings' &&
              'Target industry-specific keywords to find the most relevant posts for engagement.'}
            {currentStep === 'comment-settings' &&
              'Adding your professional background helps generate more personalized comments.'}
            {currentStep === 'demo' &&
              'You can always adjust your settings later from your dashboard if needed.'}
            {![
              'extension',
              'linkedin',
              'post-settings',
              'comment-settings',
              'demo',
            ].includes(currentStep) &&
              'Complete all onboarding steps for the best experience with linkify.'}
          </p>
        </div>
      </div>
    </div>
  )
}
