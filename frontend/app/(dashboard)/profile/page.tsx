'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Bell,
  Shield,
  Key,
  ChevronRight,
  Check,
  Camera,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Golden Dragon Restaurant',
    address: '123 Main St, Downtown',
    city: 'New York',
    bio: 'Restaurant owner passionate about reducing food waste and helping the community.',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Profile Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-dark">JD</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-text">{formData.name}</h2>
            <p className="text-text-secondary">{formData.organization}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Verified
              </span>
              <span className="px-2.5 py-0.5 bg-primary-light text-primary-dark text-xs font-medium rounded-full">
                Donor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                'text-sm font-medium',
                isEditing ? 'text-primary' : 'text-text-secondary hover:text-text'
              )}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="input-field pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    disabled={!isEditing}
                    className="input-field pl-11"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="input-label">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button className="btn-primary">
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-text mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { label: 'Email notifications', description: 'Receive updates via email', enabled: true },
              { label: 'Push notifications', description: 'Receive push notifications', enabled: true },
              { label: 'SMS alerts', description: 'Get SMS for urgent requests', enabled: false },
              { label: 'Weekly digest', description: 'Weekly summary of activity', enabled: true },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-text">{pref.label}</p>
                  <p className="text-sm text-text-secondary">{pref.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={pref.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-text mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-text mb-3">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Current Password</label>
                  <input type="password" className="input-field" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="input-label">New Password</label>
                  <input type="password" className="input-field" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="input-label">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="Confirm new password" />
                </div>
                <button className="btn-primary">
                  <Key className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <h3 className="font-medium text-text mb-3">Two-Factor Authentication</h3>
              <p className="text-sm text-text-secondary mb-4">
                Add an extra layer of security to your account
              </p>
              <button className="btn-secondary">
                <Shield className="w-4 h-4" />
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
