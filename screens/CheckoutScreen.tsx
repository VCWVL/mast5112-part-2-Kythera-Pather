import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, MenuItem } from '../App';

type CheckoutNavProp = StackNavigationProp<RootStackParamList, 'Checkout'>;
type CheckoutRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

type Props = { navigation: CheckoutNavProp; route: CheckoutRouteProp };

export default function CheckoutScreen({ navigation, route }: Props) {
  // Assume orderedItems are passed via route params. Default to empty array if not provided.
  const { orderedItems = [] } = route.params || {};

  const totalAmount = useMemo(() => {
    return orderedItems.reduce((sum, item) => sum + item.price, 0);
  }, [orderedItems]);

  const renderOrderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemBox}>
      <Text style={styles.itemText}>{item.name} - R{item.price.toFixed(0)}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logo} />
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.listTitle}>List of all the items ordered</Text>
          <FlatList
            data={orderedItems}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>Your order is empty.</Text>}
            style={styles.list}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total amount:</Text>
            <Text style={styles.totalValue}>R{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Menu', {})}>
          <Text style={styles.footerButtonText}>Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1 
    },
  overlay: { 
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 20 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  list: {
    flexGrow: 0,
  },
  itemBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});