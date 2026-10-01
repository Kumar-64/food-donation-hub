'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  Phone,
  MessageSquare,
  Package,
  User,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import MapPlaceholder from '@/components/MapPlaceholder';
import { formatDateTime } from '@/lib/utils';

const trackingSteps = [
  { label: 'Picked up from donor', time: '2026-09-30T15:30:00Z', completed: true },
  { label: 'In transit', time: '2026-09-30T15:45:00Z', completed: true },
  { label: 'Arriving at destination', time: '2026-09-30T16:15:00Z', completed: false },
  { label: 'Delivered', time: null, completed: false },
];

export default function TrackingPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <Link
        href="/volunteer"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to deliveries
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text">Live Tracking</h1>
              <StatusBadge type="delivery" status="in_transit" />
            </div>
            <p className="text-text-secondary">
              Delivery #DL-2026-002 &middot; Fresh Vegetables
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Live Location</h2>
            <MapPlaceholder
              title="In Transit - Fresh Vegetables"
              address="789 Elm St → 321 Pine St"
              height="h-80"
            />
          </div>

          {/* ETA */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text">Estimated Arrival</h2>
              <span className="text-2xl font-bold text-primary">15 min</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-3/4 transition-all" />
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-2">
              <span>Picked up</span>
              <span>Arriving at 321 Pine St</span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-6">Tracking Timeline</h2>
            <div className="space-y-0">
              {trackingSteps.map((step, index) => (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-text-secondary'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.completed ? 'bg-green-200' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="font-medium text-text">{step.label}</p>
                    {step.time && (
                      <p className="text-sm text-text-secondary">
                        {formatDateTime(step.time)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Actions</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full">
                <CheckCircle className="w-4 h-4" />
                Mark as Delivered
              </button>
              <button className="btn-secondary w-full">
                <Navigation className="w-4 h-4" />
                Navigate
              </button>
              <button className="btn-secondary w-full">
                <Phone className="w-4 h-4" />
                Call Recipient
              </button>
              <button className="btn-ghost w-full text-danger hover:bg-red-50">
                Report Issue
              </button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Delivery Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary">Items</p>
                <p className="font-medium text-text">20 kg Fresh Vegetables</p>
              </div>
              <div>
                <p className="text-text-secondary">From</p>
                <p className="font-medium text-text">Green Grocers</p>
              </div>
              <div>
                <p className="text-text-secondary">To</p>
                <p className="font-medium text-text">Community Kitchen</p>
              </div>
              <div>
                <p className="text-text-secondary">Distance</p>
                <p className="font-medium text-text">3.2 km</p>
              </div>
            </div>
          </div>

          {/* Recipient */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Recipient</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-text">Community Kitchen</p>
                <p className="text-sm text-text-secondary">321 Pine St, Uptown</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
