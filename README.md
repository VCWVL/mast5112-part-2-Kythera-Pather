Christoffel’s Menu – React Native Application
# Overview

Christoffel’s Menu is a full-featured mobile application built using React Native and TypeScript.
The app provides an interactive digital menu experience for restaurant customers, alongside a dedicated administrative dashboard for chefs to manage menu content dynamically.

The system is designed with a dual-role architecture, ensuring a smooth experience for both regular diners and administrative users:

- Chef (Admin View): Manage the restaurant’s menu — add, edit, filter, or remove food and drink items.

- Customer View: Browse categorized menu items, filter by course, add items to a checkout list, and review an order summary.

This project forms part of a practical mobile application development module, showcasing applied knowledge of UI design, navigation, component management, and state handling in React Native.

- The first part of the POE part 1 was designning the wireframe for each screen and have a draft layout on what the App would look like with reasearched information on code that used and fit for the App.
- Part 2 was to code the whole App with the different screens for the customer and user to use, here was used to design the layout, code and make sure the app was running.

--- 

# Key Features

#### User Authentication System
- Simple role-based login flow distinguishing between the “Chef” (admin) and  customers.

#### Dynamic Menu Display
- Menu items are grouped by course (Specials, Starter, Main Course, Dessert, Drinks) using the efficient React Native SectionList component.

#### Dedicated Drinks Section
- Drinks are neatly divided into Hot and Cold subcategories for clarity.

#### Filter by Course
- Allows users to view only specific categories (e.g., only Desserts or Mains).

#### Interactive Checkout System
-Users can add items to their “checkout cart” and view the total cost before confirming.

#### Chef Management Tools

- Add Menu Items: Add new dishes or beverages, including name, description, price, and optional image upload.

- Remove Menu Items: Select one or multiple items for deletion.

- View Menu Statistics: Automatically calculates the average price per course and total item count.

#### Centralized State Management
- All menu data and navigation states are controlled via the main App.tsx, ensuring consistency across screens.

#### Adaptive UI Design
-Layouts are optimized for both Android and iOS, using modern React Native components and Flexbox styling.
