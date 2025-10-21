import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, Alert, ScrollView, SectionList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, MenuItem, Course } from '../App';

type MenuNavProp = StackNavigationProp<RootStackParamList, 'Menu'>;

type MenuRouteProp = RouteProp<RootStackParamList, 'Menu'>;
type Props = { navigation: MenuNavProp; route: MenuRouteProp };

const predefinedCourses: Course[] = [
  'Specials',
  'Starter',
  'Main Course',
  'Dessert',
  'Drinks',
];

// Data for the unique 'Drinks' section layout
const initialDrinksData = { // Renamed to initialDrinksData
  'Cold drinks': ['Any frizzy drink', "Fruit juice's", 'Ice water'],
  'Hot drinks': ['Tea', 'Coffee', 'Hot chocolate'],
};

// --- 2. INITIAL MENU DATA (with images) ---
const initialMenu: MenuItem[] = [
  {
    id: '1', 
    name: 'Lobster Thermidor', 
    description: 'Grilled lobster tail in a creamy mustard and brandy sauce.', 
    course: 'Specials', 
    price: 300, 
    image: require("../assets/Lobster Thermidor.jpg"),
  },
  {
    id: '2', 
    name: "Chef's Tasting Platter", 
    description: "A curated selection of the chef's favorite seasonal bites (serves two).", 
    course: 'Specials', 
    price: 350, 
    image: require("../assets/Chef's Tasting Platter.jpg"),
  },
  {
    id: '3',
   name: 'Seared Scallops with Herb Sauce', 
   description: 'Pan-fried scallops served with herb and lemon dressing.', 
   course: 'Starter', 
   price: 95, 
   image: require('../assets/Seared Scallops with Herb Sauce.jpg'),
  },
  {
    id: '4', 
    name: 'Roasted Tomato Soup', 
    description: 'Rich roasted tomato soup topped with basil oil and croutons.', 
    course: 'Starter',
     price: 70, 
    image: require('../assets/Roasted Tomato Soup.jpg'),
  },
  {
    id: '5', 
    name: 'Fillet Steak', 
    description: 'Tender beef fillet with creamy peppercorn sauce and potatoes.', 
    course: 'Main Course', 
    price: 220, 
    image: require('../assets/fillet-steak.jpg'),
  },
  {
    id: '6', 
    name: 'Pan-Fried Salmon', 
    description: 'Salmon fillet served with creamy dill and mustard sauce.', 
    course: 'Main Course', 
    price: 155, 
    image: require('../assets/Pan-Fried Salmon.jpg'),
  },
  {
    id: '7', 
    name: 'Classic Crème Brûlée', 
    description: 'Smooth vanilla custard topped with a caramelised sugar crust.', 
    course: 'Dessert', 
    price: 125, 
    image: require('../assets/Classic Crème Brûlée.jpg'),
  },
  {
    id: '8', 
    name: 'Chocolate Lava Pudding', 
    description: 'Rich chocolate sponge with a gooey molten centre.', 
    course: 'Dessert', 
    price: 95, 
    image: require('../assets/Chocolate Lava Pudding.jpg'),
  }, 
];

