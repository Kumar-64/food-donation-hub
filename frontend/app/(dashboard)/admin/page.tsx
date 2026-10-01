'use client';

import Link from 'next/link';
import {
  Utensils,
  Users,
  Package,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Heart,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, timeAgo } from '@/lib/utils';
import type { Donation, User } from '@/lib/types';

const kpis = [
  { label: 'Total Donations', value: 12543, change: '+12% from last month', changeType: 'positive' as const, icon: <Package className="w-5 h-5 text-primary" /> },
  { label: 'Meals Served', value: 125430, change: '+8% from last month', changeType: 'positive' as const, icon: <Utensils className="w-5 h-5 text-primary" /> },
  { label: 'Active Users', value: 5040, change: '+5% from last month', changeType: 'positive' as const, icon: <Users className="w-5 h-5 text-primary" /> },
  { label: 'Food Rescued', value: '89.2t', change: '+15% from last month', changeType: 'positive' as const, icon: <Heart className="w-5 h-5 text-primary" /> },
];

const recentDonations: Donation[] = [
  {
    id: '1',
    donorId: 'd1',
    donorName: 'Golden Dragon Restaurant',
    donorOrganization: 'Golden Dragon',
    title: 'Fried Rice & Noodles',
    description: 'Assorted fried rice and chow mein noodles',
    foodType: 'Prepared Meals',
    quantity: 50,
    unit: 'plates',
    servings: 50,
    expiryDate: '2026-10-01T18:00:00Z',
    pickupAddress: '123 Main St, Downtown',
    pickupCity: 'New York',
    pickupWindow: '4:00 PM - 6:00 PM',
    status: 'delivered',
    createdAt: '2026-09-30T14:00:00Z',
    updatedAt: '2026-09-30T17:30:00Z',
    matchedNgoName: 'Hope Foundation',
    volunteerName: 'Sarah Johnson',
  },
  {
    id: '2',
    donorId: 'd2',
    donorName: 'Fresh Bakery',
    donorOrganization: 'Fresh Bakery',
    title: 'Bread & Pastries',
    description: 'Assorted bread loaves and pastries',
    foodType: 'Bakery',
    quantity: 30,
    unit: 'items',
    servings: 60,
    expiryDate: '2026-09-30T20:00:00Z',
    pickupAddress: '789 Elm St, Midtown',
    pickupCity: 'New York',
    pickupWindow: '6:00 PM - 8:00 PM',
    status: 'in_transit',
    createdAt: '2026-09-30T15:00:00Z',
    updatedAt: '2026-09-30T16:00:00Z',
    matchedNgoName: 'Shelter House',
    volunteerName: 'Mike Chen',
  },
  {
    id: '3',
    donorId: 'd3',
    donorName: 'Green Grocers',
    donorOrganization: 'Green Grocers',
    title: 'Fresh Vegetables',
    description: 'Mixed vegetables including carrots, broccoli, and peppers',
    foodType: 'Fresh Produce',
    quantity: 20,
    unit: 'kg',
    servings: 80,
    expiryDate: '2026-10-02T12:00:00Z',
    pickupAddress: '321 Pine St, Uptown',
    pickupCity: 'New York',
    pickupWindow: '10:00 AM - 12:00 PM',
    status: 'matched',
    createdAt: '2026-09-30T09:00:00Z',
    updatedAt: '2026-09-30T09:30:00Z',
    matchedNgoName: 'Community Kitchen',
  },
];

const systemAlerts = [
  {
    id: 'a1',
    type: 'warning' as const,
    title: 'High demand in Downtown area',
    message: '3 NGOs have emergency requests within 2 km radius',
    time: '10 minutes ago',
  },
  {
    id: 'a2',
    type: 'info' as const,
    title: 'New volunteer registrations',
    message: '15 new volunteers registered today',
    time: '1 hour ago',
  },
  {
    id: 'a3',
    type: 'success' as const,
    title: 'Weekly milestone reached',
    message: 'Over 2,000 meals served this week',
    time: '2 hours ago',
  },
];

const alertColors = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
};

const alertIcons = {
  warning: AlertTriangle,
  info: Clock,
  success: CheckCircle,
  danger: AlertTriangle,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Overview of FoodBridge platform activity and metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Donations */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-text">Recent Donations</h2>
            <Link
              href="/admin/donations"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text">{donation.title}</h3>
                      <StatusBadge type="donation" status={donation.status} size="sm" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {donation.donorName} &rarr; {donation.matchedNgoName || 'Matching...'}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {donation.quantity} {donation.unit} &middot;{' '}
                      {timeAgo(donation.createdAt)}
                    </p>
                  </div>
                  <Link
                    href="/admin/donations"
                    className="text-sm text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-text">System Alerts</h2>
          </div>
          <div className="divide-y divide-border">
            {systemAlerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div key={alert.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${alertColors[alert.type]}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{alert.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {alert.message}
                      </p>
                      <p className="text-xs text-text-secondary/60 mt-1">
                        {alert.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Manage Users', href: '/admin/users', color: 'bg-blue-50 text-blue-600' },
          { icon: Package, label: 'Manage Donations', href: '/admin/donations', color: 'bg-green-50 text-green-600' },
          { icon: AlertTriangle, label: 'Emergency Requests', href: '/admin/emergency', color: 'bg-red-50 text-red-600' },
          { icon: TrendingUp, label: 'View Impact', href: '/admin/impact', color: 'bg-purple-50 text-purple-600' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="card card-hover p-5 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-text">{action.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
