import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import tw from 'twrnc'; // Importing TWRNC
import Animated, { Easing } from 'react-native-reanimated';

const PieChartComponent = ({ data }) => {
  const [selectedSlice, setSelectedSlice] = useState(null);

  const handleSlicePress = (slice) => {
    setSelectedSlice(slice);
  };

  // Transform data for pie chart
  const pieData = data.map((item) => ({
    value: item.value,
    svg: {
      fill: item.color,
      onPress: () => handleSlicePress(item),
      cornerRadius: 10,  // Adding corner radius here for smooth slice edges
    },
    key: item.label,
  }));

  // Calculate total value for the pie chart center label
  const totalValue = data.reduce((total, item) => total + item.value, 0);

  // Dimensions for responsiveness
  const { width } = Dimensions.get('window');
  const chartSize = width * 0.6; // 60% of screen width

  return (
    <View style={tw`p-4 bg-white rounded-lg shadow-md`}>
      <Text style={tw`text-xl font-bold text-center m-1`}>My Pie Chart</Text>
      <View style={tw`relative items-center`}>
        <Animated.View style={{ width: chartSize, height: chartSize }}>
          <PieChart
            style={{ height: '100%' }}
            data={pieData}
            innerRadius="30%"  // Inner radius remains the same
            outerRadius="100%"  // Outer radius remains the same
            padAngle={0.02}     // Padding angle between slices
            cornerRadius={10}    // Corner radius applied here for rounding
            animationDuration={500}
            animationEasing={Easing.out(Easing.exp)}
          />
        </Animated.View>
      </View>

      <View style={tw`flex flex-row flex-wrap justify-center mt-4`}>
        {data.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleSlicePress(item)}>
            <View style={tw`flex flex-row items-center m-1`}>
              <View style={[tw`w-3 h-3 mr-2 rounded-full`, { backgroundColor: item.color }]} />
              <Text style={[
                tw`text-sm`,
                selectedSlice && selectedSlice.label === item.label ? tw`font-bold text-blue-600` : tw`text-gray-800`
              ]}>
                {item.label}: {item.value}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PieChartComponent;
