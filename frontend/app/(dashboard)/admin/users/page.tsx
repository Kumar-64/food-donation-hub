'use client';

import { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  MoreVertical,
  Shield,
  Building2,
  HandHeart,
  Users,
  ChevronRight,
} from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/lib/types';

const tabs = [
  { id: 'all', label: 'All Users', icon: Users },
  { id: 'donor', label: 'Donors', icon: Building2 },
  { id: 'ngo', label: 'NGOs', icon: Shield },
  { id: 'volunteer', label: 'Volunteers', icon: HandHeart },
  { id: 'admin', label: 'Admins', icon: Shield },
];

const users: User[] = [
  {
    id: 'u1',
    name: 'Golden Dragon Restaurant',
    email: 'contact@goldendragon.com',
    phone: '+1 (555) 123-4567',
    role: 'donor',
    organization: 'Golden Dragon',
    city: 'New York',
    verified: true,
    suspended: false,
    createdAt: '2026-01-15T10:00:00Z',
    lastLogin: '2026-09-30T14:00:00Z',
  },
  {
    id: 'u2',
    name: 'Hope Foundation',
    email: 'info@hopefoundation.org',
    phone: '+1 (555) 234-5678',
    role: 'ngo',
    organization: 'Hope Foundation',
    city: 'New York',
    verified: true,
    suspended: false,
    createdAt: '2026-02-20T10:00:00Z',
    lastLogin: '2026-09-30T12:00:00Z',
  },
  {
    id: 'u3',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 345-6789',
    role: 'volunteer',
    city: 'New York',
    verified: true,
    suspended: false,
    createdAt: '2026-03-10T10:00:00Z',
    lastLogin: '2026-09-30T16:00:00Z',
  },
  {
    id: 'u4',
    name: 'Fresh Bakery',
    email: 'hello@freshbakery.com',
    phone: '+1 (555) 456-7890',
    role: 'donor',
    organization: 'Fresh Bakery',
    city: 'New York',
    verified: false,
    suspended: false,
    createdAt: '2026-09-28T10:00:00Z',
  },
  {
    id: 'u5',
    name: 'Community Kitchen',
    email: 'contact@communitykitchen.org',
    phone: '+1 (555) 567-8901',
    role: 'ngo',
    organization: 'Community Kitchen',
    city: 'New York',
    verified: true,
    suspended: false,
    createdAt: '2026-04-05T10:00:00Z',
    lastLogin: '2026-09-29T10:00:00Z',
  },
  {
    id: 'u6',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 678-9012',
    role: 'volunteer',
    city: 'New York',
    verified: true,
    suspended: true,
    createdAt: '2026-05-12T10:00:00Z',
    lastLogin: '2026-09-25T10:00:00Z',
  },
];

const roleColors: Record<UserRole, string> = {
  donor: 'bg-green-100 text-green-700',
  ngo: 'bg-blue-100 text-blue-700',
  volunteer: 'bg-purple-100 text-purple-700',
  admin: 'bg-gray-100 text-gray-700',
};

const roleLabels: Record<UserRole, string> = {
  donor: 'Donor',
  ngo: 'NGO',
  volunteer: 'Volunteer',
  admin: 'Admin',
};

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const matchesTab = activeTab === 'all' || user.role === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">User Management</h1>
        <p className="text-text-secondary mt-1">
          Manage all platform users, verify accounts, and handle suspensions
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-thin">
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <span className="text-sm text-text-secondary">
          {filteredUsers.length} users
        </span>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Joined
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">
                  Last Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-dark">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-text">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-full',
                        roleColors[user.role]
                      )}
                    >
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.verified ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-yellow-600">
                          <XCircle className="w-3.5 h-3.5" />
                          Unverified
                        </span>
                      )}
                      {user.suspended && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {!user.verified && (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {!user.suspended ? (
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-text-secondary hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
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
