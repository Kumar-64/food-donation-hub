'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  Check,
  Phone,
  Siren,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const emergencyLevels = [
  { value: 'low', label: 'Low', description: 'Need food within a week', color: 'bg-green-50 text-green-600 border-green-200' },
  { value: 'medium', label: 'Medium', description: 'Need food within 3 days', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { value: 'high', label: 'High', description: 'Need food within 24 hours', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { value: 'critical', label: 'Critical', description: 'Need food immediately', color: 'bg-red-50 text-red-600 border-red-200' },
];

export default function EmergencyRequestPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    peopleAffected: '',
    foodType: '',
    quantityNeeded: '',
    unit: 'servings',
    level: 'high',
    neededByDate: '',
    neededByTime: '',
    deliveryAddress: '',
    deliveryCity: '',
    contactName: '',
    contactPhone: '',
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
        <div className="card p-8 text-center border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Siren className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">
            Emergency Request Submitted!
          </h2>
          <p className="text-text-secondary mb-6">
            Your emergency request has been broadcast to all nearby donors and
            volunteers. You should receive responses within minutes.
          </p>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-sm text-red-700">
              <strong>Emergency Hotline:</strong> +1 (555) 911-FOOD
              <br />
              For immediate assistance, please call our emergency response team.
            </p>
          </div>
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-text">Emergency Food Request</h1>
        </div>
        <p className="text-text-secondary">
          For urgent food needs. Emergency requests are immediately broadcast to all
          nearby donors and volunteers.
        </p>
      </div>

      {/* Emergency Notice */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
        <div className="flex items-start gap-3">
          <Siren className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Emergency Response Active
            </p>
            <p className="text-xs text-red-700 mt-1">
              Your request will be sent to all donors and volunteers within a 10 km
              radius. Average response time: 15 minutes.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 md:p-8 space-y-6 border-red-100">
        {/* Emergency Details */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">Emergency Details</h2>

          <div>
            <label className="input-label">Emergency Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Urgent: 250 people need meals tonight"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the emergency situation and what you need"
              rows={3}
              className="input-field resize-none"
              required
            />
          </div>

          <div>
            <label className="input-label">People Affected</label>
            <input
              type="number"
              value={formData.peopleAffected}
              onChange={(e) => handleChange('peopleAffected', e.target.value)}
              placeholder="e.g., 250"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="input-label">Food Type Needed</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Prepared Meals', 'Fresh Produce', 'Bakery', 'Any'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('foodType', type)}
                  className={cn(
                    'px-3 py-2 text-sm rounded-lg border transition-colors',
                    formData.foodType === type
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'border-border text-text-secondary hover:border-red-200'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Quantity Needed</label>
              <input
                type="number"
                value={formData.quantityNeeded}
                onChange={(e) => handleChange('quantityNeeded', e.target.value)}
                placeholder="500"
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
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Level */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">Emergency Level</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {emergencyLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleChange('level', level.value)}
                className={cn(
                  'p-4 rounded-lg border text-left transition-colors',
                  formData.level === level.value
                    ? `${level.color} ring-2 ring-offset-1 ring-current`
                    : 'border-border hover:border-red-200'
                )}
              >
                <div className="font-medium text-text">{level.label}</div>
                <div className="text-sm text-text-secondary">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery & Contact */}
        <div className="space-y-5">
          <h2 className="text-lg font-semibold text-text">Delivery & Contact</h2>

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
                required
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Contact Person</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => handleChange('contactName', e.target.value)}
                placeholder="Name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="input-label">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-border text-red-600 focus:ring-red-500"
            required
          />
          <label htmlFor="terms" className="text-sm text-text-secondary">
            I confirm this is a genuine emergency and I agree to the{' '}
            <a href="#" className="text-red-600 hover:underline">
              emergency request terms
            </a>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-danger px-8"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Siren className="w-4 h-4" />
                Submit Emergency Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
