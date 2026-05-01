import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { DashboardPreview } from '../components/landing/DashboardPreview';
import { HowItWorks } from '../components/landing/HowItWorks';
import { WhyChooseUs } from '../components/landing/WhyChooseUs';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

const Landing = () => {
  const { user, loading } = useContext(AuthContext);

  // If already logged in, go straight to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <WhyChooseUs />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Landing;
