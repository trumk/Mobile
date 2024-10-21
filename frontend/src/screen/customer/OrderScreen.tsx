import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { fetchOrders } from '../apiRequest';

const OrderScreen: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchOrders();
                setOrders(data);
            } catch (error: any) {
                Alert.alert('Error', error.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1E5B75" />
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No orders found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <Text style={styles.orderDetail}>Order ID: {item._id}</Text>
                        <Text style={styles.orderDetail}>Total Amount: ${item.totalAmount}</Text>
                        <Text style={styles.orderDetail}>Status: {item.status}</Text>
                        <Text style={styles.orderDetail}>Number of Items: {item.items.length}</Text>
                        <TouchableOpacity style={styles.detailButton}>
                            <Text style={styles.detailButtonText}>View Details</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
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
    orderCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
    },
    orderDetail: {
        fontSize: 16,
        marginBottom: 5,
        color: '#34495E',
    },
    detailButton: {
        marginTop: 10,
        backgroundColor: '#1E5B75',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailButtonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default OrderScreen;
