import React, { useState } from "react";
import { View, Text, SectionList, TouchableOpacity, Image, StyleSheet, SafeAreaView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type MenuNavProp = StackNavigationProp<RootStackParamList, "Menu">;
type Props = { navigation: MenuNavProp };

type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
};

type Course = 'Specials' | 'Starter' | 'Main Course' | 'Dessert' | 'Drinks';

const predefinedCourses: Course[] = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Drinks'];

const drinksData = {
  'Cold drinks': ["Any frizzy drink", "Fruit juice's", "Ice water"],
  'Hot drinks': ["Tea", "Coffee", "Hot chocolate"],
};

const initialMenu: MenuItem[] = [
  { id: '1', name: 'Lobster Thermidor', description: 'Grilled lobster tail in a creamy mustard and brandy sauce.', course: 'Specials', price: 300 },
  { id: '2', name: "Chef's Tasting Platter", description: "A curated selection of the chef's favorite seasonal bites (serves two).", course: 'Specials', price: 350 },
  { id: '3', name: 'Seared Scallops with Herb Sauce', description: 'Pan-fried scallops served with herb and lemon dressing.', course: 'Starter', price: 195 },
  { id: '4', name: 'Roasted Tomato Soup', description: 'Pan-fried scallops served with herb and lemon dressing.', course: 'Starter', price: 70 },
  { id: '5', name: 'Filet Steak', description: 'Tender beef fillet with a creamy peppercorn sauce, served with potatoes.', course: 'Main Course', price: 220 },
  { id: '6', name: 'Pan-Fried Salmon', description: 'Salmon fillets served with a creamy dill and mustard sauce.', course: 'Main Course', price: 155 },
  { id: '7', name: 'Classic Crème Brûlée', description: 'A smooth vanilla custard topped with a caramelised sugar crust.', course: 'Dessert', price: 125 },
  { id: '8', name: 'Chocolate Lava Pudding', description: 'A rich chocolate sponge with a gooey molten centre.', course: 'Dessert', price: 95 },
];

export default function MenuScreen({ navigation }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenu);

  const getAverage = (course: string) => {
    const items = menuItems.filter((item) => item.course === course);
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return (total / items.length).toFixed(2);
  };

  const menuSections = predefinedCourses
    .filter(course => course !== 'Drinks')
    .map(course => ({
      title: course,
      data: menuItems.filter(item => item.course === course),
    })).filter(section => section.data.length > 0);

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Image source={require("../assets/Logo.jpg")} style={styles.logoPlaceholder} />
        <Text style={styles.headerTitle}>The Menu</Text>
        <View style={styles.headerNavContainer}>
          <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate("FilterByCourse")}>
            <Text style={styles.headerNavText}>Filter by course</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.navigate("WelcomeChef")}>
            <Text style={styles.headerNavText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statsContainer}>
        {renderStatistic('Total number of menu items', `${menuItems.length} Items`)}
        {renderStatistic(
          'Average price of each course',
          `Specials: R${getAverage("Specials")}\nStarters: R${getAverage("Starter")}\nMain: R${getAverage("Main Course")}\nDesserts: R${getAverage("Dessert")}`
        )}
      </View>
    </>
  );

  const ListFooter = () => (
    <>
      {renderDrinksSection()}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("WelcomeChef")}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderStatistic = (title: string, value: React.ReactNode) => (
    <View style={styles.statBox}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderMenuItemCard = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <Image source={require("../assets/Background.jpg")} style={styles.imagePlaceholder} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}-R{item.price.toFixed(0)}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate("Checkout")}>
          <Text style={styles.checkoutButtonText}>Add to checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDrinksSection = () => (
    <View>
      <Text style={styles.courseHeader}>Drinks</Text>
      <View style={styles.drinksContainer}>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Cold drinks</Text>
          {drinksData['Cold drinks'].map((drink, index) => (
            <View key={index} style={styles.drinkItem}>
              <Text style={styles.drinkText}>{drink}</Text>
              <View style={styles.drinkLine} />
            </View>
          ))}
        </View>
        <View style={styles.drinksColumn}>
          <Text style={styles.drinksSubHeader}>Hot drinks</Text>
          {drinksData['Hot drinks'].map((drink, index) => (
            <View key={index} style={styles.drinkItem}>
              <Text style={styles.drinkText}>{drink}</Text>
              <View style={styles.drinkLine} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={menuSections}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItemCard}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.courseHeader}>{title}</Text>}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContentContainer: { paddingHorizontal: 15, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, marginBottom: 10 },
  logoPlaceholder: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#333', marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  headerNavContainer: { alignItems: 'flex-end' },
  headerNavButton: { backgroundColor: '#fff', paddingHorizontal: 5, paddingVertical: 1, borderWidth: 1, borderColor: '#333', borderRadius: 3, marginBottom: 2 },
  headerNavText: { fontSize: 10, color: '#333' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '48%', padding: 10, backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#333' },
  statTitle: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 4, textDecorationLine: 'underline' },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#333', lineHeight: 18 },
  courseHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10, textAlign: 'center', textDecorationLine: 'underline' },
  menuItemCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#333', minHeight: 100 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#333', marginRight: 10 },
  itemDetails: { position: 'relative', flexShrink: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  itemDescription: { fontSize: 12, color: '#666' },
  checkoutButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  checkoutButtonText: { color: '#fff', fontSize: 12 },
  drinksContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderWidth: 1, borderColor: '#333', borderRadius: 5 },
  drinksColumn: { width: '45%' },
  drinksSubHeader: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10, textDecorationLine: 'underline' },
  drinkItem: { marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
  drinkText: { fontSize: 14, textDecorationLine: 'underline' },
  drinkLine: { flex: 1, height: 1, backgroundColor: '#333', marginLeft: 5, marginTop: 8 },
  bottomButtons: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 },
  saveButton: { backgroundColor: '#333', padding: 12, borderRadius: 5, alignItems: 'center', paddingHorizontal: 40 },
  cancelButton: { backgroundColor: '#888', padding: 12, borderRadius: 5, alignItems: 'center', paddingHorizontal: 40 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
