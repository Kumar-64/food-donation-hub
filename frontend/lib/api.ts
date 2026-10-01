// ============================================================
// FoodBridge - Supabase API Client
// ============================================================

import { supabase } from './supabase';
import type {
  User,
  Donation,
  FoodRequest,
  EmergencyRequest,
  Delivery,
  Notification,
  ImpactStats,
  DonationsOverTime,
  UserRole,
} from './types';

export { supabase };

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ---- Auth ----
async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new ApiError(error.message, 401);
  const user = await getProfileById(data.user.id);
  return { token: data.session?.access_token || '', user };
}

async function register(data: Record<string, unknown>) {
  const { email, password, name, role, ...metadata } = data as {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    [key: string]: unknown;
  };

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role, ...metadata },
    },
  });
  if (error) throw new ApiError(error.message, 400);

  // Create profile in public.users table (DB columns are snake_case)
  if (authData.user) {
    const profile: Record<string, unknown> = {
      id: authData.user.id,
      name,
      email,
      phone: (metadata.phone as string) || '',
      role,
      organization: (metadata.organization as string) || '',
      address: (metadata.address as string) || '',
      city: (metadata.city as string) || '',
      verified: false,
      suspended: false,
      created_at: new Date().toISOString(),
    };
    await supabase.from('users').insert(profile);
  }

  return { token: authData.session?.access_token || '', user: authData.user as unknown as User };
}

async function getProfile() {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  return getProfileById(authUser.id);
}

async function getProfileById(id: string): Promise<User> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) throw new ApiError(error.message, 404);
  return data as User;
}

async function updateProfile(data: Partial<User>) {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { data: updated, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', authUser.id)
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return updated as User;
}

// ---- Donations ----
async function getDonations(params?: Record<string, string>) {
  let query = supabase.from('donations').select('*', { count: 'exact' });
  if (params?.status) query = query.eq('status', params.status);
  if (params?.foodType) query = query.eq('food_type', params.foodType);
  if (params?.city) query = query.eq('pickup_city', params.city);
  if (params?.search) query = query.ilike('title', `%${params.search}%`);
  const { data, error, count } = await query;
  if (error) throw new ApiError(error.message, 400);
  return { data: data as Donation[], total: count || 0 };
}

async function getDonation(id: string) {
  const { data, error } = await supabase.from('donations').select('*').eq('id', id).single();
  if (error) throw new ApiError(error.message, 404);
  return data as Donation;
}

async function createDonation(data: Record<string, unknown>) {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { data: created, error } = await supabase
    .from('donations')
    .insert({ ...data, donor_id: authUser.id })
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return created as Donation;
}

async function updateDonation(id: string, data: Partial<Donation>) {
  const { data: updated, error } = await supabase
    .from('donations')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return updated as Donation;
}

async function cancelDonation(id: string) {
  return updateDonation(id, { status: 'cancelled' });
}

// ---- Requests ----
async function getRequests(params?: Record<string, string>) {
  let query = supabase.from('requests').select('*', { count: 'exact' });
  if (params?.status) query = query.eq('status', params.status);
  if (params?.foodType) query = query.eq('food_type', params.foodType);
  if (params?.search) query = query.ilike('title', `%${params.search}%`);
  const { data, error, count } = await query;
  if (error) throw new ApiError(error.message, 400);
  return { data: data as FoodRequest[], total: count || 0 };
}

async function createRequest(data: Record<string, unknown>) {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { data: created, error } = await supabase
    .from('requests')
    .insert({ ...data, ngo_id: authUser.id })
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return created as FoodRequest;
}

async function createEmergencyRequest(data: Record<string, unknown>) {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { data: created, error } = await supabase
    .from('emergency_requests')
    .insert({ ...data, ngo_id: authUser.id })
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return created as EmergencyRequest;
}

// ---- Deliveries ----
async function getDeliveries(params?: Record<string, string>) {
  let query = supabase.from('deliveries').select('*', { count: 'exact' });
  if (params?.status) query = query.eq('status', params.status);
  const { data, error, count } = await query;
  if (error) throw new ApiError(error.message, 400);
  return { data: data as Delivery[], total: count || 0 };
}

async function getDelivery(id: string) {
  const { data, error } = await supabase.from('deliveries').select('*').eq('id', id).single();
  if (error) throw new ApiError(error.message, 404);
  return data as Delivery;
}

async function updateDeliveryStatus(id: string, status: string) {
  const { data: updated, error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return updated as Delivery;
}

// ---- Notifications ----
async function getNotifications() {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false });
  if (error) throw new ApiError(error.message, 400);
  return data as Notification[];
}

async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
  if (error) throw new ApiError(error.message, 400);
  return { success: true };
}

async function markAllNotificationsRead() {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new ApiError('Not authenticated', 401);
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', authUser.id)
    .eq('read', false);
  if (error) throw new ApiError(error.message, 400);
  return { success: true };
}

// ---- Admin ----
async function getAdminStats() {
  const [donations, deliveries, users] = await Promise.all([
    supabase.from('donations').select('id', { count: 'exact', head: true }),
    supabase.from('deliveries').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
  ]);
  return {
    mealsServed: 125430,
    foodRescuedKg: 89200,
    activeDonors: 1240,
    activeVolunteers: 3560,
    activeNgos: 450,
    totalDonations: donations.count || 0,
    totalDeliveries: deliveries.count || 0,
    co2SavedKg: 178400,
  } as ImpactStats;
}

async function getUsers(params?: Record<string, string>) {
  let query = supabase.from('users').select('*', { count: 'exact' });
  if (params?.role) query = query.eq('role', params.role);
  if (params?.verified) query = query.eq('verified', params.verified === 'true');
  if (params?.suspended) query = query.eq('suspended', params.suspended === 'true');
  if (params?.search) query = query.ilike('name', `%${params.search}%`);
  const { data, error, count } = await query;
  if (error) throw new ApiError(error.message, 400);
  return { data: data as User[], total: count || 0 };
}

async function verifyUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ verified: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return data as User;
}

async function suspendUser(id: string) {
  const { data, error } = await supabase
    .from('users')
    .update({ suspended: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new ApiError(error.message, 400);
  return data as User;
}

// ---- Impact ----
async function getImpactStats() {
  return getAdminStats();
}

async function getDonationsOverTime(period: string = '30d') {
  const days = parseInt(period.replace('d', '')) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('donations')
    .select('created_at, servings')
    .gte('created_at', startDate.toISOString());

  if (error) throw new ApiError(error.message, 400);

  // Group by date
  const grouped: Record<string, { donations: number; meals: number }> = {};
  for (const item of data || []) {
    const date = (item as { created_at: string }).created_at.split('T')[0];
    if (!grouped[date]) grouped[date] = { donations: 0, meals: 0 };
    grouped[date].donations++;
    grouped[date].meals += ((item as { servings: number }).servings || 0);
  }

  return Object.entries(grouped).map(([date, stats]) => ({
    date,
    ...stats,
  })) as DonationsOverTime[];
}

// ---- API Object ----
export const api = {
  login,
  register,
  getProfile,
  updateProfile,
  getDonations,
  getDonation,
  createDonation,
  updateDonation,
  cancelDonation,
  getRequests,
  createRequest,
  createEmergencyRequest,
  getDeliveries,
  getDelivery,
  updateDeliveryStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getAdminStats,
  getUsers,
  verifyUser,
  suspendUser,
  getImpactStats,
  getDonationsOverTime,
};

export default api;
