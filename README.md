# VarsityX - Student Marketplace Platform

![VarsityX Logo](client/public/vite.svg)

VarsityX is a secure, AI-powered marketplace exclusively for university students in Bangladesh. The platform enables students to buy, sell, and connect with verified peers in their campus community.

## 🌟 Features

### Core Features
- **Student Verification System** - University email verification and academic profiles
- **Smart Marketplace** - AI-powered search with flexible pricing options
- **Safe Campus Meetups** - Interactive campus maps for secure in-person exchanges
- **Real-time Messaging** - Instant communication with image sharing
- **Multi-University Support** - Supports IUT, BUET, DU, BRAC, NSU

### AI-Powered Features
- 🤖 **Price Advisor** - AI-driven price suggestions based on historical data
- 🔍 **Smart Search** - Natural language listing search
- 📷 **Condition Estimator** - Automated item condition assessment
- 👁️ **Visual Search** - Find similar items using image recognition

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Socket.io Client for real-time features
- MapboxGL for maps integration
- Framer Motion for animations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.io for real-time communication
- Passport.js for authentication
- Google Cloud AI/ML services

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register
```
Register a new student account.
| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | University email address |
| password | string | User password |
| displayName | string | User's display name |
| university | string | University name (IUT/BUET/DU/BRAC/NSU) |

```http
POST /api/auth/login
```
Login to existing account.
| Parameter | Type | Description |
|-----------|------|-------------|
| email | string | Registered email |
| password | string | Account password |

### Marketplace Endpoints

```http
GET /marketplace
```
Get all listings with optional filters.
| Query Parameter | Type | Description |
|----------------|------|-------------|
| search | string | Search term |
| category | string | Category filter |
| university | string | University filter |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| condition | string | Item condition |

```http
POST /marketplace
```
Create a new listing.
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Listing title |
| description | string | Yes | Detailed description |
| price | number | Yes* | Fixed price amount |
| startingBid | number | Yes* | Starting bid amount |
| hourlyRate | number | Yes* | Hourly service rate |
| category | string | Yes | Product category |
| condition | string | No | Item condition |
| images | array | Yes | Product images |

*One of price/startingBid/hourlyRate required based on priceType

### Reviews Endpoints

```http
GET /reviews/listing/:listingId
```
Get reviews for a specific listing.

```http
POST /reviews/listing/:listingId
```
Create a review for a listing.
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rating | number | Yes | Rating (1-5) |
| comment | string | No | Review text |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/VarsityX.git
cd VarsityX
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Server .env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Client .env
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_HUGGINGFACE_API_KEY=your_huggingface_key
```

4. Run the development servers
```bash
# Run server
cd server
npm run dev

# Run client
cd client
npm run dev
```

## 🔐 Security Features

- JWT-based authentication
- University email verification
- Rate limiting on API endpoints
- Input sanitization
- Secure file upload validation
- CORS protection
- Password hashing with bcrypt

## 🗺️ Safe Meetup Locations

The platform includes verified safe meetup locations across supported universities:
- Monitored areas
- Security camera coverage
- High foot traffic zones
- Campus security presence

## 📱 Progressive Web App Features

- Responsive design
- Offline functionality
- Push notifications
- Home screen installation

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guidelines for details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Siyam Bhuiyan - Full Stack Developer & Project Lead
- [Add other team members]

## 📞 Support

For support, email support@varsityx.com or join our Discord community.

---
Built for students, by students
```
