'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationBellProps {
  count?: number;
  className?: string;
}

export default function NotificationBell({
  count = 0,
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger text-white text-xs font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-card-lg border border-border shadow-card-hover z-50 animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text">Notifications</h3>
                <Link
                  href="/notifications"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {count === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-text">
                        New donation match
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        A nearby NGO matched your donation
                      </p>
                      <p className="text-xs text-text-secondary/60 mt-1">
                        {i}h ago
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
