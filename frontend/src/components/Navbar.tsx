import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { fetchUser, logoutUser } from '../screen/apiRequest'; 
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from '../../App'; 

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface NavbarProps {
  username: string;
  onLinkPress: (link: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLinkPress }) => {
  const navigation = useNavigation<NavigationProp>();
  const [username, setUsername] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchUser(); 
        setUsername(user.username);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    loadUser();
  }, []);

  const handleUsernamePress = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); 
      Alert.alert("Success", "You have been logged out.");
      onLinkPress("Login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
          <Text style={styles.link}>Courses</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.usernameContainer}>
        <TouchableOpacity onPress={handleUsernamePress}>
          <Text style={styles.username}>Hello, {username}</Text>
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.dropdownItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.dropdownItem}>My Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.dropdownItem}>My Order</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.dropdownItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#1e90ff",
    elevation: 4,
    zIndex: 10,  
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  linksContainer: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  link: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  usernameContainer: {
    flex: 1,
    alignItems: "flex-end",
    position: "relative",
    zIndex: 10, 
  },
  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdownMenu: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: 150,
    zIndex: 999,  
    elevation: 5,  
    shadowColor: "#000",  
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});

export default Navbar;
