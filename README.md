# 🍃 Green Hash — Waste management Geo-Tagged Civic Utility Platform
<img width="1608" height="915" alt="image" src="https://github.com/user-attachments/assets/482140e7-ac29-4904-be63-9a4bdc93d6ef" />

> **Empowering citizens to report local waste sites and assisting municipal authorities in streamlining cleanup efforts through geolocated mapping, real-time collaboration, and gamified civic incentives.**

### 🌐 Live Demo: [green-hash.netlify.app](https://green-hash.netlify.app/)

---

## 🖼️ Screen Previews & User Roles

### 📱 User (Citizen) Interface

* **Interactive Geo-Map:** Citizens can locate waste reports around their neighborhood. Pins are color-coded depending on cleaning status (Red = Needs Cleanup, Yellow = In Progress, Green = Cleaned).
<img width="1663" height="865" alt="image" src="https://github.com/user-attachments/assets/a166fe95-170a-4b75-8d6b-39831c442757" />

* **Community Feed:** Before and after images of reports to showcase the efforts of muncipal  authorities.
<img width="843" height="611" alt="image" src="https://github.com/user-attachments/assets/3f7e3b2a-6269-473d-b8ae-c62a68ae81b2" />

* **Civic Leaderboard & Badges:** Gamified elements showing points earned from submissions and won citizen badges (like *Eco Warrior* and *Citizen of the Week*).
<img width="1604" height="881" alt="image" src="https://github.com/user-attachments/assets/34fa0f6e-8732-4a21-bc73-0a3726aea149" />

### 🛡️ Admin (Municipal) Dashboard

* **Verification & Resolution:** Admins manage reported spots, change status, and are required to upload an "After Image" proof before resolving the report.
  <img width="1748" height="932" alt="image" src="https://github.com/user-attachments/assets/de8caf90-5232-4a7e-bcb3-8c9cbc3f5634" />

* **Route Optimizer:** Built for all the garbage truck drivers to map out and find the most effiecnt way to collect garbage saving fuel and time.
  <img width="1626" height="1008" alt="image" src="https://github.com/user-attachments/assets/f1f68e8a-b009-46c1-bf25-6915798c1a2a" />
  
* **Manage reports:** To mark a waste report cleaned after image is neccesary 
<img width="1578" height="991" alt="image" src="https://github.com/user-attachments/assets/d3390fe7-18bd-4a42-ac9e-173501da5a81" />

---

## 🔑 Demo Credentials

To explore the application's roles and dashboards, you can use the following pre-seeded credentials:

* **Administrator Demo Login:**
  * **Email:** `lordmodizz@gmail.com`
  * **Password:** `123456`
* **Regular Citizen Signup:**
  * Citizens can sign up with any email address directly from the login page (`/` route).


---

## 📱 Core Features

### 1. Crowdsourced Geo-Reporting
* **Zero-Configuration Location Fetching:** Uses the browser's Geolocation API to fetch high-accuracy GPS coordinates on mobile and desktop.
* **Auto-Reverse Geocoding:** Integrates OpenStreetMap's Nominatim API to translate lat/lng coordinates into a human-readable street address instantly.
* **Camera Integration:** Seamlessly launches device cameras on mobile to capture the waste area in real-time.

### 2. Municipal Administrator Dashboard
* **Work Order Management:** Admins can filter reports by status, category, and date to prioritize cleanups.
* **Verification Loop:** Admins must upload an "After Image" as proof of cleanup and write resolution remarks to mark a report as *Completed* or *Cleaned*.
* **System Auditing:** Maintains an activity trail tracking state transitions, timestamps, and admin actions.

### 3. Civic Gamification & Leaderboard
* **Badge System:** Automatically rewards users with achievements (e.g., *First Report*, *Eco Warrior*, *Green Champion*) upon reaching milestones.
* **Auto-Reset Cycles:** PostgreSQL database functions run weekly, monthly, and yearly cycles to crown the top-contributing citizen and reset active scores.

### 4. Real-Time Dashboard Synchronisation
* Built on Supabase Realtime (PostgreSQL Write-Ahead Logging).
* Whenever a report status changes or a new site is uploaded, the state updates dynamically on all connected user dashboards without requiring page reloads.

---

## 🛠️ Technology Stack

