import { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStatePropsWithCta = {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  ctaText: string;
  ctaIcon?: LucideIcon;
  onCtaClick: () => void;
  className?: string;
};

type EmptyStatePropsWithCustomCta = {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  Cta: ReactNode;
  className?: string;
};

type EmptyStatePropsNoCta = {
  Icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

type EmptyStateProps = EmptyStatePropsWithCta | EmptyStatePropsWithCustomCta | EmptyStatePropsNoCta;

export default function EmptyState(props: EmptyStateProps) {
  const { Icon, title, description, className } = props;

  let Cta: ReactNode = null;
  if ('Cta' in props) {
    Cta = props.Cta;
  } else if ('ctaText' in props) {
    const CtaIcon = props.ctaIcon;
    Cta = (
      <Button
        onClick={() => props.onCtaClick()}
      >
        {CtaIcon && <CtaIcon className="mr-2 h-4 w-4" />}
        {props.ctaText}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6",
        "border-2 border-dashed rounded-lg",
        "border-muted bg-muted/10",
        className
      )}
    >
      {Icon && <Icon className="h-12 w-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-center mb-4">{description}</p>
      )}
      {Cta}
    </div>
  );
}
