# Project Overview: ColiNova (P2P Delivery Platform)

## 1. General Application Structure
**Tech Stack:** React 18, Tailwind CSS, TypeScript.
**Entry Point:** `index.tsx` mounts `App.tsx`.
**Routing:** Hash-based routing implemented manually in `App.tsx` (e.g., `#dashboard`, `#login`).
**State Management:** React Context API (`AppContext` for data/auth, `LanguageContext` for i18n).
**Styling:** Tailwind CSS with dynamic RTL/LTR support and custom fonts (Cairo for Arabic, Inter for others).

## 2. Core Features

### Authentication & Roles
*   **Roles:** `GUEST`, `SENDER`, `TRANSPORTER`, `RECEIVER`.
*   **Flow:** Users select a role upon Login/Signup. The Dashboard view changes entirely based on the selected role.
*   **Context:** `user` object and `role` state are global.

### Internationalization (i18n)
*   **Languages:** Arabic (Default), English, French.
*   **Implementation:** `LanguageContext` provides a `t()` function.
*   **RTL Support:** `dir="rtl"` is applied to `<html>` dynamically. Layouts (flex directions, margins, paddings) and icons (arrows) flip automatically based on direction.

### Map Engine
*   **Component:** `MapCanvas.tsx`.
*   **Implementation:** A simulated map using SVG/HTML overlay on top of a patterned background. It supports:
    *   Plotting markers (User, Origin, Destination).
    *   Drawing route lines between coordinates.
    *   Interactive mode (clicking to return x/y coordinates).
    *   Responsive resizing.

## 3. Page Breakdown

### Public Pages
*   **Landing Page (`Landing.tsx`):** Hero section with role-based CTAs, trust signals, feature breakdown, and a "Recent Routes" map visualization.
*   **Static Pages (`StaticPage.tsx`):** Template for "How it works", "Trust & Safety", etc.
*   **Login / Signup:** Form-based auth with role selection.

### Sender Workflow
*   **Dashboard (`pages/sender/Dashboard.tsx`):**
    *   Sidebar navigation.
    *   List of active shipments with status tracking.
    *   Quick quote widget.
    *   Live map showing active parcel locations.
*   **Create Parcel (`pages/sender/CreateParcel.tsx`):**
    *   3-Step Wizard: Details (Photo upload, Text) -> Route (Map interaction) -> Review.
    *   Image upload uses `URL.createObjectURL` for local preview.

### Transporter Workflow
*   **Dashboard (`pages/transporter/Dashboard.tsx`):**
    *   Split view: Scrollable list of available jobs vs. Interactive Map.
    *   Filtering by date, vehicle type.
    *   Parcel Details Modal: Shows detour time, price, CO2 savings, and route visualization.

### Receiver Workflow
*   **Dashboard (`pages/receiver/Dashboard.tsx`):**
    *   Simple input for Tracking ID.
    *   Timeline view of delivery status (Picked up -> In Transit -> Delivered).

### User Pages
*   **Profile (`Profile.tsx`):** Displays user stats, verification badges, and reviews.
*   **Settings (`Settings.tsx`):** Tabbed interface for Account, Notifications, and Security.

## 4. Data Models (`types.ts`)

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
```

### Parcel
```typescript
interface Parcel {
  id: string;
  senderId: string;
  transporterId?: string;
  receiverName: string;
  title: string;
  description: string;
  weight: number;
  size: 'S' | 'M' | 'L' | 'XL';
  price: number;
  origin: Coordinates;      // {x: number, y: number} (0-100%)
  destination: Coordinates; // {x: number, y: number} (0-100%)
  status: ParcelStatus;     // PENDING, MATCHED, PICKED_UP, IN_TRANSIT, DELIVERED
  trackingCode: string;
  images?: string[];        // Array of blob URLs or remote URLs
}
```

### Trip
```typescript
interface Trip {
  id: string;
  transporterId: string;
  origin: Coordinates;
  destination: Coordinates;
  date: string;
  capacity: 'S' | 'M' | 'L' | 'XL';
}
```

## 5. Mock Services (`services/mockApi.ts`)
*   **loginUser / registerUser:** Returns mock user data with delays.
*   **fetchParcels:** Returns different datasets based on the requesting role (e.g., Transporters see all pending parcels, Senders see only their own).
*   **createParcel:** Simulates saving a new parcel to the backend.

## 6. Future Work / Extensions
*   **Real Map Integration:** Replace `MapCanvas` with Google Maps or Leaflet API.
*   **Real Backend:** Replace `mockApi.ts` with actual Supabase/Firebase calls.
*   **Chat System:** Implement the placeholder Chat UI with real-time sockets.
*   **Payment Gateway:** Integrate Stripe/PayPal in the payment flows.
