import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'annual';
  features: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'canceled';
  startDate: string;
  endDate: string;
}

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  isSubscriptionActive: boolean;
  initiatePayment: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// Mock data - In a real application, this would come from an API
const mockPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Standard Monthly',
    price: 20000,
    period: 'monthly',
    features: [
      'Unlimited products',
      'Up to 3 warehouses',
      'Basic reporting',
      'Email support'
    ]
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    price: 199000,
    period: 'annual',
    features: [
      'Unlimited products',
      'Unlimited warehouses',
      'Advanced reporting & analytics',
      'Priority support',
      
    ]
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    planId: 'annual',
    status: 'active',
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z'
  }
];

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [plans] = useState<SubscriptionPlan[]>(mockPlans);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Update current subscription when user or subscriptions change
  useEffect(() => {
    if (user) {
      const userSubscription = subscriptions.find(
        sub => sub.userId === user.id && sub.status === 'active'
      ) || null;
      
      setCurrentSubscription(userSubscription);
    } else {
      setCurrentSubscription(null);
    }
  }, [user, subscriptions]);

  const isSubscriptionActive = !!currentSubscription && 
    new Date(currentSubscription.endDate) > new Date();

  const initiatePayment = async (planId: string) => {
    if (!user) {
      toast.error('You must be logged in to subscribe');
      throw new Error('Not authenticated');
    }
    
    const selectedPlan = plans.find(plan => plan.id === planId);
    if (!selectedPlan) {
      toast.error('Invalid subscription plan');
      throw new Error('Invalid plan');
    }
    
    // Simulate ePayco payment process
    // In a real application, this would redirect to ePayco's payment page
    toast.info('Redirecting to payment gateway...');
    
    // Simulate payment success after delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate subscription period based on plan
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (selectedPlan.period === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create new subscription
    const newSubscription: Subscription = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      planId: selectedPlan.id,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    // Update existing subscription to canceled if exists
    const updatedSubscriptions = subscriptions.map(sub => 
      (sub.userId === user.id && sub.status === 'active')
        ? { ...sub, status: 'canceled' }
        : sub
    );
    
    // Add new subscription
    setSubscriptions([...updatedSubscriptions, newSubscription]);
    toast.success(`Successfully subscribed to ${selectedPlan.name} plan!`);
  };

  const cancelSubscription = async () => {
    if (!user || !currentSubscription) {
      toast.error('No active subscription to cancel');
      throw new Error('No active subscription');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update subscription status
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === currentSubscription.id
          ? { ...sub, status: 'canceled' }
          : sub
      )
    );
    
    toast.info('Subscription canceled. You can continue using the service until your billing period ends.');
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        plans, 
        currentSubscription, 
        isSubscriptionActive, 
        initiatePayment, 
        cancelSubscription 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};