| Layer | Technologies | Rationale |
| :--- | :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite | Fast HMR, strict compile-time checks, and component-driven modularity. |
| **UI Library** | shadcn-ui, Radix UI, Tailwind CSS | Accessible headless primitives styled with clean utility-first responsive classes. |
| **BaaS (Backend)** | Supabase (PostgreSQL, Storage, Auth) | Enterprise-grade database, managed file storage, secure auth, and real-time subscription channels. |
| **Maps & Spatial** | Google Maps JS API, OSM Nominatim | Dynamic map rendering, marker styling, bounds clustering, and keyless reverse geocoding. |
| **State & Query** | TanStack React Query, React Context | Server state synchronization, caching, query invalidation, and global auth state. |
| **Analytics** | Recharts, Tailwind CSS | Custom bar/pie charts indicating cleanup efficiency, category distribution, and area scores. |
| **Serverless Edge** | Supabase Edge Functions (Deno) | Secure API key isolation for Google Maps. |

---

## 🏗️ Architecture & Data Flow

```
                                  +------------------------------------+
                                  |         React Frontend App         |
                                  | (Vite, Tailwind, TypeScript, Maps) |
                                  +-----------------+------------------+
                                                    |
             +-----------------------+--------------+---------------+-----------------------+
             |                       |                              |                       |
    [Dynamic API Keys]       [User Auth States]           [Real-Time Updates]           [File Uploads]
             |                       |                              |                       |
             v                       v                              v                       v
+------------------------+ +-------------------+ +------------------------------+ +--------------------+
|  Supabase Edge Funcs   | |   Supabase Auth   | |   Supabase Real-Time WS      | |  Supabase Storage  |
|  (GOOGLE_MAPS_API_KEY)  | |  (auth.users)     | |   (PostgreSQL Replication)   | |  (waste-images)    |
+------------------------+ +-------------------+ +------------------------------+ +--------------------+
                                     |                              ^                       |
                                     v                              |                       |
                           +----------------------------------------+                       |
                           |       PostgreSQL Database Schema       |                       |
                           |  (Triggers, RLS, Functions, Audit)     |<----------------------+
                           +----------------------------------------+
```

---

## 🗄️ Database Design (Schema & PL/pgSQL)

The PostgreSQL database is structured with a highly normalized schema to minimize storage redundancy, prevent update anomalies, and speed up query lookups via indexes.

### Key Database Schema Elements
* **`locations`**: Holds coordinates and unique city/state/country combinations.
* **`categories`**: Normalizes waste types (`Plastic`, `Paper`, `E-waste`, `Hazardous`, etc.) with color codes.
* **`user_statistics`**: Keeps running counts of reports (`weekly_reports`, `monthly_reports`, `total_points`) away from static user profiles.
* **`report_activities`**: Serves as a system audit log, tracking every status update.

### Database Triggers & Functions (PL/pgSQL)
The platform delegates critical business logic to database-level operations:
1. **User Provisioning:** The `on_auth_user_created_normalized` trigger executes `handle_new_user_normalized()` immediately after user registration, creating their profile and initializing statistics.
2. **Gamification engine:** The `update_user_statistics_trigger` updates counts in `user_statistics`, adds a `report_activities` audit row, and automatically assigns the "First Report" badge when a citizen uploads their first site.
3. **Leaderboard resets:** Dynamic stored procedures `reset_weekly_counts()`, `reset_monthly_counts()`, and `reset_yearly_counts()` find top contributors, award them citizen victory badges, and reset active counters.

---

## 🔒 Security Architecture

1. **API Key Isolation:** Client-side Google Maps API keys are vulnerable to theft. In this project, the Google Maps key is stored as an environment variable in the Supabase backend. The frontend requests it dynamically at runtime through a secure, CORS-restricted Supabase Edge Function (`get-google-maps-key`), shielding it from public exposure.
2. **Postgres Row-Level Security (RLS):** Every database table is locked down with granular policies:
   * Citizens can only insert reports and select/update their own profile data.
   * Public SELECT is permitted on lookup reference tables (locations, categories) and leaderboard metrics.
   * Admin routes are protected by policies checking the caller's ID against the secure `admins` table.

---

## ⚙️ Getting Started & Local Setup

Follow these steps to run the application locally:

### 📦 Step 1: Clone the Repository
```bash
git clone https://github.com/PratikModi22/Green-Hash.git
cd Green-Hash
```

### 🔨 Step 2: Install Dependencies
```bash
npm install
```

### 🗝️ Step 3: Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🚀 Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:5173`).

---

## 👥 Impact & Potential Expansion
* **Spatial Deduplication:** Prevent multiple users from reporting the same waste site by checking for existing active reports within a 20-meter radius.
* **Municipal API Integrations:** Integrate with municipal ticketing software (like Open311) to automatically create official city work orders.
* **Offline Reporting:** Store reports in IndexedDB when network coverage is weak, syncing them automatically once internet connectivity is restored.
