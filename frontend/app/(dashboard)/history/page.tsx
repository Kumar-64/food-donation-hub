'use client';

import { useState } from 'react';
import {
  Search,
  Package,
  Heart,
  Truck,
  ChevronRight,
  Filter,
  Download,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Activity } from '@/lib/types';

const tabs = [
  { id: 'donations', label: 'Donations', icon: Package },
  { id: 'requests', label: 'Requests', icon: Heart },
  { id: 'deliveries', label: 'Deliveries', icon: Truck },
];

const activities: Activity[] = [
  {
    id: '1',
    type: 'donation',
    title: 'Fried Rice & Noodles',
    description: 'Donated to Hope Foundation',
    status: 'delivered',
    date: '2026-09-30T14:00:00Z',
  },
  {
    id: '2',
    type: 'donation',
    title: 'Fresh Vegetables',
    description: 'Donated to Community Kitchen',
    status: 'in_transit',
    date: '2026-09-30T09:00:00Z',
  },
  {
    id: '3',
    type: 'donation',
    title: 'Bread & Pastries',
    description: 'Donated to Shelter House',
    status: 'matched',
    date: '2026-09-30T15:00:00Z',
  },
  {
    id: '4',
    type: 'request',
    title: 'Need meals for 50 children',
    description: 'Requested by Hope Foundation',
    status: 'open',
    date: '2026-09-30T10:00:00Z',
  },
  {
    id: '5',
    type: 'delivery',
    title: 'Delivery #DL-2026-001',
    description: 'Fried Rice & Noodles - Golden Dragon to Hope Foundation',
    status: 'delivered',
    date: '2026-09-30T16:15:00Z',
  },
  {
    id: '6',
    type: 'delivery',
    title: 'Delivery #DL-2026-002',
    description: 'Fresh Vegetables - Green Grocers to Community Kitchen',
    status: 'in_transit',
    date: '2026-09-30T15:30:00Z',
  },
  {
    id: '7',
    type: 'donation',
    title: 'Soup & Curries',
    description: 'Donated to Youth Center',
    status: 'pending',
    date: '2026-09-30T16:00:00Z',
  },
  {
    id: '8',
    type: 'request',
    title: 'Vegetables needed for soup kitchen',
    description: 'Requested by Community Kitchen',
    status: 'matched',
    date: '2026-09-29T08:00:00Z',
  },
];

const statusColors: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  in_transit: 'bg-purple-100 text-purple-700',
  matched: 'bg-blue-100 text-blue-700',
  open: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-yellow-100 text-yellow-700',
  fulfilled: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  delivered: 'Delivered',
  in_transit: 'In Transit',
  matched: 'Matched',
  open: 'Open',
  pending: 'Pending',
  fulfilled: 'Fulfilled',
  cancelled: 'Cancelled',
};

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('donations');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredActivities = activities.filter((activity) => {
    const matchesTab = activity.type === activeTab.slice(0, -1);
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    return matchesTab && matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">History</h1>
          <p className="text-text-secondary mt-1">
            View your past donations, requests, and deliveries
          </p>
        </div>
        <button className="btn-secondary text-sm">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="matched">Matched</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="open">Open</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="card overflow-hidden">
        <div className="divide-y divide-border">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No activities found</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        activity.type === 'donation' && 'bg-green-100 text-green-600',
                        activity.type === 'request' && 'bg-blue-100 text-blue-600',
                        activity.type === 'delivery' && 'bg-purple-100 text-purple-600'
                      )}
                    >
                      {activity.type === 'donation' && <Package className="w-5 h-5" />}
                      {activity.type === 'request' && <Heart className="w-5 h-5" />}
                      {activity.type === 'delivery' && <Truck className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-text">{activity.title}</p>
                      <p className="text-sm text-text-secondary">{activity.description}</p>
                      <p className="text-xs text-text-secondary/60 mt-1">
                        {formatDate(activity.date)} &middot; {timeAgo(activity.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-full',
                        statusColors[activity.status] || 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {statusLabels[activity.status] || activity.status}
                    </span>
                    <button className="p-1.5 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
