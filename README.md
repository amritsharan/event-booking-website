# Gilded Events - Event Booking Platform

A modern, full-featured event booking website built with Next.js, Firebase, and AI-powered recommendations.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 📌 Project Description

**Gilded Events** is a sophisticated event booking platform that allows users to browse events, make reservations, and receive AI-powered personalized event recommendations. The application combines modern web technologies with elegant design principles to provide a premium user experience.

## ✨ Features

- 🎯 **Event Discovery**: Browse and search events with advanced filtering options
- 📅 **Event Details**: View comprehensive event information including schedules, venues, and ticket types
- 🎫 **Ticket Booking**: Seamless booking and reservation process
- 🤖 **AI Recommendations**: Personalized event suggestions powered by Google Gemini
- 👤 **User Authentication**: Secure Firebase authentication
- 📊 **Reservation Management**: Track and manage bookings
- 📱 **Responsive Design**: Optimized for all devices
- 🔍 **SEO Optimized**: Built-in SEO support
- ⚠️ **Error Boundaries**: Robust error handling
- ⚡ **Performance Optimized**: Fast loading with skeleton loaders
- 📧 **Email Notifications**: Booking confirmations via email
- 🎨 **Modern UI**: Elegant design with Radix UI components and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.3.3 with App Router
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS with custom animations
- **Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

### Backend & Services
- **Authentication & Database**: Firebase 11.9.1
- **AI Integration**: Google Genkit with Google Generative AI
- **Email**: Genkit email flows

### Development Tools
- **Language**: TypeScript 5
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint
- **Build Tool**: Turbopack (for dev)
- **Document Generation**: html2canvas, jspdf, pptxgenjs

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase account
- Google AI API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/event-booking-website.git
cd event-booking-website
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Genkit AI
GENKIT_API_KEY=your_google_genkit_api_key
```

**Get these credentials from:**
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://makersuite.google.com/app/apikey)

## ▶️ Running the Project

### Development Server
```bash
npm run dev
```
Visit [http://localhost:9002](http://localhost:9002)

### AI Features (Optional)
For testing AI-powered recommendations:
```bash
npm run genkit:dev
```

Watch mode (auto-reload):
```bash
npm run genkit:watch
```

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── book/              # Booking pages
│   │   ├── checkout/          # Checkout pages
│   │   ├── events/            # Event details pages
│   │   ├── login/             # Authentication pages
│   │   ├── recommendations/   # AI recommendations
│   │   └── reservations/      # User reservations
│   │
│   ├── components/            # React components
│   │   ├── layout/            # Header, footer
│   │   ├── ui/                # Radix UI wrapped components
│   │   ├── event-card.tsx     # Event card component
│   │   ├── login-form.tsx     # Login form
│   │   └── __tests__/         # Component tests
│   │
│   ├── firebase/              # Firebase integration
│   │   ├── config.ts          # Firebase initialization
│   │   ├── firestore/         # Firestore hooks
│   │   ├── provider.tsx       # Firebase provider
│   │   └── error-emitter.ts   # Error handling
│   │
│   ├── ai/                    # AI/Genkit flows
│   │   ├── genkit.ts          # Genkit configuration
│   │   └── flows/             # AI workflows
│   │       ├── personalized-event-recommendations.ts
│   │       └── send-booking-confirmation-email.ts
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── globals.css            # Global styles
│   └── types.ts               # TypeScript type definitions
│
├── public/                    # Static assets
├── docs/                      # Documentation
├── jest.config.js             # Jest configuration
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
├── next.config.ts             # Next.js config
├── package.json               # Dependencies
└── README.md                  # This file
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 9002 |
| `npm run genkit:dev` | Start Genkit AI development server |
| `npm run genkit:watch` | Watch mode for Genkit development |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type check with TypeScript |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |

## 🧪 Testing

Run the full test suite:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm run test:watch
```

Generate a coverage report:
```bash
npm run test:coverage
```

Tests are located in `__tests__` directories alongside components.

## 🎨 Design Guidelines

- **Primary Color**: Dark blue (#192A56) - sophisticated, modern look
- **Background**: Very dark desaturated blue (#1A1E23) - almost black
- **Accent**: Gold (#D4AF37) - highlights and CTAs for luxury feel
- **Headlines Font**: Playfair (serif) - elegance and sophistication
- **Body Font**: PT Sans (sans-serif) - readability and clarity
- **Icons**: Elegant, minimalist event-related icons
- **Animations**: Subtle transitions on interactions

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- Write TypeScript with proper type annotations
- Follow ESLint rules
- Add tests for new features
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Genkit Documentation](https://ai.google.dev/genkit)

## ❓ Support

For questions and support, please open an issue on GitHub or contact the development team.
