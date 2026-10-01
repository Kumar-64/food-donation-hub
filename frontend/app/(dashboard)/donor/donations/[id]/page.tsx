'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  Truck,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import MapPlaceholder from '@/components/MapPlaceholder';
import { formatDateTime, timeAgo } from '@/lib/utils';

const timeline = [
  { status: 'pending', label: 'Donation Created', time: '2026-09-30T14:00:00Z', completed: true },
  { status: 'matched', label: 'Matched with Hope Foundation', time: '2026-09-30T14:30:00Z', completed: true },
  { status: 'picked_up', label: 'Picked up by Sarah Johnson', time: '2026-09-30T15:00:00Z', completed: true },
  { status: 'in_transit', label: 'In transit to recipient', time: '2026-09-30T15:30:00Z', completed: true },
  { status: 'delivered', label: 'Delivered to Hope Foundation', time: '2026-09-30T16:15:00Z', completed: true },
];

export default function DonationDetailsPage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back button */}
      <Link
        href="/donor"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to donations
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text">Fried Rice & Noodles</h1>
              <StatusBadge type="donation" status="delivered" />
            </div>
            <p className="text-text-secondary">
              Donation #FB-2026-001 &middot; Created {timeAgo('2026-09-30T14:00:00Z')}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm">
              <MessageSquare className="w-4 h-4" />
              Contact NGO
            </button>
            <button className="btn-secondary text-sm">
              <Phone className="w-4 h-4" />
              Contact Volunteer
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-6">Delivery Timeline</h2>
            <div className="space-y-0">
              {timeline.map((item, index) => (
                <div key={item.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-text-secondary'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          item.completed ? 'bg-green-200' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="font-medium text-text">{item.label}</p>
                    <p className="text-sm text-text-secondary">
                      {formatDateTime(item.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Delivery Route</h2>
            <MapPlaceholder
              title="Golden Dragon Restaurant → Hope Foundation"
              address="123 Main St → 456 Oak Ave, Downtown"
              height="h-72"
            />
          </div>

          {/* Food Details */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Food Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Food Type</p>
                <p className="font-medium text-text">Prepared Meals</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Quantity</p>
                <p className="font-medium text-text">50 plates</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Servings</p>
                <p className="font-medium text-text">50 people</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Expiry</p>
                <p className="font-medium text-text">
                  {formatDateTime('2026-10-01T18:00:00Z')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Matched Recipient */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Matched Recipient</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text">Hope Foundation</p>
                <p className="text-sm text-text-secondary">NGO &middot; Verified</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span>456 Oak Ave, Downtown</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4 text-sm">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
          </div>

          {/* Volunteer Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Delivery Volunteer</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-text">Sarah Johnson</p>
                <p className="text-sm text-text-secondary">Volunteer &middot; 4.9 rating</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 987-6543</span>
              </div>
            </div>
            <button className="btn-secondary w-full mt-4 text-sm">
              <Phone className="w-4 h-4" />
              Call Volunteer
            </button>
          </div>

          {/* Pickup Info */}
          <div className="card p-6">
            <h2 className="font-semibold text-text mb-4">Pickup Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-text-secondary">Address</p>
                <p className="font-medium text-text">123 Main St, Downtown</p>
              </div>
              <div>
                <p className="text-text-secondary">Pickup Window</p>
                <p className="font-medium text-text">4:00 PM - 6:00 PM</p>
              </div>
              <div>
                <p className="text-text-secondary">Actual Pickup</p>
                <p className="font-medium text-text">
                  {formatDateTime('2026-09-30T15:00:00Z')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
