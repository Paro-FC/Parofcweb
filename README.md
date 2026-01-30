# FC Barcelona Website - Next.js + TypeScript

A modern replica of the FC Barcelona website built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- ⚡ Next.js 16 with App Router
- 🔷 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- ✨ Framer Motion for animations
- 📱 Fully responsive design
- 🎯 Magic UI components

## Getting Started

### Prerequisites

- Node.js 20.18+ (required for Next.js 16)
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   ├── ui/           # UI components (Button, Card, etc.)
│   │   └── ...           # Section components
│   ├── lib/              # Utilities
│   └── index.css         # Global styles
├── public/               # Static assets
│   └── assets/           # Images and media
└── ...
```

## Technologies

- **Next.js 16** - React framework
- **React 19** - Latest React version
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## License

MIT