// --- 3. MAIN APPLICATION COMPONENT ---
export default function MenuScreen({ navigation, route }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);
  const [orderedItems, setOrderedItems] = useState<MenuItem[]>([]);
  // Add state for drinksData
  const [currentDrinksData, setCurrentDrinksData] = useState(initialDrinksData);
  const isAdmin = route.params?.isAdmin;

  useEffect(() => {
    // This effect handles updates coming from other screens
    if (route.params?.updatedMenuItems) {
      // If a full list is passed back (e.g., from RemoveItemsScreen), set it
      setMenuItems(route.params.updatedMenuItems);
    } else if (route.params?.newMenuItem) {
      // If a single new item is added (from EditMenuScreen)
      const newItem = route.params.newMenuItem;
      // Prevent adding duplicates if user navigates back and forth
      if (!menuItems.some(item => item.id === newItem.id)) {
        setMenuItems(prevItems => [newItem, ...prevItems]);
      }
    }
    // NEW: Handle updated drinks data
    if (route.params?.updatedDrinksData) {
      setCurrentDrinksData(route.params.updatedDrinksData);
    }

    // Handle direct navigation requests from AdminWelcomeScreen
    if ((route.params as any)?.openEdit) {
      // Use a timeout to ensure the screen has mounted before navigating away
      setTimeout(() => navigation.replace('EditMenu', { currentMenuItems: menuItems }), 0);
    }
    if ((route.params as any)?.openFilter) {
      // Use a timeout to ensure the screen has mounted before navigating away
      setTimeout(() => navigation.replace('FilterByCourse', { currentMenuItems: menuItems }), 0);
    }

  }, [route.params]);

  // Prevent rendering the menu if we are just passing through to another screen
  // This stops the "flicker" effect the user sees.
  if ((route.params as any)?.openEdit || (route.params as any)?.openFilter) {
    return null; // Render nothing while the useEffect redirects
  }

  const getAveragePrice = (course: Course): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) {
      return 0;
    }
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  };

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

    const handleAddToCheckout = () => {
      setOrderedItems(prevItems => [...prevItems, item]);
      Alert.alert("Item Added", `${item.name} has been added to your order.`);
    };

    return (
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

  const ListHeader = () => {
    const totalDrinkCount = currentDrinksData['Cold drinks'].length + currentDrinksData['Hot drinks'].length;
    const totalItemCount = menuItems.length + totalDrinkCount;

    return (
      <>
        <View style={styles.header}>
          <Image source={require('../assets/Logo.jpg')} style={styles.logoPlaceholder} />
          <Text style={styles.headerTitle}>The Menu</Text>
          <View style={styles.headerNavContainer}>
            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('FilterByCourse', { currentMenuItems: menuItems })}>
              <Text style={styles.headerNavText}>Filter by course</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('Checkout', { orderedItems })}>
              <Text style={styles.headerNavText}>Checkout ({orderedItems.length})</Text>
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate('RemoveItems', { currentMenuItems: menuItems })}>
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

  const handleAddDrinkToCheckout = (drinkName: string) => {
    const newDrinkItem: MenuItem = {
      id: `drink_${drinkName}_${Date.now()}`, // Unique ID for the ordered item
      name: drinkName,
      description: 'A refreshing beverage',
      course: 'Drinks',
      price: 25, // Assign a default price for drinks
      image: null,
    };
    setOrderedItems(prevItems => [...prevItems, newDrinkItem]);
    Alert.alert("Item Added", `${drinkName} has been added to your order.`);
  };

  const renderDrinksSection = () => (
    <View>
      <Text style={styles.courseHeader}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Cold drinks</Text>
          {currentDrinksData['Cold drinks'].map((drink, index) => { // Use currentDrinksData
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
          {currentDrinksData['Hot drinks'].map((drink, index) => ( // Use currentDrinksData
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
    <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <SectionList
            sections={menuSections}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItemCard}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.courseHeader}>{title}</Text>
            )}
            ListHeaderComponent={() => (<><ListHeader />{renderDrinksSection()}</>)}
            contentContainerStyle={styles.scrollViewContent}
          />
      </SafeAreaView>
    </ImageBackground>
  );
};

// --- 4. STYLES ---
const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
  overlay: {
    flex: 1, // This ensures the safe area fills the background
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white background
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
    backgroundColor: '#fff', 
    paddingHorizontal: 5, 
    paddingVertical: 1, 
    borderWidth: 1, 
    borderColor: '#333', 
    borderRadius: 3, 
    marginBottom: 2 
  },
  headerNavText: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#333' 
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
    width: 90,
    height: 90, 
    borderRadius: 10,
    marginRight: 12,
    borderWidth: 1,
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
