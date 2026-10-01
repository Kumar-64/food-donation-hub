'use client';

import { useState } from 'react';
import { Search, Filter, ChevronRight, Package } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDate, timeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Donation, DonationStatus } from '@/lib/types';

const statusFilters: { value: DonationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'matched', label: 'Matched' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const donations: Donation[] = [
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
  {
    id: '4',
    donorId: 'd4',
    donorName: 'City Catering Co.',
    donorOrganization: 'City Catering',
    title: 'Wedding Reception Leftovers',
    description: 'Assorted catering items from wedding reception',
    foodType: 'Prepared Meals',
    quantity: 100,
    unit: 'plates',
    servings: 100,
    expiryDate: '2026-09-30T22:00:00Z',
    pickupAddress: '555 Cedar St, Westside',
    pickupCity: 'New York',
    pickupWindow: '8:00 PM - 10:00 PM',
    status: 'pending',
    createdAt: '2026-09-30T16:00:00Z',
    updatedAt: '2026-09-30T16:00:00Z',
  },
  {
    id: '5',
    donorId: 'd5',
    donorName: 'Sunrise Bakery',
    donorOrganization: 'Sunrise Bakery',
    title: 'Day-Old Bread',
    description: 'Assorted bread from today',
    foodType: 'Bakery',
    quantity: 40,
    unit: 'items',
    servings: 80,
    expiryDate: '2026-10-01T12:00:00Z',
    pickupAddress: '888 Maple Ave, Eastside',
    pickupCity: 'New York',
    pickupWindow: '10:00 AM - 12:00 PM',
    status: 'delivered',
    createdAt: '2026-09-29T10:00:00Z',
    updatedAt: '2026-09-29T14:00:00Z',
    matchedNgoName: 'Hope Foundation',
    volunteerName: 'Alex Rivera',
  },
];

export default function AdminDonationsPage() {
  const [statusFilter, setStatusFilter] = useState<DonationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDonations = donations.filter((donation) => {
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    const matchesSearch =
      donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Donation Management</h1>
        <p className="text-text-secondary mt-1">
          View and manage all donations on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <Filter className="w-4 h-4 text-text-secondary flex-shrink-0" />
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap',
                statusFilter === filter.value
                  ? 'bg-primary-light border-primary text-primary-dark'
                  : 'border-border text-text-secondary hover:border-primary/30'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Donation
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Donor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Recipient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-text">{donation.title}</p>
                      <p className="text-xs text-text-secondary">
                        {donation.quantity} {donation.unit} &middot; {donation.foodType}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-text">{donation.donorName}</p>
                    <p className="text-xs text-text-secondary">{donation.pickupCity}</p>
                  </td>
                  <td className="px-4 py-3">
                    {donation.matchedNgoName ? (
                      <p className="text-sm text-text">{donation.matchedNgoName}</p>
                    ) : (
                      <span className="text-sm text-text-secondary">Matching...</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="donation" status={donation.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(donation.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button className="p-1.5 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
