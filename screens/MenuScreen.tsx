import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, Alert, ScrollView, SectionList } from 'react-native';
import { ScreenProps, MenuItem, Course } from '../App';

type Props = ScreenProps<'Menu'>;

// Predefined list of courses for consistent ordering
const predefinedCourses: Course[] = [
  'Specials',
  'Starter',
  'Main Course',
  'Dessert',
  'Drinks',
];

// Main App componetent for displaying the menu
export default function MenuScreen({ navigation, route, menuItems, setMenuItems, drinksData, setDrinksData }: Props) {
  const [orderedItems, setOrderedItems] = useState<MenuItem[]>([]);
  const isAdmin = route.params?.isAdmin;

  useEffect(() => {
    // Handle direct navigation requests from AdminWelcomeScreen
    if (route.params?.openEdit) {
      // Use a timeout to ensure the screen has mounted before navigating away; setMenuItems is passed from App.tsx
      setTimeout(() => navigation.replace('EditMenu', { currentMenuItems: menuItems }), 0);
    }
    if (route.params?.openFilter) {
      // Use a timeout to ensure the screen has mounted before navigating away
      setTimeout(() => navigation.replace('FilterByCourse', { currentMenuItems: menuItems, currentDrinksData: drinksData }), 0);
    }

  }, [route.params]);

  // Prevent rendering the menu if we are just passing through to another screen
  // This stops the "flicker" effect the user sees.
  if (route.params?.openEdit || route.params?.openFilter) {
    return null; // Render nothing while the useEffect redirects
  }
 
  // Function to calculate average price for a given course
  const getAveragePrice = (course: Course): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) {
      return 0;
    }
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  };

  // Group menu items by course for SectionList
  const groupedMenu = menuItems.reduce((acc, item) => {
    (acc[item.course] = acc[item.course] || []).push(item);
    return acc;
  }, {} as Record<Course, MenuItem[]>);

  // Format the data for the SectionList
  const menuSections = predefinedCourses
    .filter(course => course !== 'Drinks' && groupedMenu[course]?.length > 0)
    .map(course => ({
      title: course,
      data: groupedMenu[course],
    }));

  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
    // Use the uploaded image URI if it exists, otherwise use the require() path
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    // Handle adding items to the checkout
    const handleAddToCheckout = () => {
      setOrderedItems(prevItems => [...prevItems, item]);
      Alert.alert("Item Added", `${item.name} has been added to your order.`);
    };

    return (
      // Menu item card component for displaying individual menu items which is Food or drink items 
      <View style={styles.menuItemCard}>
        <Image source={imageSource || require('../assets/Logo.jpg')} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>
            {item.name} - R{item.price.toFixed(0)}
          </Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleAddToCheckout}>
            <Text style={styles.checkoutButtonText}>Add to checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Header component displaying logo, title, navigation buttons, and stats
  const ListHeader = () => {
    const totalDrinkCount = drinksData['Cold drinks'].length + drinksData['Hot drinks'].length;
    const totalItemCount = menuItems.length + totalDrinkCount;

    return (
      <>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logoPlaceholder} />
          <Text style={styles.headerTitle}>The Menu</Text>
          <View style={styles.headerNavContainer}>

            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('FilterByCourse', { currentMenuItems: menuItems, currentDrinksData: drinksData })}>
              <Text style={styles.headerNavText}>Filter by course</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('Checkout', { orderedItems })}>
              <Text style={styles.headerNavText}>Checkout ({orderedItems.length})</Text>
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('RemoveItems', { currentMenuItems: menuItems, currentDrinksData: drinksData })}>
                <Text style={styles.headerNavText}>Remove Items</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.goBack()}>
              <Text style={styles.headerNavText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total number of menu items</Text>
            <Text style={styles.statValue}>{totalItemCount} Items</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Average price of each course</Text>
            {predefinedCourses.filter(c => c !== 'Drinks').map(course => {
              const avg = getAveragePrice(course);
              if (avg > 0) { return <Text key={course} style={styles.statValueSmall}>{course}: R{avg.toFixed(0)}</Text>; }
              return null;
            })}
          </View>
        </View>
      </>
    );
  };

  // Function to handle adding drink items to the checkout
  const handleAddDrinkToCheckout = (drinkName: string) => {
    const newDrinkItem: MenuItem = {
      // Unique ID for the ordered item
      id: `drink_${drinkName}_${Date.now()}`, 
      name: drinkName,
      description: 'A refreshing beverage',
      course: 'Drinks',
      // Assign a default price for drinks
      price: 25, 
      image: null,
    };
    setOrderedItems(prevItems => [...prevItems, newDrinkItem]);
    Alert.alert("Item Added", `${drinkName} has been added to your order.`);
  };

  // Render the drinks section separately
  const renderDrinksSection = () => (
    <View>
      <Text style={styles.courseHeader}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Cold drinks</Text>
          {drinksData['Cold drinks'].map((drink, index) => { // Use drinksData from props
            return (
              <View key={index} style={styles.drinkItem}>
                <Text style={styles.drinkText}>{drink}</Text>
                <TouchableOpacity style={styles.checkoutButton} onPress={() => handleAddDrinkToCheckout(drink)}>
                  <Text style={styles.checkoutButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Hot drinks</Text>
          {drinksData['Hot drinks'].map((drink, index) => ( // Use drinksData from props
            <View key={index} style={styles.drinkItem}>
              <Text style={styles.drinkText}>{drink}</Text>
              <TouchableOpacity style={styles.checkoutButton} onPress={() => handleAddDrinkToCheckout(drink)}>
                <Text style={styles.checkoutButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    // Main container with background image and safe area 
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <SectionList
        // SectionList to display menu items grouped by course
            sections={menuSections}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItemCard}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.courseHeader}>{title}</Text>
            )}
            // Combine the ListHeader and Drinks section in the header
            ListHeaderComponent={<><ListHeader />{renderDrinksSection()}</>}
            contentContainerStyle={styles.scrollViewContent}
          />
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    // This ensures the safe area fills the background
    flex: 1, 
    // Semi-transparent white background
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
  },
  scrollViewContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    marginBottom: 10 
  },
  logoPlaceholder: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    marginRight: 10, 
    borderWidth: 1, 
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  headerNavContainer: {  
    justifyContent: 'flex-end', 
    alignItems: 'flex-end' 
  },
  headerNavButton: { 
    backgroundColor: '#2e2b2bff', 
    paddingHorizontal: 5, 
    paddingVertical: 1, 
    borderWidth: 1, 
    borderColor: '#fcf9f9ff', 
    borderRadius: 3, 
    marginBottom: 2 
  },
  headerNavText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#e9e5e5ff' 
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  statTitle: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 4 
  },
  statValue: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333', 
    lineHeight: 18 
  },
  statValueSmall: { 
    fontSize: 12, 
    fontWeight: '500', 
    color: '#333', 
    lineHeight: 16 
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
    marginRight: 12,
    borderColor: '#333',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
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
    fontSize: 12,
  },
  drinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  drinksColumn: {
    width: '45%',
  },
  drinksSubHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  drinkItem: { 
    marginBottom: 5, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drinkText: { 
    fontSize: 13,
    flex: 1,
  },
});
