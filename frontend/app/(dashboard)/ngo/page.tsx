'use client';

import Link from 'next/link';
import {
  Heart,
  Package,
  Truck,
  Users,
  Plus,
  MapPin,
  Clock,
  ChevronRight,
  Utensils,
  AlertTriangle,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import MapPlaceholder from '@/components/MapPlaceholder';
import { formatDate, timeAgo } from '@/lib/utils';
import type { Donation, FoodRequest } from '@/lib/types';

const kpis = [
  { label: 'Total Requests', value: 23, change: '+5 this month', changeType: 'positive' as const, icon: <Heart className="w-5 h-5 text-primary" /> },
  { label: 'Active Requests', value: 4, change: '2 expiring soon', changeType: 'neutral' as const, icon: <Clock className="w-5 h-5 text-warning" /> },
  { label: 'Meals Received', value: 1250, change: '+18% from last month', changeType: 'positive' as const, icon: <Utensils className="w-5 h-5 text-primary" /> },
  { label: 'People Served', value: 890, change: '+12% from last month', changeType: 'positive' as const, icon: <Users className="w-5 h-5 text-primary" /> },
];

const nearbyDonations: Donation[] = [
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
    status: 'pending',
    createdAt: '2026-09-30T14:00:00Z',
    updatedAt: '2026-09-30T14:00:00Z',
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
    status: 'pending',
    createdAt: '2026-09-30T15:00:00Z',
    updatedAt: '2026-09-30T15:00:00Z',
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
    status: 'pending',
    createdAt: '2026-09-30T09:00:00Z',
    updatedAt: '2026-09-30T09:00:00Z',
  },
];

const myRequests: FoodRequest[] = [
  {
    id: 'r1',
    ngoId: 'ngo1',
    ngoName: 'Hope Foundation',
    title: 'Need meals for 50 children',
    description: 'Daily meal program for underprivileged children',
    foodType: 'Prepared Meals',
    quantityNeeded: 50,
    unit: 'servings',
    servingsNeeded: 50,
    urgency: 'high',
    neededByDate: '2026-09-30T18:00:00Z',
    deliveryAddress: '456 Oak Ave, Downtown',
    deliveryCity: 'New York',
    status: 'open',
    createdAt: '2026-09-30T10:00:00Z',
  },
  {
    id: 'r2',
    ngoId: 'ngo1',
    ngoName: 'Hope Foundation',
    title: 'Vegetables needed for soup kitchen',
    description: 'Weekly soup kitchen serving 200+ people',
    foodType: 'Fresh Produce',
    quantityNeeded: 30,
    unit: 'kg',
    servingsNeeded: 120,
    urgency: 'medium',
    neededByDate: '2026-10-01T10:00:00Z',
    deliveryAddress: '456 Oak Ave, Downtown',
    deliveryCity: 'New York',
    status: 'matched',
    createdAt: '2026-09-29T08:00:00Z',
    matchedDonationId: '2',
  },
];

export default function NgoDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Welcome, Hope Foundation!
          </h1>
          <p className="text-text-secondary mt-1">
            You&apos;ve received 1,250 meals and served 890 people. Thank you for your work!
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/ngo/emergency" className="btn-danger text-sm">
            <AlertTriangle className="w-4 h-4" />
            Emergency
          </Link>
          <Link href="/ngo/request" className="btn-primary text-sm">
            <Plus className="w-4 h-4" />
            Request Food
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Nearby Donations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-text">Nearby Donations</h2>
              <span className="text-sm text-text-secondary">
                {nearbyDonations.length} available
              </span>
            </div>
            <div className="divide-y divide-border">
              {nearbyDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text">{donation.title}</h3>
                        <StatusBadge type="donation" status={donation.status} size="sm" />
                      </div>
                      <p className="text-sm text-text-secondary mb-2">
                        {donation.donorName} &middot; {donation.foodType}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {donation.quantity} {donation.unit}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {donation.pickupCity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {donation.pickupWindow}
                        </span>
                      </div>
                    </div>
                    <button className="btn-primary text-sm whitespace-nowrap">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Requests */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-text">My Requests</h2>
              <Link
                href="/ngo/request"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                New request
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-text">{request.title}</h3>
                        <StatusBadge type="request" status={request.status} size="sm" />
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
                      <p className="text-sm text-text-secondary">
                        {request.quantityNeeded} {request.unit} needed by{' '}
                        {formatDate(request.neededByDate)}
                      </p>
                    </div>
                    {request.status === 'open' && (
                      <button className="btn-secondary text-sm">Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Sidebar */}
        <div className="space-y-6">
          <div className="card p-4">
            <h2 className="font-semibold text-text mb-4">Donation Map</h2>
            <MapPlaceholder
              title="Nearby Donations"
              address="5 donations within 5 km"
              height="h-64"
            />
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">This Week</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Donations received</span>
                <span className="font-semibold text-text">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Meals served</span>
                <span className="font-semibold text-text">340</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active volunteers</span>
                <span className="font-semibold text-text">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
