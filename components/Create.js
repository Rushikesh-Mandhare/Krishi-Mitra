import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const Add = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigate = (screen) => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-slate-100`}>
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={tw`bg-blue-500 p-4 rounded-full absolute bottom-5 right-5 items-center justify-center`}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal with Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-5`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-xl font-bold`}>Add New</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Option Buttons */}
            <View style={tw`flex-row flex-wrap justify-between mb-4`}>
              {/* Expense Button */}
              <TouchableOpacity
                style={tw`w-1/2 p-2`}
                onPress={() => handleNavigate('ExpenseForm')}>
                <View style={tw`bg-red-100 rounded-xl p-4 items-center`}>
                  <MaterialCommunityIcons name="cash-minus" size={36} color="#F44336" />
                  <Text style={tw`mt-2 font-medium text-gray-800`}>Expense</Text>
                </View>
              </TouchableOpacity>

              {/* Income Button */}
              <TouchableOpacity
                style={tw`w-1/2 p-2`}
                onPress={() => handleNavigate('ExpenseForm')}>
                <View style={tw`bg-green-100 rounded-xl p-4 items-center`}>
                  <MaterialCommunityIcons name="cash-plus" size={36} color="#4CAF50" />
                  <Text style={tw`mt-2 font-medium text-gray-800`}>Income</Text>
                </View>
              </TouchableOpacity>

              {/* Crop Button */}
              <TouchableOpacity
                style={tw`w-1/2 p-2`}
                onPress={() => handleNavigate('AddForm')}>
                <View style={tw`bg-blue-100 rounded-xl p-4 items-center`}>
                  <MaterialCommunityIcons name="leaf" size={36} color="#2196F3" />
                  <Text style={tw`mt-2 font-medium text-gray-800`}>Crop</Text>
                </View>
              </TouchableOpacity>

              {/* Notes Button */}
              <TouchableOpacity
                style={tw`w-1/2 p-2`}
                onPress={() => handleNavigate('AddForm')}>
                <View style={tw`bg-yellow-100 rounded-xl p-4 items-center`}>
                  <MaterialCommunityIcons name="note-text" size={36} color="#FFC107" />
                  <Text style={tw`mt-2 font-medium text-gray-800`}>Notes</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Add;