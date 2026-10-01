import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FoodBridge - Turn Surplus Food Into Someone\'s Next Meal',
    template: '%s | FoodBridge',
  },
  description:
    'FoodBridge connects restaurants, event organizers, and NGOs to reduce food waste and fight hunger. Donate surplus food, request food for those in need, and track every delivery.',
  keywords: [
    'food donation',
    'food rescue',
    'reduce food waste',
    'NGO',
    'volunteer',
    'food bank',
    'surplus food',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
