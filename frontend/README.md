# Unapola Frontend

This is the frontend of the Unapola application, developed with Next.js and Firebase.

## 🚀 Features

- Firebase Authentication
- Real-time database with Firestore
- File storage with Firebase Storage
- Modern and responsive interface with Tailwind CSS
- TypeScript development for better maintainability

## 📋 Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)
- Firebase project with Firestore, Storage and Authentication

## 🔧 Setup

### 1. Environment Variables

Create a `.env` file in the project root with the following variable:

```env
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"your_api_key","authDomain":"your_auth_domain","projectId":"your_project_id","storageBucket":"your_storage_bucket","messagingSenderId":"your_messaging_sender_id","appId":"your_app_id"}
```

Where:
- `apiKey`: Firebase API key
- `authDomain`: Authentication domain (usually `[project-id].firebaseapp.com`)
- `projectId`: Firebase project ID
- `storageBucket`: Storage bucket (usually `[project-id].appspot.com`)
- `messagingSenderId`: Messaging sender ID
- `appId`: Firebase app ID

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

The application will be available at [https://unapola.vercel.app/](https://unapola.vercel.app/)

## 🛠 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the application in production mode
- `pnpm lint` - Run the linter
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js routes and pages
│   │   ├── layout.tsx     # Global layout component
│   │   ├── auth/          # Authentication routes
│   │   ├── (globals)/     # Global routes
│   │   └── page.tsx       # Main page
│   ├── components/        # Reusable components
│   │   ├── ui/            # Basic UI components
│   │   └── *features/     # Feature-specific components
│   ├── lib/              # Utilities and configurations
│   │   ├── api/           # API utilities
│   │   ├── hooks/         # Hook utilities
│   │   ├── constants/     # Constant values
│   │   ├── types/         # TypeScript type definitions
│   │   └── helpers/       # Utility functions
│   └── context/          # State management contexts
└── ...                  # Configurations and dependencies
```

## 🔍 Development

### Style Rules

- Use TypeScript for all code
- Follow React naming conventions
- Keep components small and reusable
- Use Tailwind CSS for styles
- Document complex components

### Testing

The project uses Jest and React Testing Library for testing. Run:

```bash
pnpm test
```

## 📦 Deployment

The application is configured to deploy on Vercel. Automatic deployment is enabled for the `main` branch.

## 🤝 Contributing

The project is [public on GitHub](https://github.com/robertocarlero/unapola).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
