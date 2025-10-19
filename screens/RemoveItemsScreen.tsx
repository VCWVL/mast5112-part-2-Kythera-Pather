import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ImageBackground, SectionList, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, MenuItem, Course } from '../App';

type RemoveItemsNavProp = StackNavigationProp<RootStackParamList, 'RemoveItems'>;
type RemoveItemsRouteProp = RouteProp<RootStackParamList, 'RemoveItems'>;
type Props = { navigation: RemoveItemsNavProp; route: RemoveItemsRouteProp };

const predefinedCourses: Course[] = ['Specials', 'Starter', 'Main Course', 'Dessert', 'Drinks'];

const initialDrinksData = {
  'Cold drinks': ['Any frizzy drink', "Fruit juice's", 'Ice water'],
  'Hot drinks': ['Tea', 'Coffee', 'Hot chocolate'],
};

export default function RemoveItemsScreen({ navigation, route }: Props) {
  const { currentMenuItems } = route.params;
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => currentMenuItems);
  const [drinks, setDrinks] = useState(initialDrinksData); // Drinks are static and not part of the main menu state
  const [itemsToRemove, setItemsToRemove] = useState<Set<string>>(new Set());

  const toggleItemForRemoval = useCallback((itemId: string) => {
    const newItemsToRemove = new Set(itemsToRemove);
    if (newItemsToRemove.has(itemId)) {
      newItemsToRemove.delete(itemId);
    } else {
      newItemsToRemove.add(itemId);
    }
    setItemsToRemove(newItemsToRemove);
  }, [itemsToRemove]);

  const handleSave = () => {
    if (itemsToRemove.size === 0) {
      Alert.alert("No Changes", "No items were selected for removal.");
      return;
    }
    const updatedMenuItems = menuItems.filter(item => !itemsToRemove.has(item.id)); // Filter out removed items
    navigation.navigate('Menu', { updatedMenuItems: updatedMenuItems });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const getAveragePrice = useCallback((course: Course): number => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) return 0;
    const total = courseItems.reduce((sum, item) => sum + item.price, 0);
    return total / courseItems.length;
  }, [menuItems]);

  const menuSections = React.useMemo(() => {
    const groupedMenu = menuItems.reduce((acc, item) => {
      (acc[item.course] = acc[item.course] || []).push(item);
      return acc;
    }, {} as Record<Course, MenuItem[]>);

    return predefinedCourses
      .filter(course => course !== 'Drinks' && groupedMenu[course]?.length > 0)
      .map(course => ({
        title: course,
        data: groupedMenu[course],
      }));
  }, [menuItems]);

  const renderMenuItemCard = ({ item }: { item: MenuItem }) => {
    const isMarkedForRemoval = itemsToRemove.has(item.id);
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <View style={[styles.menuItemCard, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
        <Image source={imageSource || require('../assets/Logo.jpg')} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name} - R{item.price.toFixed(0)}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
           <TouchableOpacity
             style={[styles.removeButton, isMarkedForRemoval && styles.removeButtonActive]}
             onPress={() => toggleItemForRemoval(item.id)}
           >
             <Text style={styles.removeButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
           </TouchableOpacity>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
     <>
       <View style={styles.header}>
         <Image source={require('../assets/Logo.jpg')} style={styles.logoPlaceholder} />
         <Text style={styles.headerTitle}>Remove Items</Text>
         <TouchableOpacity style={styles.headerNavButton} onPress={() => navigation.goBack()}>
           <Text style={styles.headerNavText}>Back</Text>
         </TouchableOpacity>
       </View>
       <View style={styles.statsContainer}>
         <View style={styles.statBox}>
           <Text style={styles.statTitle}>Total number of menu items</Text>
           <Text style={styles.statValue}>{menuItems.length} Items</Text>
         </View>
         <View style={styles.statBox}>
           <Text style={styles.statTitle}>Average price of each course</Text>
           {predefinedCourses.filter(c => c !== 'Drinks').map(course => {
             const avg = getAveragePrice(course);
             if (avg > 0) {
               return <Text key={course} style={styles.statValueSmall}>{course}: R{avg.toFixed(0)}</Text>;
             }
             return null;
           })}
         </View>
       </View>
     </>
  );

  const renderDrinksSection = () => (
     <View>
       <Text style={styles.courseHeader}>Drinks</Text>
       <View style={styles.drinksContainer}>
         <View style={styles.drinksColumn}>
           <Text style={styles.drinksSubHeader}>Cold drinks</Text>
           {drinks['Cold drinks'].map((drink, index) => {
             const drinkId = `cold-${drink.replace(/\s+/g, '-')}`;
             const isMarkedForRemoval = itemsToRemove.has(drinkId);
             return (
               <View key={index} style={[styles.drinkItem, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
                 <Text style={styles.drinkText}>{drink}</Text>
                 <TouchableOpacity
                   style={[styles.drinkRemoveButton, isMarkedForRemoval && styles.removeButtonActive]}
                   onPress={() => toggleItemForRemoval(drinkId)}
                 >
                   <Text style={styles.drinkRemoveButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
                 </TouchableOpacity>
               </View>
             );
           })}
         </View>
         <View style={styles.drinksColumn}>
           <Text style={styles.drinksSubHeader}>Hot drinks</Text>
           {drinks['Hot drinks'].map((drink, index) => {
             const drinkId = `hot-${drink.replace(/\s+/g, '-')}`;
             const isMarkedForRemoval = itemsToRemove.has(drinkId);
             return (
               <View key={index} style={[styles.drinkItem, isMarkedForRemoval && styles.itemMarkedForRemoval]}>
                 <Text style={styles.drinkText}>{drink}</Text>
                 <TouchableOpacity
                   style={[styles.drinkRemoveButton, isMarkedForRemoval && styles.removeButtonActive]}
                   onPress={() => toggleItemForRemoval(drinkId)}
                 >
                   <Text style={styles.drinkRemoveButtonText}>{isMarkedForRemoval ? 'UNDO' : 'REMOVE'}</Text>
                 </TouchableOpacity>
               </View>
             );
           })}
         </View>
       </View>
     </View>
  );

  const ListFooter = () => (
     <>
       {renderDrinksSection()}
       <View style={styles.footerButtons}>
         <TouchableOpacity style={styles.footerButton} onPress={handleSave}>
           <Text style={styles.footerButtonText}>Save</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.footerButton} onPress={handleCancel}>
           <Text style={styles.footerButtonText}>Cancel</Text>
         </TouchableOpacity>
       </View>
     </>
  );

  return (
     <ImageBackground source={require('../assets/Background.jpg')} style={styles.container} resizeMode="cover">
       <SafeAreaView style={styles.overlay}>
         <SectionList
           sections={menuSections}
           keyExtractor={(item) => item.id}
           renderItem={renderMenuItemCard}
           renderSectionHeader={({ section: { title } }) => <Text style={styles.courseHeader}>{title}</Text>}
           ListHeaderComponent={ListHeader}
           ListFooterComponent={ListFooter}
           contentContainerStyle={styles.scrollViewContent}
           extraData={itemsToRemove} // Ensures re-render when an item is marked
         />
       </SafeAreaView>
     </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' },
  scrollViewContent: { paddingHorizontal: 15, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, marginBottom: 10 },
  logoPlaceholder: { width: 60, height: 60, borderRadius: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  headerNavButton: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  headerNavText: { fontSize: 14, color: '#fff' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { width: '48%', padding: 10, backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#333' },
  statTitle: { fontSize: 12, fontWeight: 'bold', textDecorationLine: 'underline', color: '#333', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statValueSmall: { fontSize: 12, fontWeight: '500', color: '#333' },
  courseHeader: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginTop: 20, marginBottom: 10, color: '#333' },
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
  itemMarkedForRemoval: {
     backgroundColor: '#ffdddd', // Highlight items marked for removal
     borderColor: '#c00',
  },
  itemImage: { width: 80, height: 80, borderRadius: 40, marginRight: 12 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  itemDescription: { fontSize: 13, color: '#666', marginBottom: 8 },
  removeButton: {
     backgroundColor: '#add8e6', // Light blue
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 5,
     alignSelf: 'flex-end',
  },
  removeButtonActive: {
     backgroundColor: '#ff6347', // A red/tomato color for the "UNDO" state
  },
  removeButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  drinksContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     borderWidth: 1,
     borderColor: '#333',
     padding: 10,
     borderRadius: 8,
     marginTop: 10,
  },
  drinksColumn: { width: '45%' },
  drinksSubHeader: { fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline', marginBottom: 8 },
  drinkItem: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 8,
     padding: 4,
     borderRadius: 4,
  },
  drinkText: { fontSize: 13, flex: 1 },
  drinkRemoveButton: {
     backgroundColor: '#add8e6',
     paddingHorizontal: 8,
     paddingVertical: 4,
     borderRadius: 4,
     marginLeft: 8,
  },
  drinkRemoveButtonText: {
     color: '#fff',
     fontSize: 10,
     fontWeight: 'bold',
  },
  footerButtons: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     marginTop: 30,
     paddingHorizontal: 10,
  },
  footerButton: {
     backgroundColor: '#000',
     paddingVertical: 15,
     borderRadius: 8,
     flex: 1,
     marginHorizontal: 10,
     alignItems: 'center',
  },
  footerButtonText: {
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 16,
  },
});