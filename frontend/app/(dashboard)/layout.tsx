'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Utensils,
  Home,
  Heart,
  Truck,
  Users,
  Shield,
  BarChart3,
  Settings,
  Bell,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Package,
  AlertTriangle,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getProfile, signOut, getDashboardPath } from '@/lib/utils';
import type { User as UserType } from '@/lib/types';
import NotificationBell from '@/components/NotificationBell';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/donor', icon: Home },
  { label: 'Donate Food', href: '/donor/donate', icon: Heart },
  { label: 'My Donations', href: '/donor', icon: Package },
  { label: 'History', href: '/history', icon: History },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

const ngoNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/ngo', icon: Home },
  { label: 'Request Food', href: '/ngo/request', icon: Heart },
  { label: 'Emergency', href: '/ngo/emergency', icon: AlertTriangle },
  { label: 'History', href: '/history', icon: History },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

const volunteerNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/volunteer', icon: Home },
  { label: 'Deliveries', href: '/volunteer', icon: Truck },
  { label: 'History', href: '/history', icon: History },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Donations', href: '/admin/donations', icon: Package },
  { label: 'Emergency', href: '/admin/emergency', icon: AlertTriangle },
  { label: 'Impact', href: '/admin/impact', icon: BarChart3 },
  { label: 'History', href: '/history', icon: History },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
];

const bottomNavItems = [
  { label: 'Home', href: '/donor', icon: Home },
  { label: 'Requests', href: '/ngo/request', icon: Heart },
  { label: 'Donate', href: '/donor/donate', icon: Plus },
  { label: 'Tracking', href: '/volunteer', icon: Truck },
  { label: 'Profile', href: '/profile', icon: User },
];

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function getNavItems(pathname: string): NavItem[] {
  if (pathname.startsWith('/admin')) return adminNavItems;
  if (pathname.startsWith('/ngo')) return ngoNavItems;
  if (pathname.startsWith('/volunteer')) return volunteerNavItems;
  return navItems;
}

function getDashboardHome(pathname: string): string {
  if (pathname.startsWith('/admin')) return '/admin';
  if (pathname.startsWith('/ngo')) return '/ngo';
  if (pathname.startsWith('/volunteer')) return '/volunteer';
  return '/donor';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navItems = getNavItems(pathname);
  const dashboardHome = getDashboardHome(pathname);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const profile = await getProfile();
      setUser(profile);
      setIsLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('supabase_session');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-surface border-r border-border shadow-sidebar z-30">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-text">FoodBridge</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive =
              item.href === dashboardHome
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-text transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-xl animate-slide-in-right">
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-text">FoodBridge</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-text-secondary hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === dashboardHome
                    ? pathname === item.href
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-light text-primary-dark'
                        : 'text-text-secondary hover:bg-gray-100 hover:text-text'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-text transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-text-secondary hover:text-text hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-text hidden sm:block">
                {navItems.find((item) => pathname.startsWith(item.href))?.label || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <NotificationBell count={3} />
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-4 border-l border-border">
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-dark">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-text">{user?.name || 'User'}</p>
                  <p className="text-xs text-text-secondary capitalize">{user?.role || 'donor'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const isDonate = item.label === 'Donate';

            if (isDonate) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -mt-6 shadow-lg">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-primary mt-1">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
