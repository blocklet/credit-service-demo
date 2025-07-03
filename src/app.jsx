import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import { ThemeProvider } from '@arcblock/ux/lib/Theme';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './components/layout';
import './global.css';
import { SessionProvider } from './libs/session';
import { translations } from './locales';

const Home = React.lazy(() => import('./pages/home'));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <ThemeProvider>
      <SessionProvider>
        <LocaleProvider translations={translations} fallbackLocale="en">
          <Router basename={basename}>
            <App />
          </Router>
        </LocaleProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
