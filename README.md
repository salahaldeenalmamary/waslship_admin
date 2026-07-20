# WaslShip - Logistics Dashboard

A professional, high-performance logistics and shipping management dashboard built with React and Vite. This application is designed to interface with the OTO Logistics Gateway.

## 🚀 Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router 7
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: React Hooks
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 🛠️ Features

- **Real-time Dashboard**: Overview of total shipments, in-transit packages, and wallet balance.
- **Shipment Management**: Track and manage shipments across multiple couriers (Aramex, SMSA, SPL, etc.).
- **Courier Rate Comparison**: Quick calculator to compare shipping costs between different providers.
- **Webhook Integration**: Full CRUD interface for managing OTO API webhooks with loading/error states.
- **Responsive Design**: Polished, desktop-first UI that adapts gracefully to smaller screens.

## 🔌 Connecting to ASP.NET Core Backend

To connect this frontend to your local ASP.NET Core API, follow these steps:

### 1. Configure Environment Variables
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1/admin
```

### 2. Enable CORS in ASP.NET Core
In your `Program.cs` or `Startup.cs`, ensure CORS is enabled to allow requests from the React development server:



## 📂 Project Structure

- `src/features/`: Modularized feature logic (Dashboard, Shipments, Settings).
- `src/services/`: API client and service layer (Axios).
- `src/hooks/`: Custom TanStack Query hooks for data fetching.
- `src/layouts/`: Reusable page wrappers (Sidebar, Header).
- `src/components/ui/`: Atomic UI components (MetricCards, Buttons).

## 🏃 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
