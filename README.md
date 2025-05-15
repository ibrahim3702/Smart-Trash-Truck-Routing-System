# Smart Trash Truck Routing

Smart Trash Truck Routing is a web application for optimizing waste collection routes using advanced algorithms and interactive map visualizations. The app allows users to input bin and truck data, visualize optimized routes, simulate fill levels, and analyze system performance.

## Features

- **Interactive Map**: Add, move, and visualize bins and trucks on a map.
- **Route Optimization**: Uses algorithms (MST, clustering, DP) to generate efficient truck routes.
- **Simulation**: Predicts bin fill levels and simulates collection over time.
- **Analytics**: Dashboard with stats, route comparison, and advanced analytics.
- **Customizable Settings**: Adjust optimization parameters and thresholds.
- **Data Export/Import**: Save and load system state as JSON.
- **Guided Tour & Help Center**: Onboarding and contextual help for users.

## Tech Stack

- **Next.js** (App Router, SSR)
- **React** (with hooks)
- **Tailwind CSS** (customized via [tailwind.config.ts](tailwind.config.ts))
- **Framer Motion** (animations)
- **Lucide Icons**
- **Custom Algorithms** (in [`lib/routing-algorithms`](lib/routing-algorithms.ts))
- **Shadcn/ui** (UI components)

## Project Structure

```
.
├── app/                # Next.js app directory (pages, layout, providers)
├── components/         # UI and feature components
├── hooks/              # Custom React hooks
├── lib/                # Algorithms, utilities, types
├── public/             # Static assets
├── styles/             # Additional CSS
├── tailwind.config.ts  # Tailwind CSS config
├── postcss.config.mjs  # PostCSS config
├── package.json        # Project metadata and scripts
└── ...
```

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **pnpm** (or npm/yarn)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ibrahim3702/Smart-Trash-Truck-Routing-System.git
   cd smart-trash-routing
   ```

2. **Install dependencies:**
   ```sh
   pnpm install
   ```
   Or use `npm install` or `yarn` if you prefer.

### Running the Development Server

```sh
pnpm dev
```
Or:
```sh
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```sh
pnpm build
pnpm start
```
Or:
```sh
npm run build
npm start
```

### Linting

```sh
pnpm lint
```
Or:
```sh
npm run lint
```

## Customization

- **Tailwind CSS**: Edit [tailwind.config.ts](tailwind.config.ts) and [app/globals.css](app/globals.css).
- **UI Components**: Located in [components/](components/).
- **Algorithms**: Modify or extend in [lib/routing-algorithms.ts](lib/routing-algorithms.ts).

## Data Export/Import

- Use the export button in the UI to download all system data as JSON.
- To import, use the corresponding import feature (if available) or manually load data in development.

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is for educational/demo purposes.

---

**Maintainer:** [Your Name or Organization]
