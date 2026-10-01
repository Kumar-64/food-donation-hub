import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import type { DonationStatus, RequestStatus, EmergencyLevel, DeliveryStatus, NotificationType, User, UserRole } from './types';
import { supabase } from './supabase';

// ============================================================
// Date & Time Formatting
// ============================================================

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatDateLong(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE, MMMM d, yyyy');
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ============================================================
// Number Formatting
// ============================================================

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tonnes`;
  return `${kg} kg`;
}

// ============================================================
// Status Colors & Labels
// ============================================================

export function donationStatusColor(status: DonationStatus): string {
  const colors: Record<DonationStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    matched: 'bg-blue-100 text-blue-800 border-blue-200',
    picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function donationStatusLabel(status: DonationStatus): string {
  const labels: Record<DonationStatus, string> = {
    pending: 'Pending',
    matched: 'Matched',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

export function requestStatusColor(status: RequestStatus): string {
  const colors: Record<RequestStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    matched: 'bg-blue-100 text-blue-800 border-blue-200',
    fulfilled: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function requestStatusLabel(status: RequestStatus): string {
  const labels: Record<RequestStatus, string> = {
    open: 'Open',
    matched: 'Matched',
    fulfilled: 'Fulfilled',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

export function emergencyLevelColor(level: EmergencyLevel): string {
  const colors: Record<EmergencyLevel, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[level] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function emergencyLevelLabel(level: EmergencyLevel): string {
  const labels: Record<EmergencyLevel, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[level] || level;
}

export function deliveryStatusColor(status: DeliveryStatus): string {
  const colors: Record<DeliveryStatus, string> = {
    assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    picked_up: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    in_transit: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export function deliveryStatusLabel(status: DeliveryStatus): string {
  const labels: Record<DeliveryStatus, string> = {
    assigned: 'Assigned',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    failed: 'Failed',
  };
  return labels[status] || status;
}

export function notificationTypeColor(type: NotificationType): string {
  const colors: Record<NotificationType, string> = {
    donation: 'bg-green-100 text-green-600',
    request: 'bg-blue-100 text-blue-600',
    delivery: 'bg-purple-100 text-purple-600',
    system: 'bg-gray-100 text-gray-600',
    emergency: 'bg-red-100 text-red-600',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
}

// ============================================================
// Utility Functions
// ============================================================

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getExpiryUrgency(expiryDate: string): 'safe' | 'soon' | 'urgent' {
  const now = new Date();
  const expiry = parseISO(expiryDate);
  const hoursLeft = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursLeft < 0) return 'urgent';
  if (hoursLeft < 4) return 'urgent';
  if (hoursLeft < 12) return 'soon';
  return 'safe';
}

export function expiryUrgencyColor(urgency: 'safe' | 'soon' | 'urgent'): string {
  const colors = {
    safe: 'text-green-600',
    soon: 'text-yellow-600',
    urgent: 'text-red-600',
  };
  return colors[urgency];
}

// ============================================================
// Supabase Auth Helpers
// ============================================================

/** Turn raw Supabase auth errors into messages users can act on. */
export function friendlyAuthError(message: string): string {
  const m = (message || '').toLowerCase();
  if (m.includes('rate limit')) {
    return 'Too many attempts — the free plan only allows a few signup emails per hour. Please wait about an hour and try again.';
  }
  if (m.includes('already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (m.includes('not confirmed')) {
    return 'Please confirm your email first — open the link we sent you (check your spam folder), then log in.';
  }
  if (m.includes('invalid login') || m.includes('invalid credentials')) {
    return 'Invalid email or password.';
  }
  if (m.includes('password')) {
    return 'Password is too weak — use at least 8 characters.';
  }
  if (m.includes('valid email')) return 'Please enter a valid email address.';
  if (m.includes('provider')) {
    return 'This sign-in option is not enabled for this project.';
  }
  if (m.includes('network')) {
    return 'Network error — check your connection and try again.';
  }
  return message || 'Something went wrong. Please try again.';
}

export async function getAuthUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(): Promise<User | null> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !data) return null;
  return data as User;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'ngo': return '/ngo';
    case 'volunteer': return '/volunteer';
    default: return '/donor';
  }
}
