# Restaurant Marketplace

A restaurant marketplace application with a mobile frontend (React Native/Expo) and a backend API (Node.js/Express) that provides restaurant listings sorted by distance from the user's location.

## Features

- Restaurant listing with distance-based sorting
- Real-time distance calculation using Haversine formula
- Restaurant detail pages with menu items
- User authentication and location tracking
- Backend-sorted restaurant results

## Prerequisites

- Node.js and npm installed
- Docker installed (for PostgreSQL database)
- Expo CLI installed (for mobile app development)
- Bun runtime (for backend)

## Backend Setup

### 1. Start PostgreSQL Database

Run the following command to start a PostgreSQL container:

```bash
docker run -d --name prisma-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  postgres:15
```

### 2. Configure Environment Variables

Navigate to the backend directory and copy the environment example file:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database connection details if needed.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Seed the Database

Populate the database with sample restaurant and user data:

```bash
npm run seed
```

### 7. Start the Backend Server

```bash
npm run dev
```

The backend server will run on `http://localhost:3000` by default.

### 8. Optional: Open Prisma Studio

To view and manage database records through a GUI:

```bash
npx prisma studio
```

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Mobile App

For Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

## Backend Architecture

### API Endpoints

The backend provides the following REST endpoints:

- `POST /restaurants` - Fetch all restaurants sorted by distance
- `POST /restaurants/:restaurantId` - Fetch a specific restaurant by ID
- `POST /users` - Create a new user account

### Restaurant Listing Logic

The restaurant listing endpoint processes requests as follows:

1. **Request Processing**: The endpoint receives a username in the request body to identify the user.

2. **User Location Retrieval**: The system queries the database to fetch the user's stored latitude and longitude coordinates.

3. **Restaurant Data Fetching**: All restaurants are retrieved from the database along with their associated menu items.

4. **Distance Calculation**: For each restaurant, the Haversine formula is applied to calculate the distance between the user's location and the restaurant's location. The distance is computed in kilometers.

5. **Distance Sorting**: All restaurants are sorted in ascending order based on their calculated distance from the user's location. The nearest restaurant appears first in the results.

6. **Response Formatting**: The sorted list of restaurants, each including its calculated distance, is returned to the client in a standardized API response format.

### Restaurant Detail Logic

The restaurant detail endpoint follows a similar pattern:

1. **Request Validation**: Validates that both username and restaurant ID are provided.

2. **User and Restaurant Lookup**: Fetches the user's location and the requested restaurant data from the database.

3. **Distance Calculation**: Calculates the distance between the user and the specific restaurant using the Haversine formula.

4. **Response**: Returns the restaurant details including menu items and the calculated distance.

## Distance Calculation

The application uses the Haversine formula to calculate the great-circle distance between two points on the Earth's surface given their latitude and longitude coordinates.

### Haversine Formula (Mathematical Reference)

Given:
- User location → (lat₁, lon₁)
- Restaurant location → (lat₂, lon₂)

The formula calculates the great-circle distance between two points on Earth.

**Mathematical Formula:**

```
a = sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2)

c = 2 · atan2(√a, √(1−a))

distance = R · c
```

Where:
- **R** = 6371 km (Earth's radius)
- **φ₁, φ₂** = latitudes in radians
- **λ₁, λ₂** = longitudes in radians
- **Δφ** = difference in latitude (φ₂ - φ₁)
- **Δλ** = difference in longitude (λ₂ - λ₁)

**Note:** Latitudes and longitudes must be converted from degrees to radians before calculation.

### Haversine Formula Implementation

The distance calculation is performed in the `backend/src/utils/distance.ts` file using the following mathematical approach:

1. **Coordinate Conversion**: Latitude and longitude values are converted from degrees to radians.

2. **Haversine Calculation**: The formula computes the distance using:
   - Earth's radius: 6371 kilometers
   - Difference in latitude and longitude between the two points
   - Trigonometric functions (sine and cosine) to account for the Earth's curvature

3. **Formula Steps**:
   - Calculate the squared sine of half the latitude difference
   - Add the product of cosines of both latitudes and the squared sine of half the longitude difference
   - Apply the inverse tangent function to compute the central angle
   - Multiply by Earth's radius to get the distance in kilometers

4. **Result**: The function returns the distance in kilometers, rounded to two decimal places for display purposes.

The Haversine formula provides accurate distance calculations for most practical purposes, with an error margin of less than 0.5% for typical use cases.

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Stores user information including username, email, and location coordinates
- **Restaurant**: Stores restaurant details including name, description, tags, image URL, and location coordinates
- **Menu**: Stores menu items associated with restaurants, including item name, price, description, image, and vegetarian status

## Technology Stack

### Backend
- Node.js with Express.js
- Bun runtime
- Prisma ORM
- PostgreSQL database
- TypeScript

### Frontend
- React Native
- Expo framework
- TypeScript
- NativeWind (Tailwind CSS for React Native)
