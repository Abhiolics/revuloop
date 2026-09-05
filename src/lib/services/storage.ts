import { generateId } from "@/lib/utils";

// Mock data interfaces
export interface Business {
  id: string;
  name: string;
  displayName: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  locations: Location[];
  plan: 'free' | 'starter' | 'growth' | 'multi-location';
  planStatus: 'active' | 'past_due' | 'canceled';
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  googlePlaceId?: string;
  isDefault: boolean;
}

export interface QrCode {
  id: string;
  businessId: string;
  locationId: string;
  name: string;
  url: string;
  scanCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Feedback {
  id: string;
  businessId: string;
  locationId: string;
  qrCodeId?: string;
  rating: number;
  comment?: string;
  tags: string[];
  customerName?: string;
  customerContact?: string;
  marketingConsent: boolean;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
  createdAt: string;
  resolvedAt?: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  contact: string;
  firstVisit: string;
  lastVisit: string;
  totalFeedback: number;
  averageRating: number;
  marketingConsent: boolean;
  tags: string[];
}

export interface AppState {
  isInitialized: boolean;
  currentUser: { email: string; isAuthenticated: boolean } | null;
  business: Business | null;
  qrCodes: QrCode[];
  feedbacks: Feedback[];
  customers: Customer[];
}

const defaultState: AppState = {
  isInitialized: false,
  currentUser: null,
  business: null,
  qrCodes: [],
  feedbacks: [],
  customers: [],
};

const STORAGE_KEY = 'revuloop_app_state_v1';

export const storage = {
  get: (): AppState => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : defaultState;
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
      return defaultState;
    }
  },
  set: (state: AppState) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  },
  reset: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};
