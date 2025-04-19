# 🛡️ MERN Auth Frontend

**Personal Fullstack Project — Frontend**  
A modern, accessible, and test-driven interface built with **React** and **TypeScript**, forming the frontend of a secure **MERN**-based authentication system.

💡 _Original UI design crafted from scratch by me in Figma._

🔗 Backend repository: [mern-auth-server](https://github.com/n1kFord/mern-auth-server)

---

## ✨ Overview

This project represents the **client-side application** of a MERN-based authentication solution.

It features a responsive, accessible interface with full login/register/OAuth flow and follows best practices in styling, testing, and code quality.

---

## 🌐 Live Demo

You can try the full app here:  
🔗 **[mern-auth-frontend-beta-two.vercel.app](https://mern-auth-frontend-beta-two.vercel.app)**

> ⚠️ **Note:** When opening the app for the first time, the **backend server may take up to one minute to respond**, as it's hosted on a free-tier platform with cold start delays.

---

## 🏁 Getting Started Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/n1kFord/mern-auth-client.git
cd mern-auth-client
npm install
npm start
```

Make sure to start the backend server first:  
🔗 [mern-auth-server](https://github.com/n1kFord/mern-auth-server)

### 📦 Environment Variables

Create a `.env` file in the project root (if you want to override the default API URL):

```env
REACT_APP_API_URL=http://localhost:8080/api
```

> The frontend expects the backend API at `http://localhost:8080/api` by default.  
> Change the port if your server runs on a different one.

---

## 🚀 Features

-   🔐 Full authentication flow: Register, Login, OAuth
-   🛠️ Standard account management functions: Change username, password, delete account
-   🖼️ Unique avatar generation for non-OAuth users
-   ⚛️ Powered by React 18 + TypeScript
-   💅 Styled using `styled-components` and responsive SCSS
-   🎭 Smooth UI animations via `framer-motion`
-   ♿ Accessibility-first: semantic HTML, proper `aria-*` attributes
-   🔍 Integrated testing (unit + accessibility): `jest`, `@testing-library`, `jest-axe`
-   📝 Forms with comprehensive validation using `formik` and `yup`
-   🎯 Linting & formatting with `ESLint`, `Stylelint`, `Prettier`
-   🧰 `CRA-based` setup, customized and production-ready (no Vite)

---

## 🧱 Tech Stack

| Category        | Stack / Library                                 |
| --------------- | ----------------------------------------------- |
| Framework       | React 18 + TypeScript                           |
| Styling         | `styled-components`, SCSS                       |
| Forms           | `formik` + `yup`                                |
| Routing         | `react-router-dom`                              |
| HTTP Client     | `axios`                                         |
| UX Enhancements | `react-hot-toast`, `tooltip`, `framer-motion`   |
| Testing         | `jest`, `@testing-library`, `jest-axe`          |
| Tooling         | `eslint`, `stylelint`, `prettier`, `typescript` |

---

## 🧪 Test & Code Quality

The project includes thorough testing and code quality tooling:

```bash
npm run test            # Run all tests
npm run test:coverage   # Run tests with coverage
npm run lint            # Lint TypeScript/JavaScript
npm run s-lint          # Lint SCSS
npm run s-lint:fix      # Auto-fix SCSS issues
npm run format          # Format code with Prettier
```

```javascript
// Example accessibility test
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

it("Home page should be accessible", async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
```

---

## 📁 NPM Scripts

```bash
npm run start   # Launch dev server
npm run build   # Create production build
npm run eject   # Eject CRA configuration
```

---

## 🗂️ Project Structure

```
client/
├── public/                  # Static HTML and public assets
├── src/
│   ├── assets/              # Images and static resources
│   ├── components/          # Reusable UI components
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page-level components
│   ├── schemas/             # Form validation schemas
│   ├── styles/              # Global styles (SCSS, theme, resets)
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Root app component
│   ├── index.tsx            # Entry point
│   ├── setupTests.ts        # Jest setup
|   └── ...
├── package.json             # Project metadata and scripts
├── eslint.config.mjs        # ESLint configuration
├── .prettierrc              # Prettier configuration
├── .stylelintrc.json        # Stylelint configuration
└── ...


```

---

## 📸 Preview

<p align="center">
  <img src="https://i.imgur.com/P346sC0.jpeg" alt="Preview 1" />
  <br />
  <img src="https://i.imgur.com/bjQbvQY.png" alt="Preview 2" />
  <br />
  <img src="https://i.imgur.com/9fXLtHc.png" alt="Preview 3" />
  <br />
  <img src="https://i.imgur.com/mLd66SR.png" alt="Preview 4" />
  <br />
  <img src="https://i.imgur.com/eHZeSwB.png" alt="Preview 5" />
</p>

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE) — feel free to use, modify, and distribute with attribution.

> 💡 Created with care by [@n1kFord](https://github.com/n1kFord)
