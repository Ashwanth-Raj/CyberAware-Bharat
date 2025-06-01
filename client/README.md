# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


##
cyber-safe-india/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   └── src/
│       ├── assets/         # Images, styles, fonts
│       │   ├── images/
│       │   └── styles/
│       ├── components/     # Reusable UI components
│       │   ├── layout/     # Navbar, Footer, etc.
│       │   │   ├── Navbar.jsx
│       │   │   └── Footer.jsx
│       │   └── common/     # Shared components like buttons, inputs
│       ├── pages/          # Page-level components
│       │   ├── Home/
│       │   │   ├── Home.jsx
│       │   │   └── HeroSection.jsx
│       │   ├── Report/
│       │   │   ├── Report.jsx
│       │   │   ├── AnonToggle.jsx
│       │   │   └── ReportForm.jsx
│       │   └── Scams/
│       │       ├── Scams.jsx
│       │       ├── components/
│       │       │   ├── ScamCard.jsx
│       │       │   ├── ScamFilter.jsx
│       │       │   └── ScamDetailModal.jsx
│       ├── services/       # API calls, Cloudinary, Auth
│       │   ├── api.js
│       │   ├── cloudinary.js
│       │   └── auth.js
│       ├── contexts/       # React Contexts
│       │   └── AuthContext.jsx
│       ├── utils/          # Helper functions
│       │   ├── formatters.js
│       │   └── validators.js
│       ├── App.jsx
│       └── main.jsx
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   │   ├── cloudinary.config.js
│   │   └── db.js
│   ├── controllers/        # Route handlers
│   │   ├── scamController.js
│   │   └── authController.js
│   ├── middleware/         # Express middlewares
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/             # Mongoose models
│   │   ├── Scam.js
│   │   └── User.js
│   ├── routes/             # Express routes
│   │   ├── scamRoutes.js
│   │   └── authRoutes.js
│   ├── uploads/            # Uploaded files
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
├── .env.example            # Sample environment variables
├── .gitignore
├── package.json
└── README.md

##