'use client';

import { useState } from 'react';
import {
  Utensils,
  Shield,
  Truck,
  Heart,
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  MapPin,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Food Details', icon: Utensils },
  { id: 2, label: 'Food Safety', icon: Shield },
  { id: 3, label: 'Pickup', icon: Truck },
  { id: 4, label: 'Matching', icon: Heart },
];

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

export default function DonateFoodPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    foodType: '',
    quantity: '',
    unit: 'servings',
    servings: '',
    expiryDate: '',
    expiryTime: '',
    storageType: '',
    temperature: '',
    packaging: '',
    allergens: [] as string[],
    pickupAddress: '',
    pickupCity: '',
    pickupDate: '',
    pickupTimeStart: '',
    pickupTimeEnd: '',
    pickupNotes: '',
    recipientType: '',
    distance: '5',
    agreeToTerms: false,
  });

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert('Donation submitted successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Donate Food</h1>
        <p className="text-text-secondary mt-1">
          Fill in the details to list your surplus food for donation
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                    currentStep > step.id
                      ? 'bg-green-100 text-green-600'
                      : currentStep === step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-secondary'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium mt-2 hidden sm:block',
                    currentStep >= step.id ? 'text-primary' : 'text-text-secondary'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 sm:w-24 h-0.5 mx-2',
                    currentStep > step.id ? 'bg-green-200' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="card p-6 md:p-8">
        {/* Step 1: Food Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-text">Food Details</h2>

            <div>
              <label className="input-label">Food Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Fresh vegetable curry"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the food items, quantity, and any relevant details"
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
                <label className="input-label">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="50"
                  className="input-field"
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
                <label className="input-label">Est. Servings</label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => handleChange('servings', e.target.value)}
                  placeholder="50"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleChange('expiryDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Expiry Time</label>
                <input
                  type="time"
                  value={formData.expiryTime}
                  onChange={(e) => handleChange('expiryTime', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Food Safety */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-text">Food Safety</h2>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Food Safety Guidelines
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please ensure all food is properly stored and handled. FoodBridge
                    verifies all donations for safety compliance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Storage Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['Room Temperature', 'Refrigerated', 'Frozen'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange('storageType', type)}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-colors',
                      formData.storageType === type
                        ? 'bg-primary-light border-primary text-primary-dark'
                        : 'border-border text-text-secondary hover:border-primary/30'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="input-label">Current Temperature (if applicable)</label>
              <input
                type="text"
                value={formData.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                placeholder="e.g., 4°C / 39°F"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Packaging</label>
              <div className="grid grid-cols-2 gap-2">
                {['Sealed Containers', 'Covered Trays', 'Original Packaging', 'Bagged'].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('packaging', type)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg border transition-colors',
                        formData.packaging === type
                          ? 'bg-primary-light border-primary text-primary-dark'
                          : 'border-border text-text-secondary hover:border-primary/30'
                      )}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="input-label">Allergens</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Nuts',
                  'Dairy',
                  'Gluten',
                  'Soy',
                  'Eggs',
                  'Shellfish',
                  'None',
                ].map((allergen) => (
                  <label
                    key={allergen}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:border-primary/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.allergens.includes(allergen)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange('allergens', [...formData.allergens, allergen]);
                        } else {
                          handleChange(
                            'allergens',
                            formData.allergens.filter((a) => a !== allergen)
                          );
                        }
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text">{allergen}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pickup */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-text">Pickup Details</h2>

            <div>
              <label className="input-label">Pickup Address</label>
              <input
                type="text"
                value={formData.pickupAddress}
                onChange={(e) => handleChange('pickupAddress', e.target.value)}
                placeholder="Full address for pickup"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">City</label>
              <input
                type="text"
                value={formData.pickupCity}
                onChange={(e) => handleChange('pickupCity', e.target.value)}
                placeholder="City"
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Pickup Date</label>
              <input
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleChange('pickupDate', e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Pickup Window Start</label>
                <input
                  type="time"
                  value={formData.pickupTimeStart}
                  onChange={(e) => handleChange('pickupTimeStart', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="input-label">Pickup Window End</label>
                <input
                  type="time"
                  value={formData.pickupTimeEnd}
                  onChange={(e) => handleChange('pickupTimeEnd', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Pickup Notes (optional)</label>
              <textarea
                value={formData.pickupNotes}
                onChange={(e) => handleChange('pickupNotes', e.target.value)}
                placeholder="Any special instructions for the volunteer picking up the food"
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Matching */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-text">Matching Preferences</h2>

            <div>
              <label className="input-label">Preferred Recipient Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Any', 'NGO', 'Orphanage', 'Shelter', 'Community Kitchen'].map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('recipientType', type)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-lg border transition-colors',
                        formData.recipientType === type
                          ? 'bg-primary-light border-primary text-primary-dark'
                          : 'border-border text-text-secondary hover:border-primary/30'
                      )}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="input-label">Maximum Distance (km)</label>
              <input
                type="range"
                min="1"
                max="50"
                value={formData.distance}
                onChange={(e) => handleChange('distance', e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>1 km</span>
                <span className="font-medium text-primary">{formData.distance} km</span>
                <span>50 km</span>
              </div>
            </div>

            <div className="p-4 bg-primary-light rounded-lg">
              <h3 className="font-medium text-primary-dark mb-2">Summary</h3>
              <div className="space-y-2 text-sm text-text">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Food Item</span>
                  <span className="font-medium">{formData.title || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Quantity</span>
                  <span className="font-medium">
                    {formData.quantity || '0'} {formData.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Food Type</span>
                  <span className="font-medium">{formData.foodType || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Pickup</span>
                  <span className="font-medium">
                    {formData.pickupDate || 'TBD'} ({formData.pickupTimeStart || 'TBD'} -{' '}
                    {formData.pickupTimeEnd || 'TBD'})
                  </span>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-secondary">
                I confirm that the food is safe for consumption and I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  donation terms
                </a>
              </span>
            </label>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-ghost"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agreeToTerms}
              className="btn-primary"
            >
              <Check className="w-4 h-4" />
              Submit Donation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
