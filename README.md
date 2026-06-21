# BPJS TK Technical Test — Web

Vue 3 web application for the BPJS TK technical test. A CV builder form with personal details, professional summary (rich text), employment history, education, and skills sections.

## Tech Stack

### Core
- **[Vue 3](https://vuejs.org/)** (v3.5) — Composition API with `<script setup>` SFC
- **[TypeScript](https://www.typescriptlang.org/)** (v6.0) — type safety
- **[Vite](https://vitejs.dev/)** (v8) — dev server & build tool
- **[Vue Router](https://router.vuejs.org/)** (v5) — client-side routing

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** (v4) — utility-first CSS via `@tailwindcss/vite`
- **[PrimeVue](https://primevue.org/)** (v4) + `@primeuix/themes` — UI component library
- **[PrimeIcons](https://primevue.org/icons/)** & **[Feather Icons](https://feathericons.com/)** — icon sets

### Form & Validation
- **[Vuelidate](https://vuelidate-next.netlify.app/)** (`@vuelidate/core`, `@vuelidate/validators`) — form validation

### Rich Text & Sanitization
- **[Squire RTE](https://github.com/fastmail/Squire)** — rich text editor engine used by `AppBaseEditor`
- **[DOMPurify](https://github.com/cure53/DOMPurify)** — sanitizes HTML output from the editor

### Networking & Utility
- **[Axios](https://axios-http.com/)** — HTTP client
- **[Lodash](https://lodash.com/)** — utilities (debounce, etc.)

### Testing
- **[Vitest](https://vitest.dev/)** — unit test runner

## Prerequisites

- **Node.js** ≥ 20.x (latest LTS recommended)
- **npm** ≥ 10.x (or `pnpm` / `yarn` if preferred)

## Installation

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd Web
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the environment file and fill in the values
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   VITE_API_URL=<backend-api-url>
   ```

## Running the App

### Development server
```bash
npm run dev
```
Open `http://localhost:5173` (Vite's default port).

### Production build
```bash
npm run build
```
Build output is generated in the `dist/` folder. The build runs a type-check (`vue-tsc`) before bundling.

### Preview production build
```bash
npm run preview
```
Serves the built output from `dist/` locally so you can preview it before deploying.

### Testing
```bash
npm run test          # watch mode
npm run test:run      # single run
npm run test:coverage # with coverage report
```

## Project Structure

```
src/
├── components/
│   ├── base/          # base UI components (AppBaseInputText, AppBaseInputDate, AppBaseEditor, etc.)
│   ├── common/        # composite components (AppCommonFormGroup, AppCommonChipInputDialog)
│   └── icon/          # inline SVG icon components
├── modules/
│   └── user/          # user module (views, composables, types)
├── shared/
│   ├── constants/
│   └── types/
├── App.vue
└── main.ts
```

## Troubleshooting

- **Port 5173 already in use** → Vite will automatically pick the next available port; check the terminal output.
- **Type errors during build** → run `npx vue-tsc -b` to see detailed errors.
- **Dependency conflicts during install** → delete `node_modules` and `package-lock.json`, then run `npm install` again.
