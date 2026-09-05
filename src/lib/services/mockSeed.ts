import { storage, AppState, Business, Location, QrCode, Feedback, Customer } from './storage';
import { generateId } from '@/lib/utils';

export function seedDemoData() {
  const state = storage.get();
  
  if (state.business) return; // Already seeded

  const businessId = generateId();
  const locationId = generateId();
  const qrCodeId = generateId();
  
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  
  const demoBusiness: Business = {
    id: businessId,
    name: 'The Royal Cafe Pvt Ltd',
    displayName: 'The Royal Café',
    category: 'Restaurant',
    ownerName: 'Arjun Mehta',
    email: 'owner@royalcafe.demo',
    phone: '+91 9876543210',
    plan: 'growth',
    planStatus: 'active',
    createdAt: daysAgo(30),
    locations: [
      {
        id: locationId,
        name: 'Hazratganj Branch',
        address: '123 MG Road, Hazratganj',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pinCode: '226001',
        isDefault: true,
      }
    ]
  };
  
  const demoQr: QrCode = {
    id: qrCodeId,
    businessId,
    locationId,
    name: 'Billing Counter',
    url: `https://revuloop.demo/r/the-royal-cafe`,
    scanCount: 142,
    status: 'active',
    createdAt: daysAgo(29),
  };

  const demoFeedbacks: Feedback[] = [
    {
      id: generateId(),
      businessId,
      locationId,
      qrCodeId,
      rating: 5,
      comment: 'Amazing food and quick service! Will definitely come back.',
      tags: ['Food Quality', 'Service'],
      customerName: 'Priya S.',
      customerContact: 'priya@example.com',
      marketingConsent: true,
      status: 'resolved',
      createdAt: daysAgo(1),
      resolvedAt: daysAgo(0.5)
    },
    {
      id: generateId(),
      businessId,
      locationId,
      qrCodeId,
      rating: 2,
      comment: 'The soup was cold and it took too long to get the bill.',
      tags: ['Service', 'Wait Time'],
      customerName: 'Rahul',
      customerContact: '+91 9123456789',
      marketingConsent: false,
      status: 'new',
      createdAt: daysAgo(0.1)
    },
    {
      id: generateId(),
      businessId,
      locationId,
      qrCodeId,
      rating: 4,
      comment: 'Great ambience. The new dessert menu is fantastic.',
      tags: ['Ambience', 'Menu'],
      marketingConsent: false,
      status: 'new',
      createdAt: daysAgo(2)
    }
  ];

  const demoCustomers: Customer[] = [
    {
      id: generateId(),
      businessId,
      name: 'Priya S.',
      contact: 'priya@example.com',
      firstVisit: daysAgo(20),
      lastVisit: daysAgo(1),
      totalFeedback: 3,
      averageRating: 4.6,
      marketingConsent: true,
      tags: ['VIP', 'Dessert Lover']
    }
  ];

  const newState: AppState = {
    isInitialized: true,
    currentUser: { email: 'owner@royalcafe.demo', isAuthenticated: true },
    business: demoBusiness,
    qrCodes: [demoQr],
    feedbacks: demoFeedbacks,
    customers: demoCustomers,
  };

  storage.set(newState);
}
