# Gilded Events - Setup Guide

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd event-booking-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase and Google AI credentials in `.env.local`:
   - Get Firebase config from [Firebase Console](https://console.firebase.google.com/)
   - Get Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Building for Production

```bash
npm run build
npm start
```

## Key Features

- ✅ Event browsing and search
- ✅ User authentication (Firebase)
- ✅ Booking and reservations
- ✅ AI-powered event recommendations
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Error boundaries for stability
- ✅ Loading states and skeletons

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and data
├── firebase/         # Firebase configuration
└── ai/               # AI flows (Genkit)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript
