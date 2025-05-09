import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { addTransaction } from '../data/transactionData'; 
import Popup from './PopUp'; // Import the Popup component like in AddForm

const ExpenseForm = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'seeds',
    description: '',
    date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Categories for expenses and income
  const expenseCategories = ['seeds', 'fertilizer', 'pesticides', 'equipment', 'labor', 'irrigation', 'other'];
  const incomeCategories = ['crop_sale', 'subsidy', 'rental_income', 'other'];

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(false);
    setFormData({
      ...formData,
      date: currentDate,
    });
  };

  const handleSubmit = async () => {
    // Validate input
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setPopupMessage('Please enter a valid amount');
      setPopupVisible(true);
      return;
    }

    if (!formData.description.trim()) {
      setPopupMessage('Please enter a description');
      setPopupVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // Add transaction to Supabase
      const result = await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      if (result.success) {
        // Show success message and navigate back
        setPopupMessage('Transaction added successfully!');
        setPopupVisible(true);
        // Navigation will happen after closing the popup
      } else {
        console.error('Transaction error details:', result.error);
        setPopupMessage(`Failed to add transaction: ${result.error || 'Unknown error'}`);
        setPopupVisible(true);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      setPopupMessage('An unexpected error occurred. Please try again.');
      setPopupVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-100 p-4`}>
      <View style={tw`flex-row items-center mb-4`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold ml-2`}>Add Transaction</Text>
      </View>

      {/* Transaction Type Selector */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Transaction Type</Text>
        <View style={tw`flex-row`}>
          <TouchableOpacity 
            style={tw`flex-1 p-3 rounded-l-lg ${formData.type === 'expense' ? 'bg-red-500' : 'bg-gray-300'}`}
            onPress={() => handleInputChange('type', 'expense')}
          >
            <Text style={tw`text-center font-bold ${formData.type === 'expense' ? 'text-white' : 'text-gray-700'}`}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={tw`flex-1 p-3 rounded-r-lg ${formData.type === 'income' ? 'bg-green-500' : 'bg-gray-300'}`}
            onPress={() => handleInputChange('type', 'income')}
          >
            <Text style={tw`text-center font-bold ${formData.type === 'income' ? 'text-white' : 'text-gray-700'}`}>Income</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amount Input */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Amount (₹)</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 text-lg bg-white`}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={formData.amount}
          onChangeText={(value) => handleInputChange('amount', value)}
        />
      </View>

      {/* Category Selector */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Category</Text>
        <View style={tw`border border-gray-300 rounded-lg bg-white`}>
          <Picker
            selectedValue={formData.category}
            onValueChange={(value) => handleInputChange('category', value)}
            style={tw`h-12`}
          >
            {formData.type === 'expense'
              ? expenseCategories.map((category) => (
                  <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1)} value={category} />
                ))
              : incomeCategories.map((category) => (
                  <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')} value={category} />
                ))}
          </Picker>
        </View>
      </View>

      {/* Date Picker */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Date</Text>
        <TouchableOpacity 
          style={tw`border border-gray-300 rounded-lg p-3 flex-row items-center justify-between bg-white`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-lg`}>{formData.date.toDateString()}</Text>
          <Ionicons name="calendar" size={24} color="gray" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Description Input */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-lg font-semibold mb-2`}>Description</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3 text-lg h-24 bg-white`}
          placeholder="Enter description"
          multiline
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 rounded-lg p-4 mb-6 ${loading ? 'opacity-70' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={tw`text-white text-center text-lg font-bold`}>Save Transaction</Text>
        )}
      </TouchableOpacity>

      {/* Popup for displaying messages */}
      <Popup
        visible={popupVisible}
        message={popupMessage}
        onClose={() => {
          setPopupVisible(false);
          // Navigate back if the transaction was successful
          if (popupMessage === 'Transaction added successfully!') {
            navigation.goBack();
          }
        }}
      />
    </ScrollView>
  );
};

export default ExpenseForm;