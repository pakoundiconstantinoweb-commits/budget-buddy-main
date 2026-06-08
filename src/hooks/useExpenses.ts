import { useState, useEffect, useCallback } from 'react';
import { Expense, CategoryType } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

// Sample data for demo - Fixed data for consistency
const generateSampleData = (): Expense[] => {
  const expenses: Expense[] = [
    {
      id: 'sample-1',
      amount: 85.50,
      category: 'food',
      date: '2025-12-15',
      comment: 'Courses de la semaine',
      createdAt: '2025-12-15T10:30:00.000Z',
    },
    {
      id: 'sample-2',
      amount: 75.00,
      category: 'transport',
      date: '2025-12-14',
      comment: 'Métro mensuel',
      createdAt: '2025-12-14T09:00:00.000Z',
    },
    {
      id: 'sample-3',
      amount: 850.00,
      category: 'housing',
      date: '2025-12-01',
      comment: 'Loyer décembre',
      createdAt: '2025-12-01T08:00:00.000Z',
    },
    {
      id: 'sample-4',
      amount: 45.00,
      category: 'leisure',
      date: '2025-12-13',
      comment: 'Cinéma avec amis',
      createdAt: '2025-12-13T19:00:00.000Z',
    },
    {
      id: 'sample-5',
      amount: 120.00,
      category: 'shopping',
      date: '2025-12-12',
      comment: 'Vêtements soldes',
      createdAt: '2025-12-12T14:30:00.000Z',
    },
    {
      id: 'sample-6',
      amount: 35.00,
      category: 'health',
      date: '2025-12-11',
      comment: 'Pharmacie',
      createdAt: '2025-12-11T11:00:00.000Z',
    },
    {
      id: 'sample-7',
      amount: 150.00,
      category: 'education',
      date: '2025-12-10',
      comment: 'Livres universitaires',
      createdAt: '2025-12-10T16:00:00.000Z',
    },
    {
      id: 'sample-8',
      amount: 25.00,
      category: 'other',
      date: '2025-12-09',
      comment: 'Divers',
      createdAt: '2025-12-09T10:00:00.000Z',
    },
    {
      id: 'sample-9',
      amount: 32.00,
      category: 'food',
      date: '2025-12-08',
      comment: 'Restaurant midi',
      createdAt: '2025-12-08T12:30:00.000Z',
    },
    {
      id: 'sample-10',
      amount: 60.00,
      category: 'transport',
      date: '2025-12-07',
      comment: 'Essence voiture',
      createdAt: '2025-12-07T08:00:00.000Z',
    },
    {
      id: 'sample-11',
      amount: 95.00,
      category: 'housing',
      date: '2025-12-06',
      comment: 'Électricité',
      createdAt: '2025-12-06T15:00:00.000Z',
    },
    {
      id: 'sample-12',
      amount: 55.00,
      category: 'leisure',
      date: '2025-12-05',
      comment: 'Concert',
      createdAt: '2025-12-05T20:00:00.000Z',
    },
    {
      id: 'sample-13',
      amount: 40.00,
      category: 'shopping',
      date: '2025-12-04',
      comment: 'Cadeau anniversaire',
      createdAt: '2025-12-04T10:00:00.000Z',
    },
    {
      id: 'sample-14',
      amount: 80.00,
      category: 'health',
      date: '2025-12-03',
      comment: 'Dentiste',
      createdAt: '2025-12-03T09:30:00.000Z',
    },
    {
      id: 'sample-15',
      amount: 45.00,
      category: 'education',
      date: '2025-12-02',
      comment: 'Fournitures scolaires',
      createdAt: '2025-12-02T14:00:00.000Z',
    },
  ];

  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Always use fixed sample data for consistency across all deployments
    const sampleData = generateSampleData();
    setExpenses(sampleData);
    setIsLoading(false);
  }, []);

  const saveExpenses = useCallback((newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    saveExpenses(updated);
    return newExpense;
  }, [expenses, saveExpenses]);

  const deleteExpense = useCallback((id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const updateExpense = useCallback((id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    const updated = expenses.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    saveExpenses(updated);
  }, [expenses, saveExpenses]);

  const getExpensesByPeriod = useCallback((startDate: Date, endDate: Date) => {
    return expenses.filter(e => {
      const date = new Date(e.date);
      return date >= startDate && date <= endDate;
    });
  }, [expenses]);

  const getTotalByCategory = useCallback((categoryFilter?: CategoryType, startDate?: Date, endDate?: Date) => {
    let filtered = expenses;
    
    if (startDate && endDate) {
      filtered = getExpensesByPeriod(startDate, endDate);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }
    
    return filtered.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, getExpensesByPeriod]);

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    getExpensesByPeriod,
    getTotalByCategory,
  };
};
