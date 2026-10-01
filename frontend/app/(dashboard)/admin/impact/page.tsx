'use client';

import {
  Utensils,
  Users,
  Package,
  Truck,
  TrendingUp,
  Heart,
  Leaf,
  Target,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import { formatNumber } from '@/lib/utils';

const kpis = [
  { label: 'Meals Served', value: 125430, change: '+8% from last month', changeType: 'positive' as const, icon: <Utensils className="w-5 h-5 text-primary" /> },
  { label: 'Food Rescued', value: '89.2t', change: '+15% from last month', changeType: 'positive' as const, icon: <Package className="w-5 h-5 text-primary" /> },
  { label: 'Active Donors', value: 1240, change: '+5% from last month', changeType: 'positive' as const, icon: <Heart className="w-5 h-5 text-primary" /> },
  { label: 'Active Volunteers', value: 3560, change: '+12% from last month', changeType: 'positive' as const, icon: <Users className="w-5 h-5 text-primary" /> },
  { label: 'Total Deliveries', value: 8920, change: '+10% from last month', changeType: 'positive' as const, icon: <Truck className="w-5 h-5 text-primary" /> },
  { label: 'CO2 Saved', value: '12.5t', change: '+20% from last month', changeType: 'positive' as const, icon: <Leaf className="w-5 h-5 text-primary" /> },
];

const monthlyData = [
  { month: 'Jan', meals: 8200, donations: 450 },
  { month: 'Feb', meals: 9100, donations: 520 },
  { month: 'Mar', meals: 10500, donations: 610 },
  { month: 'Apr', meals: 11200, donations: 680 },
  { month: 'May', meals: 12800, donations: 750 },
  { month: 'Jun', meals: 13500, donations: 820 },
  { month: 'Jul', meals: 14200, donations: 890 },
  { month: 'Aug', meals: 15100, donations: 950 },
  { month: 'Sep', meals: 16200, donations: 1020 },
];

const topDonors = [
  { name: 'Golden Dragon Restaurant', donations: 156, meals: 7800 },
  { name: 'Fresh Bakery', donations: 134, meals: 6700 },
  { name: 'City Catering Co.', donations: 128, meals: 6400 },
  { name: 'Green Grocers', donations: 112, meals: 5600 },
  { name: 'Sunrise Bakery', donations: 98, meals: 4900 },
];

const topNgos = [
  { name: 'Hope Foundation', received: 234, meals: 11700 },
  { name: 'Community Kitchen', received: 198, meals: 9900 },
  { name: 'Shelter House', received: 176, meals: 8800 },
  { name: 'Youth Center', received: 145, meals: 7250 },
  { name: 'Senior Care Home', received: 132, meals: 6600 },
];

export default function AdminImpactPage() {
  const maxMeals = Math.max(...monthlyData.map((d) => d.meals));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Impact Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Track the overall impact of FoodBridge on communities
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meals Served Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-text">Meals Served Over Time</h2>
            <span className="text-sm text-text-secondary">Last 9 months</span>
          </div>
          <div className="space-y-3">
            {monthlyData.map((item) => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-sm text-text-secondary w-8">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${(item.meals / maxMeals) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {formatNumber(item.meals)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donations Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-text">Donations Over Time</h2>
            <span className="text-sm text-text-secondary">Last 9 months</span>
          </div>
          <div className="space-y-3">
            {monthlyData.map((item) => (
              <div key={item.month} className="flex items-center gap-3">
                <span className="text-sm text-text-secondary w-8">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-info h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${(item.donations / 1100) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {item.donations}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Donors & NGOs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Donors */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-text">Top Donors</h2>
          </div>
          <div className="divide-y divide-border">
            {topDonors.map((donor, index) => (
              <div key={donor.name} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-dark">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text">{donor.name}</p>
                  <p className="text-xs text-text-secondary">
                    {donor.donations} donations
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text">{formatNumber(donor.meals)}</p>
                  <p className="text-xs text-text-secondary">meals</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top NGOs */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-text">Top Recipient NGOs</h2>
          </div>
          <div className="divide-y divide-border">
            {topNgos.map((ngo, index) => (
              <div key={ngo.name} className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text">{ngo.name}</p>
                  <p className="text-xs text-text-secondary">
                    {ngo.received} donations received
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-text">{formatNumber(ngo.meals)}</p>
                  <p className="text-xs text-text-secondary">meals</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="card p-6">
        <h2 className="font-semibold text-text mb-6">Impact Goals</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: 'Monthly Meal Target', current: 16200, target: 20000, color: 'bg-primary' },
            { label: 'Donor Growth', current: 1240, target: 1500, color: 'bg-info' },
            { label: 'Volunteer Growth', current: 3560, target: 4000, color: 'bg-purple-500' },
          ].map((goal) => (
            <div key={goal.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text">{goal.label}</span>
                <span className="text-sm text-text-secondary">
                  {formatNumber(goal.current)} / {formatNumber(goal.target)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${goal.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {Math.round((goal.current / goal.target) * 100)}% achieved
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
