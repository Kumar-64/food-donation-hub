'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Package,
  Phone,
  MessageSquare,
  CheckCircle,
  Navigation,
  User,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import MapPlaceholder from '@/components/MapPlaceholder';
import { formatDateTime } from '@/lib/utils';

export default function DeliveryDetailsPage() {
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
              <h1 className="text-2xl font-bold text-text">Fried Rice & Noodles</h1>
              <StatusBadge type="delivery" status="assigned" />
            </div>
            <p className="text-text-secondary">
              Delivery #DL-2026-001 &middot; Assigned{' '}
              {formatDateTime('2026-09-30T14:30:00Z')}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm">
              <Phone className="w-4 h-4" />
              Call Donor
            </button>
            <button className="btn-secondary text-sm">
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Delivery Route</h2>
            <MapPlaceholder
              title="Golden Dragon Restaurant → Hope Foundation"
              address="123 Main St → 456 Oak Ave, Downtown"
              height="h-72"
            />
          </div>

          {/* Delivery Details */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Pickup Location</p>
                  <p className="font-medium text-text">123 Main St, Downtown</p>
                  <p className="text-sm text-text-secondary">Golden Dragon Restaurant</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Navigation className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Delivery Location</p>
                  <p className="font-medium text-text">456 Oak Ave, Downtown</p>
                  <p className="text-sm text-text-secondary">Hope Foundation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Items</p>
                  <p className="font-medium text-text">50 plates of Fried Rice & Noodles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Estimated Arrival</p>
                  <p className="font-medium text-text">
                    {formatDateTime('2026-09-30T16:00:00Z')}
                  </p>
                </div>
              </div>
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
                Accept Delivery
              </button>
              <button className="btn-secondary w-full">
                <Navigation className="w-4 h-4" />
                Start Navigation
              </button>
              <button className="btn-ghost w-full text-danger hover:bg-red-50">
                Decline Delivery
              </button>
            </div>
          </div>

          {/* Donor Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Donor Information</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-text">Golden Dragon Restaurant</p>
                <p className="text-sm text-text-secondary">Verified Donor</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Recipient Information</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-text">Hope Foundation</p>
                <p className="text-sm text-text-secondary">Verified NGO</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 987-6543</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
