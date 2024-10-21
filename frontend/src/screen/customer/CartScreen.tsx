import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { fetchCart, removeFromCart, createOrder } from '../apiRequest';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

type CartScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Cart'>;
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const cartData = await fetchCart();
        setCartItems(cartData.items || []);
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleRemoveFromCart = async (classTypeId: string) => {
    try {
      await removeFromCart(classTypeId);
      setCartItems(prevItems => prevItems.filter(item => item.classType._id !== classTypeId));
      Alert.alert('Success', 'Class removed from cart');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.yogaCourse.pricePerClass || 0), 0)
      .toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      const response = await createOrder();
      Alert.alert('Success', 'Order created successfully');
      navigation.navigate('Orders', { order: response.order });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E5B75" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.classType._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemDetails}>
                  <Text style={styles.classTypeText}>{item.classType.typeName}</Text>
                  <Text style={styles.detailText}>Teacher: {item.classType.teacher}</Text>
                  <Text style={styles.detailText}>
                    Date: {new Date(item.classType.date).toLocaleString()}
                  </Text>
                  <Text style={styles.detailText}>
                    Price per Class: ${(item.yogaCourse.pricePerClass || 0).toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromCart(item.classType._id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  itemDetails: {
    flex: 1,
  },
  classTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 16,
    color: '#555',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  totalContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
