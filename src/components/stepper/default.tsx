import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from '@/components/ui/stepper'

const steps = [1, 2, 3, 4]

export default function Component() {
  return (
    <Stepper defaultValue={2} className='space-y-8'>
      <StepperNav>
        {steps.map((step) => (
          <StepperItem key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator>{step}</StepperIndicator>
            </StepperTrigger>
            {steps.length > step && (
              <StepperSeparator className='group-data-[state=completed]/step:bg-primary' />
            )}
          </StepperItem>
        ))}
      </StepperNav>

      <StepperPanel className='text-sm'>
        {steps.map((step) => (
          <StepperContent key={step} value={step} className='flex items-center justify-center'>
            Step {step} content
          </StepperContent>
        ))}
      </StepperPanel>
    </Stepper>
  )
}
