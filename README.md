# Blendtune - Music Streaming Platform for Artists and Creators

Blendtune is a sophisticated music streaming platform specifically designed for artists, filmmakers, content creators, and creative professionals. It provides a curated catalog of production music tracks with advanced filtering, browsing, and playback capabilities to help creatives discover and audition the perfect music for their projects.

## 🎵 Overview

Blendtune offers a comprehensive music discovery platform with enterprise-level features including real-time waveform visualization, interactive audio equalizer, advanced multi-dimensional filtering, and secure user authentication. Built with modern web technologies, it delivers a seamless experience across desktop and mobile devices.

## ✨ Key Features

### Audio Playback & Visualization
- **Advanced Audio Player**: Full-featured music player with play/pause, volume control, seeking, and progress tracking
- **Real-time Waveform Visualization**: Interactive audio waveform display rendered using Web Audio API with click-to-seek functionality
- **Frequency Equalizer**: Live frequency analysis and visualization during playback
- **Range Request Streaming**: Efficient HTTP range request support for seamless audio streaming

### Track Discovery & Filtering
- **Comprehensive Catalog**: Rich metadata including arrangement sections, creator information, instruments, and licensing details
- **Multi-dimensional Filtering System**:
  - Genre and subgenre classification
  - Musical key and scale (major/minor)
  - Tempo (BPM) with half-time/double-time support
  - Mood and emotional tags
  - Instruments (main and subcategories)
  - Related artists
  - Keyword search
  - Multiple sorting options
- **Real-time Search**: Instant results with optimized performance
- **Filter Persistence**: State management across sessions

### User Experience
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Progressive Web App (PWA)**: Service worker integration for offline capabilities
- **Dual Player Modes**: Separate mobile and desktop player interfaces
- **Intuitive UI**: Clean, modern interface built with TailwindCSS

### Authentication & Security
- **Secure User Authentication**: Complete auth system with email/password
- **Email Verification**: Account verification via email confirmation
- **Password Reset**: Secure password recovery flow
- **Session Management**: HttpOnly cookies with IP and User-Agent tracking
- **Automatic Session Expiration**: Scheduled cleanup via cron jobs

### Track Metadata
- **Detailed Arrangement Data**: Time-stamped song sections (intro, verse, chorus, bridge, outro)
- **Creator Information**: Multiple creators with role assignments and IPI numbers
- **Sample Clearance Tracking**: Sample pack information and clearance status
- **Exclusive Rights Management**: Artist contact details for licensing inquiries

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.1.7** - React framework with App Router and Server Components
- **React 19.0.0** - UI library with TypeScript
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Redux Toolkit 2.1.0** - State management (limited use)
- **Context API** - Primary state management solution
- **Web Audio API** - Audio processing and visualization
- **FontAwesome** - Icon library
- **rc-slider** - Range input controls

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Primary database with three schemas:
  - `meekah`: Track metadata, arrangements, creators, instruments
  - `auth`: User authentication and sessions
  - `users`: User profiles, roles, billing, playlists
- **Nodemailer** - Email delivery via Gmail SMTP
- **bcrypt** - Password hashing
- **node-cron** - Scheduled task execution

### Infrastructure & Services
- **DigitalOcean Spaces CDN** - Audio file storage and streaming
- **Vercel Functions** - IP address detection
- **Sharp** - Server-side image processing

### Development Tools
- **TypeScript 5.2.2** - Type-safe development
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **Stylelint** - CSS linting
- **Jest** - Unit testing
- **Playwright** - End-to-end testing

## 📁 Project Structure

```
blendtune-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── audio/         # Audio streaming
│   │   │   ├── tracks/        # Track data
│   │   │   ├── auth/          # Authentication
│   │   │   └── account/       # User profile
│   │   ├── auth/              # Auth pages
│   │   ├── sounds/            # Catalog page
│   │   └── ...
│   │
│   ├── client/                # Client-side code
│   │   ├── core/              # Core providers & services
│   │   ├── features/          # Feature modules
│   │   │   ├── auth/          # Authentication
│   │   │   ├── player/        # Audio player
│   │   │   ├── sounds/        # Music catalog
│   │   │   └── tracks/        # Track management
│   │   └── shared/            # Shared utilities
│   │
│   ├── server/                # Server-side code
│   │   ├── config/            # Configuration
│   │   ├── db/                # Database connections
│   │   ├── lib/               # Server utilities
│   │   └── services/          # Business logic
│   │
│   └── shared/                # Shared types
│
├── db/                        # Database files
│   ├── blendtune_tracks_backup.sql
│   └── blendtune_users_backup.sql
│
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database
- DigitalOcean Spaces account (for audio storage)
- Gmail account (for email delivery)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blendtune-nextjs.git
cd blendtune-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Database connection strings
- DigitalOcean Spaces credentials
- Gmail SMTP credentials
- Session secrets

4. Initialize the database:
```bash
# Import the database schemas
psql -U your_user -d your_database < db/blendtune_tracks_backup.sql
psql -U your_user -d your_database < db/blendtune_users_backup.sql
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[User Manual](/docs/manual/)** - End-user guides and tutorials
- **[Developer Guide](/docs/dev/)** - Technical documentation and development roadmap

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Run Stylelint
npm run stylelint
```

## 📦 Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Built with Next.js and React
- Audio visualization powered by Web Audio API
- UI components styled with TailwindCSS
- Icons by FontAwesome

## 📞 Contact

For questions, support, or licensing inquiries, please contact the Blendtune team.

---

**Blendtune** - Empowering creators with the perfect soundtrack
