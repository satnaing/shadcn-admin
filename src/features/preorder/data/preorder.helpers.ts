import { ORDER_STEPS, type OrderStep, type StepStatus } from './preorder.type'

type Steps = Record<OrderStep, StepStatus>

/** Latest workflow step that has started (status other than "none"); `null` for an untouched order. */
export function currentStep(
  steps: Steps
): { step: OrderStep; status: StepStatus } | null {
  for (const step of [...ORDER_STEPS].reverse())
    if (steps[step] !== 'none') return { step, status: steps[step] }
  return null
}

/** Each step needs the previous one accepted (AEC: "complete the previous step first"). */
export function canSetStep(steps: Steps, step: OrderStep): boolean {
  const prev = ORDER_STEPS[ORDER_STEPS.indexOf(step) - 1]
  return !prev || steps[prev] === 'accepted'
}
