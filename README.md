# Chess Review App

A web application for reviewing chess puzzles with an advanced rating system that tracks your progress across different themes (tactics, endgame, etc.).

## Features

- User authentication and authorization
- Puzzle storage and retrieval with filtering
- Advanced Glicko-2 rating system
  - Overall rating tracking
  - Theme-specific ratings (tactics, endgame, opening, etc.)
- Comprehensive test coverage

## Tech Stack

- **Backend**
  - Node.js/Express
  - MongoDB/Mongoose
  - JWT Authentication
  - Glicko-2 Rating System
- **Testing**
  - Jest
  - Supertest
  - MongoDB Memory Server

## Getting Started

### Prerequisites

Choose one of these options:

**Option 1: Docker (Recommended)**
- Docker and Docker Compose
- Docker Desktop (for Mac/Windows)

**Option 2: Local Setup**
- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

### Installation

#### Using Docker (Recommended)

```bash
# Make sure Docker Desktop is running (Mac/Windows)
# Start everything with one command
docker compose up --build
```

The app will be available at http://localhost:5000

To verify it's working:
```bash
# Test the base endpoint
curl http://localhost:5000
# Should return: {"message":"Welcome to Chess Review App API"}

# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login to get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

#### Manual Setup

1. Clone the repository
```bash
git clone <repository-url>
cd chess-review-app
```

2. Install dependencies
```bash
# Install everything with one command
npm run setup
```

3. Environment Setup
```bash
# Copy the example env file and start the app
npm run init
```

### Running the App

```bash
# Development mode
npm run dev

# Run tests
npm test

# Production mode
npm start
```

### Environment Variables

All environment variables have defaults - you only need to set them if you want to override:

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chess-review-app
JWT_SECRET=your-secret-key
NODE_ENV=development
```

Note: When using Docker, these environment variables are automatically set in the docker-compose.yml file.

## API Examples

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "email": "test@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Get Puzzles
```bash
curl http://localhost:5000/api/puzzles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -G \
  --data-urlencode "difficulty=beginner" \
  --data-urlencode "theme=tactics"
```

### Submit Puzzle Attempt
```bash
curl -X POST http://localhost:5000/api/puzzles/attempt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"puzzleId": "123", "moves": ["e2e4", "e7e5"], "timeSpent": 45}'
```

## Project Structure

```
chess-review-app/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── tests/          # Test files
│   └── server.js       # Server entry point
├── frontend/           # Frontend code (coming soon)
└── package.json
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Puzzle Endpoints

- `GET /api/puzzles` - Get puzzles (with pagination and filters)
- `POST /api/puzzles/attempt` - Submit a puzzle attempt

## Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run with coverage
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
