import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import tw from 'twrnc';
import { supabase } from '../supabaseClient'; // Import Supabase client
import * as Location from 'expo-location'; // Import Expo Location
import PopUpComponent from '../charts/PopUp'; // Import PopUpComponent

const SignupPage = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [confirmMobileNumber, setConfirmMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null); // State to store user's location
  const [popupVisible, setPopupVisible] = useState(false); // State to handle popup visibility
  const [popupMessage, setPopupMessage] = useState(''); // State to store popup message

  const handleSignup = async () => {
    if (mobileNumber !== confirmMobileNumber) {
      setPopupMessage("Mobile numbers don't match!");
      setPopupVisible(true);
      return;
    }
    if (password !== confirmPassword) {
      setPopupMessage("Passwords don't match!");
      setPopupVisible(true);
      return;
    }

    setLoading(true);

    // Request location permission
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPopupMessage('Permission to access location was denied');
      setPopupVisible(true);
      setLoading(false);
      return;
    }

    // Get current location
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);

    // Check if mobile number is already registered
    const { data: existingUser, error: userCheckError } = await supabase
      .from('farmers')
      .select('*')
      .eq('mobile_number', mobileNumber);

    if (existingUser && existingUser.length > 0) {
      setPopupMessage('Mobile number is already registered!');
      setPopupVisible(true);
      setLoading(false);
      return;
    }

    // Insert signup details along with location into Supabase
    const { data, error } = await supabase
      .from('farmers') // Replace 'farmers' with your actual table name
      .insert([
        {
          name,
          mobile_number: mobileNumber,
          password, // Ensure to hash or encrypt passwords in production
          location_access: true, // Store location access as true
          latitude: loc.coords.latitude,  // Store latitude
          longitude: loc.coords.longitude, // Store longitude
        },
      ]);

    if (error) {
      setPopupMessage('Signup failed. Please try again.');
    } else {
      setPopupMessage('Signup successful!');
      navigation.navigate('Login'); // Navigate to Login page after signup
    }

    setPopupVisible(true);
    setLoading(false);
  };

  return (
    <View style={tw`flex-1 justify-center px-6 bg-slate-100`}>
      {/* Title */}
      <Text style={tw`text-3xl font-bold text-center text-black mb-8`}>
        Signup
      </Text>

      {/* Name Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Mobile Number Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />

      {/* Confirm Mobile Number Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Confirm Mobile Number"
        value={confirmMobileNumber}
        onChangeText={setConfirmMobileNumber}
        keyboardType="phone-pad"
      />

      {/* Password Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Confirm Password Input */}
      <TextInput
        style={tw`border border-gray-400 rounded-lg py-4 px-6 mb-4 text-lg`}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignup}
        style={tw`bg-blue-500 py-4 rounded-xl mb-6 mx-10`}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg`}>Signup</Text>
        )}
      </TouchableOpacity>

      {/* Back to Login Button */}
      <View style={tw`flex-row justify-center mt-4`}>
        <Text style={tw`text-gray-600`}>Are you existing user? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={tw`text-blue-500 font-semibold`}>Go to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Popup Component */}
      <PopUpComponent
        message={popupMessage}
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
      />
    </View>
  );
};

export default SignupPage;
