'use client';

import { useState } from 'react';
import {
  Bell,
  Heart,
  Package,
  Truck,
  AlertTriangle,
  Settings,
  Check,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/utils';
import type { NotificationType } from '@/lib/types';

const notifications = [
  {
    id: '1',
    type: 'donation' as NotificationType,
    title: 'Donation Delivered',
    message: 'Your donation "Fried Rice & Noodles" was delivered to Hope Foundation',
    read: false,
    createdAt: '2026-09-30T16:15:00Z',
    link: '/donor/donations/1',
  },
  {
    id: '2',
    type: 'request' as NotificationType,
    title: 'New Match Found',
    message: 'Your donation "Fresh Vegetables" was matched with Community Kitchen',
    read: false,
    createdAt: '2026-09-30T11:00:00Z',
    link: '/donor/donations/2',
  },
  {
    id: '3',
    type: 'delivery' as NotificationType,
    title: 'Volunteer Assigned',
    message: 'Sarah Johnson has been assigned to pick up your donation',
    read: false,
    createdAt: '2026-09-30T10:30:00Z',
  },
  {
    id: '4',
    type: 'system' as NotificationType,
    title: 'Weekly Summary',
    message: 'You donated 120 meals this week. Great job!',
    read: true,
    createdAt: '2026-09-29T09:00:00Z',
  },
  {
    id: '5',
    type: 'donation' as NotificationType,
    title: 'Donation Picked Up',
    message: 'Your donation "Bread & Pastries" was picked up by Mike Chen',
    read: true,
    createdAt: '2026-09-30T15:30:00Z',
  },
  {
    id: '6',
    type: 'emergency' as NotificationType,
    title: 'Emergency Request Nearby',
    message: 'Hope Foundation has an emergency request 0.8 km from you',
    read: true,
    createdAt: '2026-09-30T14:00:00Z',
  },
  {
    id: '7',
    type: 'system' as NotificationType,
    title: 'Account Verified',
    message: 'Your account has been verified. You now have access to all features.',
    read: true,
    createdAt: '2026-09-28T10:00:00Z',
  },
];

const typeIcons: Record<NotificationType, React.ElementType> = {
  donation: Heart,
  request: Package,
  delivery: Truck,
  system: Settings,
  emergency: AlertTriangle,
};

const typeColors: Record<NotificationType, string> = {
  donation: 'bg-green-100 text-green-600',
  request: 'bg-blue-100 text-blue-600',
  delivery: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
  emergency: 'bg-red-100 text-red-600',
};

const categories = [
  { id: 'all', label: 'All' },
  { id: 'donation', label: 'Donations' },
  { id: 'request', label: 'Requests' },
  { id: 'delivery', label: 'Deliveries' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'system', label: 'System' },
];

export default function NotificationsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [notifs, setNotifs] = useState(notifications);

  const filteredNotifications = notifs.filter((n) => {
    if (activeCategory === 'all') return true;
    return n.type === activeCategory;
  });

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <p className="text-text-secondary mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="btn-secondary text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-thin">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeCategory === cat.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {filteredNotifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <div
                key={notification.id}
                className={cn(
                  'p-4 hover:bg-gray-50/50 cursor-pointer transition-colors',
                  !notification.read && 'bg-primary-light/20'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      typeColors[notification.type]
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          'text-sm',
                          notification.read
                            ? 'font-medium text-text'
                            : 'font-semibold text-text'
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-text-secondary/60 mt-1">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
