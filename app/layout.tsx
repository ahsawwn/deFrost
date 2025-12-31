import type { Metadata } from 'next';
import './../styles/globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'DeFrost Clothing - Futuristic Fashion',
  description: 'Futuristic fashion for the next generation (16-25). Redefine your style with cutting-edge designs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

