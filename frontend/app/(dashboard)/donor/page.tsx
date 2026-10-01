'use client';

import Link from 'next/link';
import {
  Utensils,
  Heart,
  Package,
  Users,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, timeAgo } from '@/lib/utils';
import type { Donation } from '@/lib/types';

const kpis = [
  { label: 'Total Donations', value: 47, change: '+12% from last month', changeType: 'positive' as const, icon: <Package className="w-5 h-5 text-primary" /> },
  { label: 'Meals Provided', value: 2340, change: '+8% from last month', changeType: 'positive' as const, icon: <Utensils className="w-5 h-5 text-primary" /> },
  { label: 'Active Donations', value: 3, change: '2 expiring soon', changeType: 'neutral' as const, icon: <Clock className="w-5 h-5 text-warning" /> },
  { label: 'People Helped', value: 1890, change: '+15% from last month', changeType: 'positive' as const, icon: <Users className="w-5 h-5 text-primary" /> },
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
    donorId: 'd1',
    donorName: 'Golden Dragon Restaurant',
    donorOrganization: 'Golden Dragon',
    title: 'Fresh Vegetables',
    description: 'Mixed vegetables including carrots, broccoli, and peppers',
    foodType: 'Fresh Produce',
    quantity: 20,
    unit: 'kg',
    servings: 80,
    expiryDate: '2026-10-02T12:00:00Z',
    pickupAddress: '123 Main St, Downtown',
    pickupCity: 'New York',
    pickupWindow: '10:00 AM - 12:00 PM',
    status: 'in_transit',
    createdAt: '2026-09-30T09:00:00Z',
    updatedAt: '2026-09-30T11:00:00Z',
    matchedNgoName: 'Community Kitchen',
    volunteerName: 'Mike Chen',
  },
  {
    id: '3',
    donorId: 'd1',
    donorName: 'Golden Dragon Restaurant',
    donorOrganization: 'Golden Dragon',
    title: 'Bread & Pastries',
    description: 'Assorted bread loaves and pastries from today',
    foodType: 'Bakery',
    quantity: 30,
    unit: 'items',
    servings: 60,
    expiryDate: '2026-09-30T20:00:00Z',
    pickupAddress: '123 Main St, Downtown',
    pickupCity: 'New York',
    pickupWindow: '6:00 PM - 8:00 PM',
    status: 'matched',
    createdAt: '2026-09-30T15:00:00Z',
    updatedAt: '2026-09-30T15:30:00Z',
    matchedNgoName: 'Shelter House',
  },
  {
    id: '4',
    donorId: 'd1',
    donorName: 'Golden Dragon Restaurant',
    donorOrganization: 'Golden Dragon',
    title: 'Soup & Curries',
    description: 'Freshly made vegetable soup and chicken curry',
    foodType: 'Prepared Meals',
    quantity: 40,
    unit: 'containers',
    servings: 40,
    expiryDate: '2026-09-30T22:00:00Z',
    pickupAddress: '123 Main St, Downtown',
    pickupCity: 'New York',
    pickupWindow: '7:00 PM - 9:00 PM',
    status: 'pending',
    createdAt: '2026-09-30T16:00:00Z',
    updatedAt: '2026-09-30T16:00:00Z',
  },
];

const nearbyRequests = [
  {
    id: 'r1',
    ngoName: 'Hope Foundation',
    title: 'Need meals for 50 children',
    distance: '0.8 km',
    urgency: 'high' as const,
    neededBy: 'Today 6:00 PM',
  },
  {
    id: 'r2',
    ngoName: 'Community Kitchen',
    title: 'Vegetables needed for soup kitchen',
    distance: '1.2 km',
    urgency: 'medium' as const,
    neededBy: 'Tomorrow 10:00 AM',
  },
  {
    id: 'r3',
    ngoName: 'Shelter House',
    title: 'Bread and bakery items needed',
    distance: '1.5 km',
    urgency: 'low' as const,
    neededBy: 'Tomorrow 2:00 PM',
  },
];

export default function DonorDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Welcome back, Golden Dragon!
          </h1>
          <p className="text-text-secondary mt-1">
            You&apos;ve made 47 donations and helped 1,890 people. Keep it up!
          </p>
        </div>
        <Link href="/donor/donate" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Donation
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Recent Donations & Nearby Requests */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Donations Table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold text-text">Recent Donations</h2>
            <Link
              href="/donor"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                    Food Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                    Recipient
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentDonations.map((donation) => (
                  <tr
                    key={donation.id}
                    className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-text text-sm">
                        {donation.title}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {donation.quantity} {donation.unit} &middot; {donation.foodType}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="donation" status={donation.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text">
                      {donation.matchedNgoName || (
                        <span className="text-text-secondary">Matching...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nearby Requests */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-text">Nearby Requests</h2>
            <p className="text-xs text-text-secondary mt-1">
              NGOs near you need food
            </p>
          </div>
          <div className="divide-y divide-border">
            {nearbyRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-text">
                      {request.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {request.ngoName}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      request.urgency === 'high'
                        ? 'bg-red-100 text-red-700'
                        : request.urgency === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {request.urgency}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {request.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {request.neededBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <Link
              href="/ngo/request"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all requests
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: Plus,
            title: 'Donate Food',
            description: 'List surplus food for donation',
            href: '/donor/donate',
            color: 'bg-primary-light text-primary',
          },
          {
            icon: Package,
            title: 'Track Donations',
            description: 'View status of your donations',
            href: '/donor',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            icon: TrendingUp,
            title: 'View Impact',
            description: 'See your contribution metrics',
            href: '/admin/impact',
            color: 'bg-purple-50 text-purple-600',
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
