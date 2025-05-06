// transactionData.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sample initial transactions data
const initialTransactions = [
  {
    id: '1',
    type: 'expense',
    amount: 2000,
    category: 'seeds',
    description: 'Winter wheat seeds',
    date: new Date('2025-05-01'),
  },
  {
    id: '2',
    type: 'expense',
    amount: 3500,
    category: 'fertilizer',
    description: 'Organic fertilizer',
    date: new Date('2025-05-02'),
  },
  {
    id: '3',
    type: 'income',
    amount: 10000,
    category: 'crop_sale',
    description: 'Sold rice harvest',
    date: new Date('2025-05-03'),
  },
  {
    id: '4',
    type: 'expense',
    amount: 1500,
    category: 'labor',
    description: 'Hired help for planting',
    date: new Date('2025-05-04'),
  },
];

// Key for storing data in AsyncStorage
const TRANSACTIONS_STORAGE_KEY = 'farmer_transactions';

// Initialize transactions with sample data if storage is empty
const initializeTransactions = async () => {
  try {
    const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!storedTransactions) {
      await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialTransactions));
      return initialTransactions;
    }
    return JSON.parse(storedTransactions);
  } catch (error) {
    console.error('Error initializing transactions:', error);
    return initialTransactions;
  }
};

// Add a new transaction
export const addTransaction = async (transaction) => {
  try {
    const currentTransactions = await getTransactions();
    const updatedTransactions = [transaction, ...currentTransactions];
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    return updatedTransactions;
  } catch (error) {
    console.error('Error adding transaction:', error);
    return null;
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (transactions) {
      return JSON.parse(transactions);
    }
    // If no transactions found, initialize with sample data
    return initializeTransactions();
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

// Delete a transaction
export const deleteTransaction = async (transactionId) => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
    await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
    return updatedTransactions;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return null;
  }
};

// Custom hook to manage transactions state
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Calculate summary statistics
  const summary = {
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
  };

  summary.balance = summary.totalIncome - summary.totalExpense;

  // Get data for pie chart
  const pieChartData = [
    { name: 'Income', value: summary.totalIncome, color: '#4CAF50' },
    { name: 'Expense', value: summary.totalExpense, color: '#F44336' },
  ];

  // Get category breakdown for expenses
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((categories, t) => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += t.amount;
      return categories;
    }, {});

  // Format category data for charts
  const categoryChartData = Object.keys(expenseCategories).map((category, index) => ({
    name: category,
    value: expenseCategories[category],
    color: getColorForCategory(category, index),
  }));

  return { 
    transactions, 
    loading, 
    error, 
    summary,
    pieChartData,
    categoryChartData,
    refresh: async () => {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    },
    addTransaction: async (transaction) => {
      const updatedTransactions = await addTransaction(transaction);
      if (updatedTransactions) {
        setTransactions(updatedTransactions);
      }
      return updatedTransactions;
    },
    deleteTransaction: async (id) => {
      const updatedTransactions = await deleteTransaction(id);
      if (updatedTransactions) {
        setTransactions(updatedTransactions);
      }
      return updatedTransactions;
    }
  };
};

// Helper function to get colors for categories
const getColorForCategory = (category, index) => {
  const colors = {
    seeds: '#8BC34A', // Light Green
    fertilizer: '#009688', // Teal
    pesticides: '#FF5722', // Deep Orange
    equipment: '#3F51B5', // Indigo
    labor: '#9C27B0', // Purple
    irrigation: '#03A9F4', // Light Blue
    crop_sale: '#4CAF50', // Green
    subsidy: '#2196F3', // Blue
    rental_income: '#FFEB3B', // Yellow
    other: '#607D8B', // Blue Grey
  };

  return colors[category] || `hsl(${index * 40}, 70%, 50%)`; // Fallback color
};

export default useTransactions;