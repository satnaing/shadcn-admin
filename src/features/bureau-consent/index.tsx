import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { PurgeConsentForm } from './components/purge-consent-form';
import { ResponseDisplay } from './components/response-display';

interface PurgeResponse {
  status: number;
  message: string;
  success: boolean;
}

export default function BureauConsent() {
  const [response, setResponse] = useState<PurgeResponse | null>(null);

  const handleResponse = (newResponse: PurgeResponse | null) => {
    setResponse(newResponse);
  };

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Purge Bureau Consent</h2>
            <p className="text-muted-foreground">
              Enter Customer ID to purge bureau consent.
            </p>
          </div>
        </div>

        <PurgeConsentForm onResponse={handleResponse} />
        <ResponseDisplay response={response} />
      </Main>
    </>
  );
} 