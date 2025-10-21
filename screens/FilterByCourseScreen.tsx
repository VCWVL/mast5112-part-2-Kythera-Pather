import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, FlatList, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, MenuItem, Course } from '../App';

type FilterNavProp = StackNavigationProp<RootStackParamList, 'FilterByCourse'>;
type FilterRouteProp = RouteProp<RootStackParamList, 'FilterByCourse'>;

type Props = { navigation: FilterNavProp; route: FilterRouteProp };

const filterCategories: ('All' | Course)[] = ['All', 'Specials', 'Starter', 'Main Course', 'Dessert', 'Drinks'];

const drinksData = {
  'Cold drinks': ['Any frizzy drink', "Fruit juice's", 'Ice water'],
  'Hot drinks': ['Tea', 'Coffee', 'Hot chocolate'],
};

export default function FilterByCourseScreen({ navigation, route }: Props) {
  const { currentMenuItems } = route.params;
  const [activeFilter, setActiveFilter] = useState<'All' | Course>('All');
  const [orderedItems, setOrderedItems] = useState<MenuItem[]>([]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') {
      return currentMenuItems;
    }
    return currentMenuItems.filter(item => item.course === activeFilter);
  }, [activeFilter, currentMenuItems]);

  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    const handleAddToCheckout = () => {
      setOrderedItems(prevItems => [...prevItems, item]);
      Alert.alert("Item Added", `${item.name} has been added to your order.`);
    };

    return (
      <View style={styles.menuItemCard}>
        <Image source={imageSource || require('../assets/Logo.jpg')} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name} - R{item.price.toFixed(0)}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleAddToCheckout}>
            <Text style={styles.checkoutButtonText}>Add to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDrinksSection = () => (
    <View style={styles.drinksSectionContainer}>
      <Text style={styles.courseHeader}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Cold drinks</Text>
          {drinksData['Cold drinks'].map((drink, index) => (
            <Text key={index} style={styles.drinkText}>{drink}</Text>
          ))}
        </View>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Hot drinks</Text>
          {drinksData['Hot drinks'].map((drink, index) => (
            <Text key={index} style={styles.drinkText}>{drink}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logo} />
          <Text style={styles.headerTitle}>Filter By Course</Text>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            {filterCategories.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterButton, activeFilter === category && styles.activeFilterButton]}
                onPress={() => setActiveFilter(category)}
              >
                <Text style={[styles.filterButtonText, activeFilter === category && styles.activeFilterText]}>
                  {category === 'Main Course' ? 'Mains' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {activeFilter === 'Drinks' ? (
          renderDrinksSection()
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItemCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>No items found for this course.</Text>}
          />
        )}

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Checkout', { orderedItems })}>
          <Text style={styles.footerButtonText}>Go to Checkout ({orderedItems.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Menu', {})}>
          <Text style={styles.footerButtonText}>Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    minHeight: '100%',
  }, 
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    paddingBottom: 20 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10 
  },
  logo: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 15 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  filterContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 10 
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  activeFilterButton: {
    borderColor: '#000',
    backgroundColor: '#f0f0f0',
  },
  filterButtonText: { 
    color: '#333', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  activeFilterText: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  listContentContainer: { 
    paddingHorizontal: 15, 
    paddingTop: 10 
  },
  menuItemCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 15,
    alignItems: 'center',
  },
  itemImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    marginRight: 12 
  },
  itemDetails: { 
    flex: 1, 
     },
  itemName: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#222', 
    marginBottom: 5 
  },
  itemDescription: { 
    fontSize: 13, 
    color: '#666', 
    marginBottom: 8 
  },
  checkoutButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  checkoutButtonText: { 
    color: '#fff', 
    fontSize: 12 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: '#666' 
  },
  footerButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    alignItems: 'center',
    marginTop: 10, // Adjusted margin
  },
  footerButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  // Drinks Section Styles
  drinksSectionContainer: {
    paddingHorizontal: 15,
  },
  courseHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    textDecorationLine: 'underline',
    color: '#333',
  },
  drinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#333',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  drinksColumn: { width: '45%' },
  drinksSubHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  drinkText: { 
    fontSize: 13, 
    color: '#666', 
    marginBottom: 5 
  },
});