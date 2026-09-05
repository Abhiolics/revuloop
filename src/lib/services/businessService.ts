import { storage, Business, Location } from './storage';
import { delay, generateId } from '@/lib/utils';

export const businessService = {
  createBusiness: async (data: Omit<Business, 'id' | 'locations' | 'plan' | 'planStatus' | 'createdAt'>, initialLocation: Omit<Location, 'id'>) => {
    await delay(1000);
    const state = storage.get();
    
    const location: Location = {
      ...initialLocation,
      id: generateId(),
    };
    
    const business: Business = {
      ...data,
      id: generateId(),
      locations: [location],
      plan: 'free',
      planStatus: 'active',
      createdAt: new Date().toISOString()
    };
    
    state.business = business;
    storage.set(state);
    return business;
  },
  
  getBusiness: async () => {
    await delay(500);
    return storage.get().business;
  },

  updateBusiness: async (updates: Partial<Business>) => {
    await delay(600);
    const state = storage.get();
    if (!state.business) throw new Error('Business not found');
    
    state.business = { ...state.business, ...updates };
    storage.set(state);
    return state.business;
  }
};
