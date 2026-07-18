import './globals.css';

export const metadata = {
  title: 'Who Wants to Be a Crypto Millionaire?',
  description: 'Play and earn on Base & Arc Network',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a' }}>
        {children}
      </body>
    </html>
  );
}
