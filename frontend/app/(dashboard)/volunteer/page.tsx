'use client';

import Link from 'next/link';
import {
  Truck,
  Package,
  Clock,
  Star,
  MapPin,
  ChevronRight,
  Navigation,
  CheckCircle,
  Phone,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, timeAgo } from '@/lib/utils';
import type { Delivery } from '@/lib/types';

const kpis = [
  { label: 'Total Deliveries', value: 156, change: '+12 this month', changeType: 'positive' as const, icon: <Truck className="w-5 h-5 text-primary" /> },
  { label: 'Active Deliveries', value: 2, change: '1 in progress', changeType: 'neutral' as const, icon: <Navigation className="w-5 h-5 text-blue-600" /> },
  { label: 'Meals Delivered', value: 4230, change: '+8% from last month', changeType: 'positive' as const, icon: <Package className="w-5 h-5 text-primary" /> },
  { label: 'Rating', value: '4.9', change: 'Based on 142 reviews', changeType: 'positive' as const, icon: <Star className="w-5 h-5 text-warning" /> },
];

const deliveryOpportunities: Delivery[] = [
  {
    id: 'del1',
    donationId: '1',
    volunteerId: 'v1',
    volunteerName: 'You',
    pickupAddress: '123 Main St, Downtown',
    deliveryAddress: '456 Oak Ave, Downtown',
    status: 'assigned',
    assignedAt: '2026-09-30T14:30:00Z',
    estimatedArrival: '2026-09-30T16:00:00Z',
  },
  {
    id: 'del2',
    donationId: '2',
    volunteerId: 'v1',
    volunteerName: 'You',
    pickupAddress: '789 Elm St, Midtown',
    deliveryAddress: '321 Pine St, Uptown',
    status: 'in_transit',
    assignedAt: '2026-09-30T15:00:00Z',
    pickedUpAt: '2026-09-30T15:30:00Z',
    estimatedArrival: '2026-09-30T16:30:00Z',
  },
  {
    id: 'del3',
    donationId: '3',
    volunteerId: 'v1',
    volunteerName: 'You',
    pickupAddress: '555 Cedar St, Westside',
    deliveryAddress: '888 Maple Ave, Eastside',
    status: 'assigned',
    assignedAt: '2026-09-30T16:00:00Z',
    estimatedArrival: '2026-09-30T17:30:00Z',
  },
];

const donationDetails: Record<string, { title: string; donor: string; items: string }> = {
  '1': { title: 'Fried Rice & Noodles', donor: 'Golden Dragon Restaurant', items: '50 plates' },
  '2': { title: 'Fresh Vegetables', donor: 'Green Grocers', items: '20 kg' },
  '3': { title: 'Bread & Pastries', donor: 'Fresh Bakery', items: '30 items' },
};

export default function VolunteerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Welcome, Alex!</h1>
          <p className="text-text-secondary mt-1">
            You&apos;ve completed 156 deliveries and delivered 4,230 meals. Amazing work!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Available
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Delivery Opportunities */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-text">Available Deliveries</h2>
          <span className="text-sm text-text-secondary">
            {deliveryOpportunities.length} nearby
          </span>
        </div>
        <div className="divide-y divide-border">
          {deliveryOpportunities.map((delivery) => {
            const details = donationDetails[delivery.donationId] || {
              title: 'Food Donation',
              donor: 'Unknown',
              items: '',
            };
            return (
              <div
                key={delivery.id}
                className="p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text">{details.title}</h3>
                      <StatusBadge type="delivery" status={delivery.status} size="sm" />
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      {details.donor} &middot; {details.items}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {delivery.pickupAddress}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5" />
                        {delivery.deliveryAddress}
                      </span>
                      {delivery.estimatedArrival && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          ETA {timeAgo(delivery.estimatedArrival)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {delivery.status === 'assigned' && (
                      <Link
                        href={`/volunteer/deliveries/${delivery.id}`}
                        className="btn-primary text-sm"
                      >
                        Accept
                      </Link>
                    )}
                    {delivery.status === 'in_transit' && (
                      <Link
                        href={`/volunteer/tracking/${delivery.id}`}
                        className="btn-secondary text-sm"
                      >
                        Track
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Navigation,
            title: 'Active Delivery',
            description: 'View your current delivery',
            href: '/volunteer/tracking/del2',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            icon: Truck,
            title: 'Delivery History',
            description: 'View past deliveries',
            href: '/history',
            color: 'bg-purple-50 text-purple-600',
          },
          {
            icon: Star,
            title: 'My Rating',
            description: 'View your volunteer rating',
            href: '/profile',
            color: 'bg-yellow-50 text-yellow-600',
          },
        ].map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="card card-hover p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{action.title}</h3>
              <p className="text-sm text-text-secondary">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
