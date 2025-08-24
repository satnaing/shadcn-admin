import type { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';

interface PageProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  backPath?: string;
  headerFixed?: boolean;
  mainFixed?: boolean;
  mainFluid?: boolean;
  showSearch?: boolean;
  showThemeSwitch?: boolean;
  showConfigDrawer?: boolean;
  showProfileDropdown?: boolean;
}

export function Page({
  children,
  title,
  description,
  actions,
  backPath,
  headerFixed = true,
  mainFixed = false,
  mainFluid = false,
  showSearch = true,
  showThemeSwitch = true,
  showConfigDrawer = false,
  showProfileDropdown = true,
}: PageProps) {
  const navigate = useNavigate();

  return (
    <>
      <Header fixed={headerFixed}>
        {showSearch && <Search />}
        <div className='ms-auto flex items-center space-x-4'>
          {showThemeSwitch && <ThemeSwitch />}
          {showConfigDrawer && <ConfigDrawer />}
          {showProfileDropdown && <ProfileDropdown />}
        </div>
      </Header>

      <Main fixed={mainFixed} fluid={mainFluid}>
        {(title || description || actions) && (
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-start gap-2'>
              {backPath && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 -ml-2"
                  onClick={() => navigate({ to: backPath })}
                >
                  <ChevronLeft />
                </Button>
              )}
              <div className="space-y-1">
                {title && <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>}
                {description && (
                  <p className='text-muted-foreground'>{description}</p>
                )}
              </div>
            </div>
            {actions && (
              <div className='flex items-center space-x-2'>
                {actions}
              </div>
            )}
          </div>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </Main>
    </>
  );
}
