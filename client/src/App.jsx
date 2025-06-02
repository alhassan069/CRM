import { useLayoutEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/site/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import ContactForm from "./pages/ContactForm";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import DealForm from "./pages/DealForm";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import OrganizationForm from "./pages/OrganizationForm";
import Reports from "./pages/Reports";
import NotFound from "./pages/site/NotFound";
import Terms from "./pages/site/Terms";
import Privacy from "./pages/site/Privacy";
import Contact from "./pages/site/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/shadcn_components/theme-provider";

export default function App() {
  const { user, checkAuth } = useAuth();
  useLayoutEffect(() => {
    checkAuth();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={user ? <Navigate replace to={"/dashboard"} /> : <Navigate replace to={"/home"} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {user && (
          <>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/new" element={<ContactForm />} />
              <Route path="contacts/:id" element={<ContactDetail />} />
              <Route path="contacts/:id/edit" element={<ContactForm />} />
              <Route path="deals" element={<Deals />} />
              <Route path="deals/new" element={<DealForm />} />
              <Route path="deals/:id" element={<DealDetail />} />
              <Route path="deals/:id/edit" element={<DealForm />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="organizations/new" element={<OrganizationForm />} />
              <Route path="organizations/:id" element={<OrganizationDetail />} />
              <Route path="organizations/:id/edit" element={<OrganizationForm />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </>
        )}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}