# LeetJudge

LeetJudge is an automated code execution and evaluation platform.

## Project Structure

- `backend/`: The Node.js Express API.
- `.github/workflows/`: GitHub Actions CI/CD workflows.

## Backend Setup

### Option 1: Running with Docker Compose (Recommended)

1. **Environment Setup:**
   Ensure your `.env` is configured properly.
   ```bash
   cd backend
   cp .env.example .env
   cd ..
   ```
2. **Start the containers:**
   ```bash
   docker-compose up --build
   ```
   *Note: This setup includes a volume mount and uses `nodemon`, so any changes you make locally will automatically restart the backend server inside the container!*

### Option 2: Running Locally (For Development)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
4. **Start the server (with hot-reload):**
   ```bash
   npm run dev
   ```

## Testing

The backend uses [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest) for testing. For a detailed guide on how to add and run tests, please refer to the [Testing Documentation](backend/tests/README.md).

```bash
cd backend
npm test
```