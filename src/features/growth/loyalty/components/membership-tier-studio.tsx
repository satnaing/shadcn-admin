import { Plus, Trash2, Award, Zap, Shield, ChevronRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MultiLangInput } from '@/components/custom/multi-lang-input'
import { type MembershipTier } from '../../data/loyalty-schema'

interface MembershipTierStudioProps {
  tiers: MembershipTier[]
  onChange: (tiers: MembershipTier[]) => void
}

export function MembershipTierStudio({
  tiers,
  onChange,
}: MembershipTierStudioProps) {
  const handleAddTier = () => {
    const newTier: MembershipTier = {
      id: uuidv4(),
      name: { en: 'New Tier', km: 'កម្រិតថ្មី' },
      minSpendRequirement: 0,
      discountPercentage: 0,
      priority: tiers.length,
      status: 'DRAFT',
    }
    onChange([...tiers, newTier])
  }

  const handleUpdateTier = (
    id: string | undefined,
    updates: Partial<MembershipTier>
  ) => {
    if (!id) return
    const updatedTiers = tiers.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )
    onChange(updatedTiers)
  }

  const handleDeleteTier = (id: string | undefined) => {
    if (!id) return
    onChange(tiers.filter((t) => t.id !== id))
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-end justify-between border-b pb-4'>
        <div>
          <h3 className='text-2xl font-bold tracking-tight'>
            Membership Ladder
          </h3>
          <p className='text-muted-foreground'>
            Configure loyalty milestones and automated rewards.
          </p>
        </div>
        <Button
          onClick={handleAddTier}
          className='rounded-full bg-primary px-6 shadow-sm hover:bg-primary/90'
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Tier
        </Button>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          display: none !important;
          pointer-events: none;
          position: absolute;
          right: 0;
        }
      `,
        }}
      />

      <div className='relative flex flex-col space-y-6 before:absolute before:top-8 before:bottom-8 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-primary/20 before:via-primary/5 before:to-transparent'>
        {tiers.map((tier, index) => (
          <div key={tier.id} className='group relative pl-12'>
            {/* Timeline Orb */}
            <div
              className={cn(
                'absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-4 border-background shadow-sm transition-all group-hover:scale-110',
                tier.status === 'ACTIVE'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index === 0 ? (
                <Zap className='p-1.5' />
              ) : index === tiers.length - 1 ? (
                <Award className='p-1.5' />
              ) : (
                <Shield className='p-1.5' />
              )}
            </div>

            <Card
              className={cn(
                'border-none bg-card/50 shadow-md ring-1 ring-border backdrop-blur-sm transition-all hover:shadow-lg',
                tier.status === 'DRAFT' && 'border-l-4 border-l-yellow-400'
              )}
            >
              <CardContent className='p-6'>
                <div className='mb-6 flex flex-wrap items-start justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xs font-bold tracking-wider text-muted-foreground uppercase'>
                          Rank #{index + 1}
                        </span>
                        <Badge
                          variant={
                            tier.status === 'ACTIVE' ? 'default' : 'outline'
                          }
                          className='h-4 text-[10px] uppercase'
                        >
                          {tier.status}
                        </Badge>
                      </div>
                      <h4 className='flex items-center gap-2 text-lg font-semibold'>
                        {tier.name.en || 'Untitled Tier'}
                        <ChevronRight className='h-4 w-4 text-muted-foreground/50' />
                      </h4>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteTier(tier.id)}
                    className='text-muted-foreground hover:bg-destructive/5 hover:text-destructive'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <div className='grid gap-8 lg:grid-cols-12'>
                  {/* Name Fields - Reusing MultiLangInput */}
                  <div className='lg:col-span-6'>
                    <MultiLangInput
                      label='Tier Name'
                      value={tier.name as Record<string, string>}
                      onChange={(val) =>
                        handleUpdateTier(tier.id, { name: val })
                      }
                      placeholder='e.g. Gold Tier'
                      className='bg-transparent'
                    />
                  </div>

                  {/* The Gate */}
                  <div className='flex flex-col lg:col-span-3'>
                    <div className='mb-2 flex h-7 items-center'>
                      <label className='ml-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                        Min. Spend
                      </label>
                    </div>
                    <div className='group/input relative'>
                      <Input
                        type='number'
                        autoComplete='new-password'
                        {...{ 'data-lpignore': 'true' }}
                        name={`minSpendRequirement-${tier.id}`}
                        value={tier.minSpendRequirement}
                        min={0}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleUpdateTier(tier.id, {
                            minSpendRequirement:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        className='h-9 bg-background/50 pr-10 transition-colors focus:bg-background'
                      />
                      <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                        <span className='text-[10px] font-bold text-muted-foreground transition-colors group-focus-within/input:text-primary'>
                          $
                        </span>
                      </div>
                    </div>
                    <p className='mt-2 ml-1 text-[10px] leading-tight text-muted-foreground/70'>
                      Lifetime spend required to reach this tier.
                    </p>
                  </div>

                  {/* The Reward */}
                  <div className='flex flex-col lg:col-span-3'>
                    <div className='mb-2 flex h-7 items-center'>
                      <label className='ml-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase'>
                        Global Reward
                      </label>
                    </div>
                    <div className='group/input relative'>
                      <Input
                        type='number'
                        autoComplete='new-password'
                        {...{ 'data-lpignore': 'true' }}
                        name={`discountPercentage-${tier.id}`}
                        min={0}
                        max={100}
                        value={tier.discountPercentage}
                        onWheel={(e) => e.currentTarget.blur()}
                        onChange={(e) =>
                          handleUpdateTier(tier.id, {
                            discountPercentage: parseFloat(e.target.value) || 0,
                          })
                        }
                        className='h-9 bg-background/50 pr-12 transition-colors focus:bg-background'
                      />
                      <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                        <span className='text-[10px] font-bold text-muted-foreground transition-colors group-focus-within/input:text-primary'>
                          % OFF
                        </span>
                      </div>
                    </div>
                    <p className='mt-2 ml-1 text-[10px] leading-tight text-muted-foreground/70'>
                      Automatic discount applied to all store orders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {tiers.length === 0 && (
          <div className='flex animate-in flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted/50 bg-muted/20 p-12 text-center duration-300 fade-in zoom-in'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
              <Award className='h-8 w-8 text-muted-foreground/40' />
            </div>
            <h5 className='text-lg font-semibold'>Build your Ladder</h5>
            <p className='mt-1 max-w-[240px] text-sm text-muted-foreground'>
              Create tiers to reward your most loyal customers with exclusive
              discounts.
            </p>
            <Button
              onClick={handleAddTier}
              variant='outline'
              size='sm'
              className='mt-6 rounded-full px-6 shadow-sm'
            >
              <Plus className='mr-2 h-4 w-4' /> Start Here
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
