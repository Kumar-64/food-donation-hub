// ============================================================
// FoodBridge - TypeScript Type Definitions
// ============================================================

export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type DonationStatus =
  | 'pending'
  | 'matched'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type RequestStatus =
  | 'open'
  | 'matched'
  | 'fulfilled'
  | 'cancelled';

export type EmergencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type DeliveryStatus =
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'failed';

export type NotificationType =
  | 'donation'
  | 'request'
  | 'delivery'
  | 'system'
  | 'emergency';

// ---- User ----
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  address?: string;
  city?: string;
  verified: boolean;
  suspended: boolean;
  createdAt: string;
  lastLogin?: string;
}

// ---- Donation ----
export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorOrganization?: string;
  title: string;
  description: string;
  foodType: string;
  quantity: number;
  unit: string;
  servings: number;
  expiryDate: string;
  pickupAddress: string;
  pickupCity: string;
  pickupWindow: string;
  status: DonationStatus;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  matchedRequestId?: string;
  matchedNgoName?: string;
  volunteerId?: string;
  volunteerName?: string;
  notes?: string;
}

// ---- Food Request ----
export interface FoodRequest {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  foodType: string;
  quantityNeeded: number;
  unit: string;
  servingsNeeded: number;
  urgency: EmergencyLevel;
  neededByDate: string;
  deliveryAddress: string;
  deliveryCity: string;
  status: RequestStatus;
  createdAt: string;
  matchedDonationId?: string;
}

// ---- Emergency Request ----
export interface EmergencyRequest {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  peopleAffected: number;
  foodType: string;
  quantityNeeded: number;
  unit: string;
  level: EmergencyLevel;
  neededByDate: string;
  deliveryAddress: string;
  deliveryCity: string;
  status: RequestStatus;
  createdAt: string;
  resolvedAt?: string;
}

// ---- Delivery ----
export interface Delivery {
  id: string;
  donationId: string;
  volunteerId: string;
  volunteerName: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: DeliveryStatus;
  assignedAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedArrival?: string;
  notes?: string;
}

// ---- Notification ----
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

// ---- Activity / History ----
export interface Activity {
  id: string;
  type: 'donation' | 'request' | 'delivery';
  title: string;
  description: string;
  status: string;
  date: string;
  metadata?: Record<string, string>;
}

// ---- Impact Stats ----
export interface ImpactStats {
  mealsServed: number;
  foodRescuedKg: number;
  activeDonors: number;
  activeVolunteers: number;
  activeNgos: number;
  totalDonations: number;
  totalDeliveries: number;
  co2SavedKg: number;
}

// ---- Chart Data ----
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DonationsOverTime {
  date: string;
  donations: number;
  meals: number;
}

// ---- KPI ----
export interface KpiCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

// ---- Map Location ----
export interface MapLocation {
  lat: number;
  lng: number;
  label: string;
}

// ---- Paginated Response ----
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- API Response ----
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ---- Filter Options ----
export interface DonationFilters {
  status?: DonationStatus;
  foodType?: string;
  dateFrom?: string;
  dateTo?: string;
  city?: string;
  search?: string;
}

export interface UserFilters {
  role?: UserRole;
  verified?: boolean;
  suspended?: boolean;
  search?: string;
}
