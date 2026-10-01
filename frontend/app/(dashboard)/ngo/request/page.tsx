'use client';

import { useState } from 'react';
import {
  Heart,
  ChevronRight,
  MapPin,
  Clock,
  Package,
  Users,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const foodTypes = [
  'Prepared Meals',
  'Fresh Produce',
  'Bakery',
  'Dairy',
  'Beverages',
  'Canned Goods',
  'Dry Goods',
  'Other',
];

const urgencyLevels = [
  { value: 'low', label: 'Low', description: 'Needed within a week', color: 'bg-green-50 text-green-600 border-green-200' },
  { value: 'medium', label: 'Medium', description: 'Needed within 3 days', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { value: 'high', label: 'High', description: 'Needed within 24 hours', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { value: 'critical', label: 'Critical', description: 'Needed immediately', color: 'bg-red-50 text-red-600 border-red-200' },
];

export default function RequestFoodPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: '',
    quantityNeeded: '',
    unit: 'servings',
    servingsNeeded: '',
    urgency: 'medium',
    neededByDate: '',
    neededByTime: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryNotes: '',
    recipientType: '',
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Request Submitted!</h2>
          <p className="text-text-secondary mb-6">
            Your food request has been posted. We&apos;ll notify you when a donor
            matches your request.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-secondary"
            >
              Submit Another
            </button>
            <a href="/ngo" className="btn-primary">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Request Food</h1>
        <p className="text-text-secondary mt-1">
          Tell us what you need and we&apos;ll match you with nearby donors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6">
        {/* Basic Info */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">What do you need?</h2>

          <div>
            <label className="input-label">Request Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Need meals for 50 children"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what you need and how it will be used"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="input-label">Food Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {foodTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('foodType', type)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    formData.foodType === type
                      ? 'bg-primary-light border-primary text-primary-dark'
                      : 'border-border text-text-secondary hover:border-primary/30'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="input-label">Quantity Needed</label>
              <input
                type="number"
                value={formData.quantityNeeded}
                onChange={(e) => handleChange('quantityNeeded', e.target.value)}
                placeholder="50"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="input-label">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className="input-field"
              >
                <option value="servings">Servings</option>
                <option value="kg">Kilograms</option>
                <option value="plates">Plates</option>
                <option value="containers">Containers</option>
                <option value="items">Items</option>
              </select>
            </div>
            <div>
              <label className="input-label">People Served</label>
              <input
                type="number"
                value={formData.servingsNeeded}
                onChange={(e) => handleChange('servingsNeeded', e.target.value)}
                placeholder="50"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">How urgent is this?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {urgencyLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleChange('urgency', level.value)}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  formData.urgency === level.value
                    ? `${level.color} ring-2 ring-offset-1 ring-current`
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="font-medium text-text">{level.label}</div>
                <div className="text-sm text-text-secondary">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Details */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">Delivery Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Needed By Date</label>
              <input
                type="date"
                value={formData.neededByDate}
                onChange={(e) => handleChange('neededByDate', e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="input-label">Needed By Time</label>
              <input
                type="time"
                value={formData.neededByTime}
                onChange={(e) => handleChange('neededByTime', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="input-label">Delivery Address</label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) => handleChange('deliveryAddress', e.target.value)}
              placeholder="Full address for delivery"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="input-label">City</label>
            <input
              type="text"
              value={formData.deliveryCity}
              onChange={(e) => handleChange('deliveryCity', e.target.value)}
              placeholder="City"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="input-label">Delivery Notes (optional)</label>
            <textarea
              value={formData.deliveryNotes}
              onChange={(e) => handleChange('deliveryNotes', e.target.value)}
              placeholder="Any special instructions for delivery"
              rows={2}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
            required
          />
          <label htmlFor="terms" className="text-sm text-text-secondary">
            I confirm this request is genuine and I agree to the{' '}
            <a href="#" className="text-primary hover:underline">
              terms of service
            </a>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Heart className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
