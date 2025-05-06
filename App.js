import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/LoginPage';
import HomeScreen from './pages/HomePage';
import AppIntro from './pages/Appintro';
import AddForm from './charts/AddForm';
import SignupPage from './pages/SignupPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppIntro">
        {/* AppIntro Screen */}
        <Stack.Screen
          name="AppIntro"
          component={AppIntro}
          options={{ headerShown: false }} // Hide header for intro
        />
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Hide header for login
        />
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Hide header for home
        />
        {/* AddForm Screen */}
        <Stack.Screen
          name="AddForm"
          component={AddForm}
          options={{ headerShown: false }} // Hide header for add form
        />
        {/* SignupPage Screen */}
        <Stack.Screen
          name="Signup"
          component={SignupPage} 
          options={{ headerShown: false }} // Hide header for signup
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LoginScreen from './pages/LoginPage';
// import HomeScreen from './pages/HomePage';
// import AppIntro from './pages/Appintro';
// import AddForm from './charts/AddForm';
// import SignupPage from './pages/SignupPage';
// import { LanguageProvider } from './LanguageContext';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <LanguageProvider>
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="AppIntro">
//         {/* AppIntro Screen */}
//         <Stack.Screen
//           name="AppIntro"
//           component={AppIntro}
//           options={{ headerShown: false }} // Hide header for intro
//         />
//         {/* Login Screen - commented out */}
//         {/* <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }} // Hide header for login
//         /> */}
//         {/* Home Screen */}
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }} // Hide header for home
//         />
//         {/* AddForm Screen */}
//         <Stack.Screen
//           name="AddForm"
//           component={AddForm}
//           options={{ headerShown: false }} // Hide header for add form
//         />
//         {/* SignupPage Screen - commented out */}
//         {/* <Stack.Screen
//           name="Signup"
//           component={SignupPage} 
//           options={{ headerShown: false }} // Hide header for signup
//         /> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//     </LanguageProvider>
//   );
// }
