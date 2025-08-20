import { headers } from 'next/headers';
import Image from 'next/image';
import { getAppConfig } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: AppLayoutProps) {
  const hdrs = await headers();
  const { companyName, logo, logoDark } = await getAppConfig(hdrs);

  return (
    <>
      <header className="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between p-6 md:flex">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://livekit.io"
          className="scale-100 transition-transform duration-300 hover:scale-110"
        >
          <Image
            src={logo}
            alt={`${companyName} Logo`}
            width={24}
            height={24}
            className="block dark:hidden"
          />
          <Image
            src={logoDark ?? logo}
            alt={`${companyName} Logo`}
            width={24}
            height={24}
            className="hidden dark:block"
          />
        </a>
        <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
          Built with{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents"
            className="underline underline-offset-4"
          >
            LiveKit Agents
          </a>
        </span>
      </header>
      {children}
    </>
  );
}
