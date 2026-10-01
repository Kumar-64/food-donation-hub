'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Phone,
  ChevronRight,
  Siren,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { EmergencyRequest } from '@/lib/types';

const emergencyRequests: EmergencyRequest[] = [
  {
    id: 'e1',
    ngoId: 'ngo1',
    ngoName: 'Hope Foundation',
    title: 'Urgent: 250 people need meals tonight',
    description: 'Community center lost power, no food storage available',
    peopleAffected: 250,
    foodType: 'Prepared Meals',
    quantityNeeded: 500,
    unit: 'servings',
    level: 'critical',
    neededByDate: '2026-09-30T18:00:00Z',
    deliveryAddress: '456 Oak Ave, Downtown',
    deliveryCity: 'New York',
    status: 'open',
    createdAt: '2026-09-30T14:00:00Z',
  },
  {
    id: 'e2',
    ngoId: 'ngo2',
    ngoName: 'Community Kitchen',
    title: 'High demand for weekend meals',
    description: 'Soup kitchen serving 300+ people this weekend',
    peopleAffected: 300,
    foodType: 'Fresh Produce',
    quantityNeeded: 100,
    unit: 'kg',
    level: 'high',
    neededByDate: '2026-10-01T10:00:00Z',
    deliveryAddress: '321 Pine St, Uptown',
    deliveryCity: 'New York',
    status: 'matched',
    createdAt: '2026-09-30T10:00:00Z',
  },
  {
    id: 'e3',
    ngoId: 'ngo3',
    ngoName: 'Shelter House',
    title: 'Need bread and bakery items',
    description: 'Daily breakfast program for 80 residents',
    peopleAffected: 80,
    foodType: 'Bakery',
    quantityNeeded: 80,
    unit: 'items',
    level: 'medium',
    neededByDate: '2026-10-02T08:00:00Z',
    deliveryAddress: '789 Elm St, Midtown',
    deliveryCity: 'New York',
    status: 'fulfilled',
    createdAt: '2026-09-29T08:00:00Z',
    resolvedAt: '2026-09-29T14:00:00Z',
  },
];

const levelColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function AdminEmergencyPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'matched' | 'fulfilled'>('all');

  const filteredRequests = emergencyRequests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const openCount = emergencyRequests.filter((r) => r.status === 'open').length;
  const criticalCount = emergencyRequests.filter((r) => r.level === 'critical').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Emergency Requests</h1>
          <p className="text-text-secondary mt-1">
            Monitor and manage emergency food requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              <Siren className="w-4 h-4" />
              {criticalCount} Critical
            </span>
          )}
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
            <AlertTriangle className="w-4 h-4" />
            {openCount} Open
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'open', 'matched', 'fulfilled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg border transition-colors capitalize',
              filter === f
                ? 'bg-primary-light border-primary text-primary-dark'
                : 'border-border text-text-secondary hover:border-primary/30'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Emergency Requests */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className={cn(
              'card p-6',
              request.level === 'critical' && 'border-red-200 bg-red-50/30'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-text">{request.title}</h3>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      levelColors[request.level]
                    )}
                  >
                    {request.level}
                  </span>
                  <StatusBadge type="request" status={request.status} size="sm" />
                </div>
                <p className="text-sm text-text-secondary mb-3">{request.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {request.peopleAffected} people
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {request.deliveryCity}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Needed by {formatDateTime(request.neededByDate)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {request.status === 'open' && (
                  <button className="btn-danger text-sm">
                    <Siren className="w-4 h-4" />
                    Respond
                  </button>
                )}
                {request.status === 'matched' && (
                  <button className="btn-secondary text-sm">
                    <CheckCircle className="w-4 h-4" />
                    View Match
                  </button>
                )}
                <button className="btn-ghost text-sm">
                  <Phone className="w-4 h-4" />
                  Contact NGO
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
