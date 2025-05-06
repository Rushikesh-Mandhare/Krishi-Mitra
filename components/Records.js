import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import PieChartComponent from '../charts/piechart';
import useTransactions from '../data/transactionData';
import tw from 'twrnc';

const Records = () => {
  const navigation = useNavigation();
  const { transactions, loading, summary, pieChartData, categoryChartData, refresh } = useTransactions();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'expenses', 'income'

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Format currency to Indian Rupees
  const formatCurrency = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  // Format date to local string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'overview') return true;
    if (activeTab === 'expenses') return transaction.type === 'expense';
    if (activeTab === 'income') return transaction.type === 'income';
    return true;
  });

  // Transaction item component
  const TransactionItem = ({ item }) => (
    <View style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}>
      <View style={tw`flex-row items-center`}>
        <View 
          style={tw`w-10 h-10 rounded-full ${item.type === 'expense' ? 'bg-red-100' : 'bg-green-100'} items-center justify-center mr-3`}
        >
          <MaterialCommunityIcons 
            name={getCategoryIcon(item.category)} 
            size={20} 
            color={item.type === 'expense' ? '#F44336' : '#4CAF50'} 
          />
        </View>
        <View>
          <Text style={tw`font-bold text-base`}>
            {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('_', ' ')}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>{formatDate(item.date)}</Text>
          {item.description ? (
            <Text style={tw`text-sm text-gray-600 mt-1`}>{item.description}</Text>
          ) : null}
        </View>
      </View>
      <Text 
        style={tw`font-bold text-base ${item.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}
      >
        {item.type === 'expense' ? '- ' : '+ '}
        {formatCurrency(item.amount)}
      </Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-slate-100`}>
      {/* Summary Cards */}
      <ScrollView 
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={tw`flex-row justify-between items-center p-4`}>
          <Text style={tw`text-2xl font-bold`}>Financial Overview</Text>
          <TouchableOpacity 
            style={tw`bg-blue-500 p-2 rounded-full`}
            onPress={() => navigation.navigate('ExpenseForm')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={tw`flex-row justify-between px-4 mb-4`}>
          <View style={tw`bg-white rounded-lg p-4 shadow w-30 flex-1 mr-2`}>
            <Text style={tw`text-sm text-gray-500`}>Income</Text>
            <Text style={tw`text-lg font-bold text-green-500`}>{formatCurrency(summary.totalIncome)}</Text>
          </View>
          <View style={tw`bg-white rounded-lg p-4 shadow w-30 flex-1 mx-2`}>
            <Text style={tw`text-sm text-gray-500`}>Expenses</Text>
            <Text style={tw`text-lg font-bold text-red-500`}>{formatCurrency(summary.totalExpense)}</Text>
          </View>
          <View style={tw`bg-white rounded-lg p-4 shadow w-30 flex-1 ml-2`}>
            <Text style={tw`text-sm text-gray-500`}>Balance</Text>
            <Text 
              style={tw`text-lg font-bold ${summary.balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}
            >
              {formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={tw`bg-white rounded-lg mx-4 mb-4 p-4 shadow`}>
          <Text style={tw`text-lg font-bold mb-2`}>Income vs Expenses</Text>
          {transactions.length > 0 ? (
            <PieChartComponent data={pieChartData} />
          ) : (
            <View style={tw`items-center justify-center p-8`}>
              <Text style={tw`text-gray-500`}>No transactions yet</Text>
            </View>
          )}
        </View>

        {/* Category Chart Section */}
        {categoryChartData.length > 0 && (
          <View style={tw`bg-white rounded-lg mx-4 mb-4 p-4 shadow`}>
            <Text style={tw`text-lg font-bold mb-2`}>Expense Breakdown</Text>
            <PieChartComponent data={categoryChartData} />
          </View>
        )}

        {/* Transactions Section */}
        <View style={tw`bg-white rounded-lg mx-4 mb-4 shadow`}>
          <View style={tw`flex-row border-b border-gray-200`}>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'overview' ? 'text-blue-500' : 'text-gray-600'}`}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'expenses' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('expenses')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'expenses' ? 'text-blue-500' : 'text-gray-600'}`}>Expenses</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 p-3 ${activeTab === 'income' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('income')}
            >
              <Text style={tw`text-center font-medium ${activeTab === 'income' ? 'text-blue-500' : 'text-gray-600'}`}>Income</Text>
            </TouchableOpacity>
          </View>
          
          <View style={tw`max-h-96`}>
            {filteredTransactions.length > 0 ? (
              <FlatList
                data={filteredTransactions}
                renderItem={({ item }) => <TransactionItem item={item} />}
                keyExtractor={item => item.id}
                scrollEnabled={true}
              />
            ) : (
              <View style={tw`items-center justify-center p-8`}>
                <Text style={tw`text-gray-500`}>No transactions to display</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper function to determine icon based on category
const getCategoryIcon = (category) => {
  const icons = {
    seeds: 'seed',
    fertilizer: 'leaf',
    pesticides: 'spray',
    equipment: 'tractor',
    labor: 'account-group',
    irrigation: 'water',
    crop_sale: 'crop',
    subsidy: 'bank',
    rental_income: 'home',
    other: 'help-circle',
  };
  
  return icons[category] || 'cash';
};

export default Records;