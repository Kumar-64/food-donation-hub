'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Utensils,
  Building2,
  Calendar,
  Shield,
  HandHeart,
  ArrowRight,
  ArrowLeft,
  Check,
  Mail,
} from 'lucide-react';
import { cn, friendlyAuthError } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/lib/types';

type Role = 'donor' | 'organizer' | 'ngo' | 'volunteer';

const roles = [
  {
    id: 'donor' as Role,
    icon: Building2,
    title: 'Restaurant / Donor',
    description: 'I have surplus food to donate from my restaurant or business',
    color: 'bg-green-50 text-green-600 border-green-200',
  },
  {
    id: 'organizer' as Role,
    icon: Calendar,
    title: 'Function Organizer',
    description: 'I organize events and have leftover food to donate',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 'ngo' as Role,
    icon: Shield,
    title: 'NGO / Orphanage',
    description: 'I represent an organization that needs food donations',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    id: 'volunteer' as Role,
    icon: HandHeart,
    title: 'Volunteer',
    description: 'I want to help pick up and deliver food to those in need',
    color: 'bg-pink-50 text-pink-600 border-pink-200',
  },
];

const roleFields: Record<Role, { label: string; placeholder: string; type?: string }[]> = {
  donor: [
    { label: 'Restaurant / Business Name', placeholder: 'e.g., Golden Dragon Restaurant' },
    { label: 'Business Type', placeholder: 'e.g., Restaurant, Catering, Bakery' },
    { label: 'Business Registration Number', placeholder: 'Optional' },
  ],
  organizer: [
    { label: 'Organization Name', placeholder: 'e.g., Grand Events Co.' },
    { label: 'Event Types', placeholder: 'e.g., Weddings, Conferences, Parties' },
  ],
  ngo: [
    { label: 'Organization Name', placeholder: 'e.g., Hope Foundation' },
    { label: 'Registration Number', placeholder: 'NGO registration number' },
    { label: 'Beneficiaries Count', placeholder: 'e.g., 250', type: 'number' },
  ],
  volunteer: [
    { label: 'Vehicle Type', placeholder: 'e.g., Car, Bike, Bicycle' },
    { label: 'Availability', placeholder: 'e.g., Weekdays, Weekends' },
  ],
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<'role' | 'details' | 'confirm'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Map organizer role to donor for the database
      const dbRole: UserRole = selectedRole === 'organizer' ? 'donor' : selectedRole as UserRole;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: dbRole,
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
          },
        },
      });

      if (signUpError) {
        setError(friendlyAuthError(signUpError.message));
        return;
      }

      // Email confirmation is enabled: signUp() returns a user but NO
      // session, so we cannot write to public.users yet (RLS requires an
      // authenticated session). Show the "check your email" screen instead
      // of redirecting to a dashboard we can't enter.
      if (data.user && !data.session) {
        setStep('confirm');
        return;
      }

      // Confirmation disabled: we have a session right away.
      if (data.user && data.session) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: dbRole,
          address: formData.address,
          city: formData.city,
          verified: false,
          suspended: false,
          created_at: new Date().toISOString(),
        });

        // 23505 = profile already exists (fine). Any other failure is not
        // fatal: the profile is backfilled from auth metadata on next login.
        if (profileError && profileError.code !== '23505') {
          console.error('Profile insert failed:', profileError.message);
        }

        localStorage.setItem('supabase_session', JSON.stringify(data.session));
      }

      const redirectMap: Record<Role, string> = {
        donor: '/donor',
        organizer: '/donor',
        ngo: '/ngo',
        volunteer: '/volunteer',
      };

      if (selectedRole) {
        router.push(redirectMap[selectedRole]);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text">FoodBridge</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              step === 'role' ? 'text-primary' : 'text-green-600'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                step === 'role'
                  ? 'bg-primary text-white'
                  : 'bg-green-100 text-green-600'
              )}
            >
              {step === 'details' ? <Check className="w-4 h-4" /> : '1'}
            </div>
            Select Role
          </div>
          <div className="flex-1 h-0.5 bg-border rounded" />
          <div
            className={cn(
              'flex items-center gap-2 text-sm font-medium',
              step === 'details' ? 'text-primary' : 'text-text-secondary'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                step === 'details'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-secondary'
              )}
            >
              2
            </div>
            Your Details
          </div>
        </div>

        {step === 'role' && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-text">
                Join FoodBridge
              </h1>
              <p className="text-text-secondary mt-2">
                Choose the option that best describes you
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={cn(
                    'card p-6 text-left transition-all duration-200 hover:shadow-card-hover',
                    selectedRole === role.id
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      role.color
                    )}
                  >
                    <role.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-1">
                    {role.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{role.description}</p>
                  {selectedRole === role.id && (
                    <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                      <Check className="w-4 h-4" />
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep('details')}
                disabled={!selectedRole}
                className="btn-primary px-8"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 'details' && selectedRole && (
          <div className="animate-fade-in">
            <button
              onClick={() => setStep('role')}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-text mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to role selection
            </button>

            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                {selectedRoleData && (
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      selectedRoleData.color
                    )}
                  >
                    <selectedRoleData.icon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-text">
                    {selectedRoleData?.title}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Fill in your details to create your account
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Email address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Phone number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="New York"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Role-specific fields */}
                {roleFields[selectedRole].map((field) => (
                  <div key={field.label}>
                    <label className="input-label">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={formData[field.label] || ''}
                      onChange={(e) => handleChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      className="input-field"
                    />
                  </div>
                ))}

                <div>
                  <label className="input-label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Street address"
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="input-label">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Create a password"
                      className="input-field"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="input-label">Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className="input-field"
                      required
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-text-secondary">
                    I agree to the{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="animate-fade-in max-w-lg mx-auto">
            <div className="card p-8 text-center">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-text mb-2">
                Check your email
              </h1>
              <p className="text-text-secondary mb-1">
                We sent a confirmation link to
              </p>
              <p className="font-semibold text-text mb-4 break-all">
                {formData.email}
              </p>
              <p className="text-sm text-text-secondary mb-6">
                Click the link to activate your account, then log in here.
                Didn&apos;t see it? Check your spam folder.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/login" className="btn-primary px-6">
                  Go to login
                </Link>
                <button
                  onClick={() => {
                    setError('');
                    setStep('details');
                  }}
                  className="btn-secondary px-6"
                >
                  Use a different email
                </button>
              </div>
              <p className="mt-6 text-xs text-text-secondary">
                Free-plan note: signup emails are rate-limited to a few per
                hour. If you saw &quot;rate limit exceeded&quot;, wait about an
                hour and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
