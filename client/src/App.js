import React, { useState, useMemo, useEffect } from 'react';
import { LogIn, Map, User, Globe, Info, Mail, Search, Award, Compass, Heart, Calendar, Save, X } from 'lucide-react';
// CSS is loaded via index.css

// --- FIREBASE IMPORTS REMOVED ---

// --- NAVIGATION & VIEWS ---
const VIEWS = {
  HOME: 'HOME',
  ITINERARIES_LIST: 'ITINERARIES_LIST', // General Itineraries link
  ABOUT: 'ABOUT',
  CONTACT: 'CONTACT',
  DETAIL: 'DETAIL', // Country Destination Detail (List of sub-destinations)
  ITINERARY_DETAIL: 'ITINERARY_DETAIL', // Sub-Destination Itinerary (Daily Plan)
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
};

// --- COMPONENTS ---

// 1. Navigation Bar 
const Navbar = ({ isLoggedIn, currentView, setView, onLogout }) => {
  const navItems = [
    { label: 'Destinations', view: VIEWS.HOME }, 
    { label: 'Itineraries', view: VIEWS.ITINERARIES_LIST },
    { label: 'About', view: VIEWS.ABOUT },
    { label: 'Contact', view: VIEWS.CONTACT },
  ];

  return (
    <nav className="navbar" style={{ padding: '0.75rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
      <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => setView(VIEWS.HOME)} className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Globe style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5' }} />
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1f2937' }}>Wanderlust</span>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="nav-links" style={{ display: 'flex', gap: '0.5rem' }}>
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`nav-item ${currentView === item.view ? 'nav-item-active' : ''}`}
                style={{ fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s', background: 'none', border: 'none', cursor: 'pointer', color: currentView === item.view ? '#4f46e5' : '#4b5563' }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="nav-button-signin" style={{ backgroundColor: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }} 
            >
              <User style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Logout
            </button>
          ) : (
            <button
              onClick={() => setView(VIEWS.LOGIN)}
              className="nav-button-signin" style={{ backgroundColor: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
            >
              <LogIn style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} /> Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

// 2. Login Screen (No changes needed)
const LoginScreen = ({ onLoginSuccess, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => { 
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store the token (used for subsequent authenticated requests)
            localStorage.setItem('authToken', data.token);
            console.log("Login Success! Token:", data.token); 
            onLoginSuccess();
        } else {
            setError(data.message || 'Login failed. Check server response.');
        }

    } catch (err) {
        console.error("Network Error during login:", err);
        setError('A network error occurred. Is the server running?');
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="login-screen" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
      <div className="login-card" style={{ maxWidth: '400px', width: '90%', padding: '2.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Globe style={{ width: '2rem', height: '2rem', color: '#4f46e5' }} />
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginLeft: '0.5rem', color: '#1f2937' }}>Wanderlust</h1>
        </div>
        <h2 className="login-title" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
            />
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <a href="#" style={{ fontSize: '0.75rem', color: '#4f46e5' }}>
                Forgot password?
              </a>
            </div>
          </div>
          {error && <p className="login-error" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
            style={{ padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign in'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
              Don't have an account?{' '}
              <button onClick={() => setView(VIEWS.REGISTER)} style={{ color: '#4f46e5', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};


// 3. Registration Screen Component (No changes needed)
const RegistrationScreen = ({ setView }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5000/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message || 'Registration successful! Please log in.');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => setView(VIEWS.LOGIN), 2000);
            } else {
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error("Network Error during registration:", err);
            setError('A network error occurred. Is the server running?');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-screen" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
            <div className="login-card" style={{ maxWidth: '400px', width: '90%', padding: '2.5rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Globe style={{ width: '2rem', height: '2rem', color: '#4f46e5' }} />
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginLeft: '0.5rem', color: '#1f2937' }}>Wanderlust</h1>
                </div>
                <h2 className="login-title" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create password"
                            required
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4b5563', marginBottom: '0.25rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none' }}
                        />
                    </div>
                    {error && <p className="login-error" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{error}</p>}
                    {successMessage && <p className="login-error" style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.5rem' }}>{successMessage}</p>}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isSubmitting}
                        style={{ padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: '600', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                            Already have an account?{' '}
                            <button onClick={() => setView(VIEWS.LOGIN)} style={{ color: '#4f46e5', fontWeight: '500', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
                                Sign in
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};


// 4. Country Card Component (FINAL VISUAL FIXES APPLIED)
const CountryCard = ({ country, onSelectCountry }) => (
  <button
    onClick={() => onSelectCountry(country)}
    className="country-card"
    style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      borderRadius: '0.75rem', 
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)', 
      cursor: 'pointer', 
      border: 'none', 
      width: '100%', 
      aspectRatio: '4/3',
      padding: 0,
      // Setting the main background here using the provided image URL
      backgroundImage: `url(${country.image})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    }}
  >
    
    <div className="country-card-overlay"
      style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        // Strong gradient for legibility over the image
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)', 
        color: 'white', 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'flex-end',
        textAlign: 'left'
      }}
    >
      <p className="country-card-motto" style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.25rem', fontWeight: 500 }}>
        {country.destinations.length} DESTINATIONS
      </p>
      <h3 className="country-card-name" style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0, lineHeight: 1 }}>
        {country.country}
      </h3> 
      <p className="country-card-motto-detail" style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem', lineHeight: 1.4, maxWidth: '90%' }}>
        {country.motto}
      </p>
    </div>
  </button>
);

// 5. Home Page (Uses live data from state)
const HomePage = ({ setView, onSelectCountry, countries, isLoading }) => {
    if (isLoading) {
        return <div className="page-container" style={{ padding: '8rem', textAlign: 'center', fontSize: '1.5rem' }}>Loading destinations from MongoDB...</div>;
    }
    
    if (countries.length === 0) {
      return <div className="page-container" style={{ padding: '8rem', textAlign: 'center', fontSize: '1.5rem' }}>No countries found. Please seed your MongoDB 'destinations' collection.</div>;
    }
    
    return (
      <div className="page-container" style={{ overflowX: 'hidden' }}> {/* Added overflow-x hidden to prevent horizontal scrolling */}
        {/* Hero Section - FINAL FIXES APPLIED */}
        <header className="hero-header"
                style={{ 
                  // FIXED: Clean background URL (removed artifact text and used a visually appropriate placeholder)
                  backgroundImage: `url(https://images.unsplash.com/photo-1510511459019-5beee49a1fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNTkyMzF8MHwxfGFsbHwxfHx8fHx8fHwxNjQ3MjY4ODAw&ixlib=rb-1.2.1&q=80&w=1200)`, 
                  minHeight: '35rem', 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4rem 1.5rem',
                  textAlign: 'center',
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                }}>
          <div className="hero-overlay" style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '1rem', padding: '3rem 2rem', maxWidth: '48rem', margin: '0 auto' }}> 
            <div style={{ maxWidth: '48rem', margin: '0 auto' }}> 
              <h1 className="hero-title" style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                Your Journey Starts Here
              </h1>
              <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: '#d1d5db', marginBottom: '2rem', marginTop: '1rem' }}>
                Discover curated travel itineraries for the world's most amazing destinations.
              </p>
              <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setView(VIEWS.HOME)}
                  className="hero-button-primary"
                  style={{ padding: '0.75rem 2rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                  Explore Destinations
                </button>
                <button
                  onClick={() => setView(VIEWS.ITINERARIES_LIST)}
                  className="hero-button-secondary"
                  style={{ padding: '0.75rem 2rem', backgroundColor: 'transparent', color: 'white', fontWeight: 600, borderRadius: '0.5rem', border: '2px solid white', cursor: 'pointer', transition: 'border-color 0.2s' }}
                >
                  View Itineraries
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Why Choose Wanderlust Section - FINAL FIXES APPLIED */}
        <section className="section-white" style={{ padding: '4rem 1.5rem', textAlign: 'center', backgroundColor: 'white' }}>
          <div className="nav-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="section-title-small" style={{ fontSize: '1rem', fontWeight: 600, color: '#4f46e5', marginBottom: '0.5rem' }}>Why Choose Wanderlust</h2>
            {/* FIXED: Max width added to prevent awkward line breaks and large white space */}
            <p className="section-title-large" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1f2937', marginBottom: '3rem', lineHeight: 1.3, maxWidth: '600px', margin: '0 auto 3rem auto' }}>
              We make travel planning simple and enjoyable with expertly crafted itineraries.
            </p>

            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div className="feature-card" style={{ padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'white' }}>
                <Award className="feature-icon" style={{ width: '2.5rem', height: '2.5rem', color: '#4f46e5', margin: '0 auto 1rem auto' }} />
                <h3 className="feature-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Expert Travel Guides</h3>
                <p className="feature-text" style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>Curated itineraries from local experts and seasoned travelers.</p>
              </div>
              <div className="feature-card" style={{ padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'white' }}>
                <User className="feature-icon" style={{ width: '2.5rem', height: '2.5rem', color: '#4f46e5', margin: '0 auto 1rem auto' }} />
                <h3 className="feature-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Custom Planning</h3>
                <p className="feature-text" style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>Build your perfect trip day by day based on your preferences.</p>
              </div>
              <div className="feature-card" style={{ padding: '1.5rem', borderRadius: '0.75rem', backgroundColor: 'white' }}>
                <Compass className="feature-icon" style={{ width: '2.5rem', height: '2.5rem', color: '#4f46e5', margin: '0 auto 1rem auto' }} />
                <h3 className="feature-heading" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>Discover Hidden Gems</h3>
                <p className="feature-text" style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>Find secret spots and experiences away from tourist crowds.</p>
              </div>
            </div>
          </div>
        </section>


        {/* Popular Destinations Section - FINAL FIX: Centering and viewport responsiveness */}
        <section className="section-gray" style={{ padding: '4rem 1.5rem', backgroundColor: '#f9fafb' }}>
          <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title-large" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#1f2937' }}>Popular Destinations</h2>
            <p style={{ color: '#4b5563', marginBottom: '3rem', fontSize: '1rem' }}>
              Explore our handpicked collection of incredible countries, each with unique experiences waiting for you.
            </p>

            {/* FIXED: The grid itself is now perfectly centered and limited in size */}
            <div className="destinations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}> 
              {countries.map(country => (
                <CountryCard key={country._id} country={country} onSelectCountry={onSelectCountry} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                {/* The button is now centered via margin: 0 auto and should not cause overflow */}
                <button onClick={() => setView(VIEWS.HOME)} style={{ color: '#4f46e5', fontWeight: 600, fontSize: '1.125rem', display: 'flex', alignItems: 'center', margin: '0 auto', background: 'none', border: 'none', cursor: 'pointer' }}>
                    View All Destinations <Map style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }}/>
                </button>
            </div>
          </div>
        </section>
      </div>
    );
};


// 6. Destination Detail Page (Country -> List of Sub-Destinations) - FINAL FIXES
const DestinationDetail = ({ selectedCountry, setView, onSelectDestination }) => {
  const country = selectedCountry;
  const destinations = country?.destinations || [];

  if (!country) return <div style={{ padding: '8rem', textAlign: 'center', fontSize: '1.5rem' }}>Country details not loaded.</div>;

  return (
    <div className="detail-page-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <button
          onClick={() => setView(VIEWS.HOME)}
          style={{ fontWeight: 500, marginBottom: '2rem', display: 'flex', alignItems: 'center', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ marginRight: '0.5rem' }}>&larr;</span> Back to Home
        </button>

        <div className="detail-content-wrapper">
          <h1 className="detail-heading" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1f2937' }}>{country.country}: Itineraries & Highlights</h1>
          <p className="detail-subtitle" style={{ fontSize: '1.125rem', color: '#4b5563', marginBottom: '3rem' }}>{country.description}</p>

          <div className="destination-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {destinations.map((dest, index) => (
              <div key={index} className="destination-card detail-itinerary-card" 
                style={{ 
                  backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', overflow: 'hidden'
                }}
              >
                <div 
                  className="destination-card-image-bg"
                  style={{ 
                    // Use destination's image URL
                    backgroundImage: `url(${dest.image})`, 
                    height: '160px', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    position: 'relative'
                  }}
                >
                   {/* FINAL FIX: Clear display of the destination name */}
                   <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 100%)', padding: '0.75rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <h3 className="destination-name-overlay" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{dest.name}</h3>
                   </div>
                </div>
                
                <div className="destination-card-content" style={{ padding: '1.5rem' }}>
                  <p className="destination-detail" style={{ color: '#4b5563', lineHeight: 1.5, minHeight: '60px' }}>{dest.detail}</p>
                  <button 
                    className="destination-itinerary-link"
                    onClick={() => onSelectDestination(dest, country)} 
                    disabled={!dest.itinerary || dest.itinerary.length === 0}
                    style={{ 
                        marginTop: '1rem', padding: '0.5rem 0', fontWeight: 600, color: '#4f46e5', 
                        display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer'
                    }}
                  >
                    View Itineraries
                    <span style={{ marginLeft: '0.25rem' }}>&rarr;</span>
                  </button>
                  {(!dest.itinerary || dest.itinerary.length === 0) && (
                      <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
                          (Itinerary not seeded)
                      </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// 7. Itinerary Detail Page (Sub-Destination -> Daily Plan) - Fixed alignment
const ItineraryDetailPage = ({ selectedDestination, selectedCountry, setView, onSaveItinerary, isSaving }) => {
    const destination = selectedDestination;
    const country = selectedCountry;
    const itinerary = destination?.itinerary || [];

    if (!destination) return <div style={{ padding: '8rem', textAlign: 'center', fontSize: '1.5rem' }}>Itinerary details not loaded.</div>;

    return (
        <div className="detail-page-container" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '4rem' }}>
             <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                <button
                    onClick={() => setView(VIEWS.DETAIL)}
                    style={{ fontWeight: 500, marginBottom: '2rem', display: 'flex', alignItems: 'center', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span style={{ marginRight: '0.5rem' }}>&larr;</span> Back to {country.country} Destinations
                </button>

                <div className="detail-content-wrapper">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ maxWidth: '70%' }}>
                          {/* FIXED: Adjusted font weight for the header for better hierarchy */}
                          <h1 className="detail-heading" style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#1f2937' }}>The {destination.name} Travel Plan</h1>
                          <p className="detail-subtitle" style={{ fontSize: '1.125rem', color: '#4b5563', marginTop: '0.5rem', maxWidth: '800px', lineHeight: 1.5 }}>{destination.detail}</p>
                      </div>
                      <button 
                          className="hero-button-primary"
                          onClick={onSaveItinerary}
                          disabled={isSaving}
                          style={{ 
                              padding: '0.75rem 1.25rem', 
                              backgroundColor: isSaving ? '#9ca3af' : '#10b981',
                              minWidth: '180px',
                              borderRadius: '0.5rem',
                              fontWeight: 600,
                              transition: 'background-color 0.2s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: 'none', cursor: 'pointer', color: 'white'
                          }}
                      >
                          <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}/>
                          {isSaving ? 'Saving...' : 'Save Itinerary'}
                      </button>
                    </div>
                    
                    <div className="itinerary-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {itinerary.map((dayPlan, index) => (
                            <div key={index} className="itinerary-day-card"
                                style={{ 
                                    backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', 
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', borderLeft: '5px solid #4f46e5'
                                }}
                            >
                                <div className="itinerary-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                    <Calendar className="itinerary-icon" style={{ width: '1.5rem', height: '1.5rem', color: '#4f46e5', marginRight: '0.75rem' }} />
                                    <h3 className="itinerary-day-title" style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Day {dayPlan.day}</h3>
                                </div>
                                <p className="itinerary-activity" style={{ fontSize: '1rem', lineHeight: 1.6, color: '#374151' }}>
                                    {dayPlan.activity}
                                </p>
                            </div>
                        ))}
                    </div>

                    {itinerary.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '4rem', fontSize: '1.25rem', color: '#4b5563' }}>
                            No detailed daily plan available for {destination.name}.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// 8. Dedicated About Page (FIXED: Simplified Content)
const AboutPage = ({ setView }) => (
    <div className="placeholder-page" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className="placeholder-card" style={{ maxWidth: '600px', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', margin: '0 1.5rem' }}>
            <Info style={{ width: '3rem', height: '3rem', color: '#6366f1', margin: '0 auto 1.5rem auto' }} />
            <h1 className="placeholder-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>About Wanderlust</h1>
            <p className="placeholder-text" style={{ textAlign: 'justify', lineHeight: 1.6, color: '#374151' }}>
                Wanderlust is a travel planning application designed to showcase beautiful and functional web development. We provide meticulously curated travel itineraries for the world's most amazing destinations.
                <br/><br/>
                Our mission is to inspire and simplify global travel planning, allowing users to save and manage their customized trip ideas seamlessly.
            </p>
            <button
                onClick={() => setView(VIEWS.HOME)}
                className="placeholder-button"
                style={{ marginTop: '2rem', padding: '0.75rem 2rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
                Start Exploring
            </button>
        </div>
    </div>
);

// 9. Dedicated Contact Page (FIXED: Simplified Content)
const ContactPage = ({ setView }) => (
    <div className="placeholder-page" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4rem' }}>
        <div className="placeholder-card" style={{ maxWidth: '400px', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', backgroundColor: 'white', margin: '0 1.5rem' }}>
            <Mail style={{ width: '3rem', height: '3rem', color: '#6366f1', margin: '0 auto 1.5rem auto' }} />
            <h1 className="placeholder-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Us</h1>
            <p className="placeholder-text" style={{ marginBottom: '2rem', color: '#4b5563' }}>
                For technical support, partnership inquiries, or feedback on this travel project, please reach out.
            </p>
            <div style={{ marginTop: '1.5rem', textAlign: 'left', padding: '0 20px', color: '#1f2937' }}>
                <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> support@wanderlust.dev</p>
                <p style={{ marginBottom: '0.5rem' }}><strong>Phone:</strong> +1 (555) 555-WAND</p>
                <p><strong>Hours:</strong> Mon - Fri, 9am - 5pm EST</p>
            </div>
            <button
                onClick={() => setView(VIEWS.HOME)}
                className="placeholder-button"
                style={{ marginTop: '2rem', padding: '0.75rem 2rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
                Go to Home
            </button>
        </div>
    </div>
);


// 10. Generic Placeholder Page (for Itineraries List) (FIXED: Simplified Content)
const GenericPage = ({ title, setView, userId }) => (
    <div className="placeholder-page" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '4rem' }}>
        <div className="placeholder-card" style={{ maxWidth: '400px', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
            <Heart style={{ width: '3rem', height: '3rem', color: '#6366f1', margin: '0 auto 1rem auto' }} />
            <h1 className="placeholder-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h1>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Your User ID: {userId || 'Authenticating...'}
            </p>
            <p className="placeholder-text" style={{ color: '#4b5563', lineHeight: 1.6 }}>
                This is where you can view your saved itineraries.
                <br/> For now, let's head back to the main journey.
            </p>
            <button
                onClick={() => setView(VIEWS.HOME)}
                className="placeholder-button"
                style={{ marginTop: '2rem', padding: '0.75rem 2rem', backgroundColor: '#4f46e5', color: 'white', fontWeight: 600, borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
                Go to Home
            </button>
        </div>
    </div>
);


// 11. Main Application Component 
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentView, setCurrentView] = useState(VIEWS.LOGIN); 
  
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null); 
  const [selectedDestination, setSelectedDestination] = useState(null); 
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // --- MONGODB PERSISTENCE STATE (No more Firebase) ---
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null); // Keep userId for logging/display

  // --- SCROLL FIX: Scroll to top whenever the view changes ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // --- Consolidated Initialization and Data Fetch Effect ---
  useEffect(() => {
    
    // Simulate user authentication readiness after MERN token exists
    // This function will be called once on initial load.
    const initializeAndFetch = async () => {
        
        // 1. Check for token and set auth status
        const token = localStorage.getItem('authToken');
        
        if (token) {
            // NOTE: In a real app, you would validate this token against your server.
            // Here, we decode the JWT payload to get a fake ID for display/logging
            const parts = token.split('.');
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(atob(parts[1]));
                    setUserId(payload.id || 'N/A'); // Use the ID from the JWT payload
                } catch (e) {
                    setUserId('N/A');
                }
            } else {
                setUserId('Anonymous');
            }
        }
        
        setIsAuthReady(true); // Auth is ready as soon as token status is checked

        // 2. Fetch MERN Data
        try {
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await fetch('http://localhost:5000/api/destinations', {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("Token expired or unauthorized. Clearing token.");
                    localStorage.removeItem('authToken');
                    setIsLoggedIn(false); 
                    setCurrentView(VIEWS.LOGIN);
                }
                throw new Error('Failed to fetch destinations from server.');
            }
            const data = await response.json();
            setCountries(data);
            console.log("MERN data fetch complete.");
        } catch (error) {
            console.error("Error fetching MERN data:", error);
        } finally {
             // 3. Mark loading complete regardless of MERN fetch success/failure
            setIsLoading(false); 
        }
    };

    initializeAndFetch();

    const tokenOnLoad = localStorage.getItem('authToken');
    if (tokenOnLoad) {
        setIsLoggedIn(true);
        setCurrentView(VIEWS.HOME);
    }

    return () => {
        // No unsubscribe needed as Firebase is removed
    };

  }, []); 

  // --- HANDLERS ---

  const handleLoginSuccess = () => {
    // FIX: Force a reload to ensure initialization runs again and picks up the new token
    window.location.reload(); 
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country); 
    setSelectedDestination(null);
    setCurrentView(VIEWS.DETAIL);
  };

  const handleSelectDestination = (destination, country) => {
    setSelectedDestination(destination); 
    setSelectedCountry(country); 
    setCurrentView(VIEWS.ITINERARY_DETAIL);
  };

  // REWRITTEN SAVE FUNCTION FOR MONGODB PERSISTENCE
  const handleSaveItinerary = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
          setNotification({ type: 'error', message: 'You must be logged in to save itineraries.' });
          return;
      }
      
      setIsSaving(true);
      setNotification(null);
      
      const payload = {
          country: selectedCountry.country,
          destination: selectedDestination.name,
          detail: selectedDestination.detail,
          itinerary: selectedDestination.itinerary,
      };

      try {
          // Send request to the new Express route /api/itineraries
          const response = await fetch('http://localhost:5000/api/itineraries', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, // Send JWT for authentication
              },
              body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok && data.message) {
              setNotification({ type: 'success', message: data.message });
          } else if (data.message) {
              setNotification({ type: 'error', message: data.message });
          } else {
              setNotification({ type: 'error', message: 'Failed to save itinerary. Server error.' });
          }
      } catch (error) {
          console.error("Error saving itinerary:", error);
          setNotification({ type: 'error', message: `Network error: Cannot connect to server.` });
      } finally {
          setIsSaving(false);
          // Auto-hide notification
          setTimeout(() => setNotification(null), 3000);
      }
  };

  // --- VIEW RENDER LOGIC ---

  const renderView = useMemo(() => {
    // The view depends on MERN data (isLoading) and Auth readiness (isAuthReady) completing
    if (isLoading || !isAuthReady) {
        return <div className="page-container" style={{ padding: '8rem', textAlign: 'center', fontSize: '1.5rem' }}>Initializing application and connecting services...</div>;
    }
    
    // Auth Check: If not logged in, force Login/Register views
    if (!isLoggedIn) {
        switch (currentView) {
            case VIEWS.REGISTER:
                return <RegistrationScreen setView={setCurrentView} />;
            default:
                return <LoginScreen onLoginSuccess={handleLoginSuccess} setView={setCurrentView} />;
        }
    }

    // Main App Views (Requires login)
    switch (currentView) {
      case VIEWS.HOME:
        return <HomePage 
                setView={setCurrentView} 
                onSelectCountry={handleSelectCountry} 
                countries={countries} 
                isLoading={isLoading} 
               />;
      
      case VIEWS.DETAIL:
        return <DestinationDetail 
                  selectedCountry={selectedCountry} 
                  setView={setCurrentView}
                  onSelectDestination={handleSelectDestination}
               />;

      case VIEWS.ITINERARY_DETAIL:
        return <ItineraryDetailPage 
                  selectedDestination={selectedDestination} 
                  selectedCountry={selectedCountry}
                  setView={setCurrentView}
                  onSaveItinerary={handleSaveItinerary} // Pass Save handler
                  isSaving={isSaving}
               />;

      case VIEWS.ITINERARIES_LIST: 
        return <GenericPage title="Our Curated Itineraries" setView={setCurrentView} userId={userId} />;
      
      case VIEWS.ABOUT:
        return <AboutPage setView={setCurrentView} />;
        
      case VIEWS.CONTACT:
        return <ContactPage setView={setCurrentView} />;
        
      default:
        return <HomePage 
                setView={setCurrentView} 
                onSelectCountry={handleSelectCountry} 
                countries={countries} 
                isLoading={isLoading} 
               />;
    }
  }, [isLoggedIn, currentView, selectedCountry, selectedDestination, countries, isLoading, isAuthReady, userId, isSaving]);

  return (
    <div className="App">
      {/* Notification Toast */}
      {notification && (
        <div 
          className={`notification-toast ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              color: 'white',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
          }}
          onClick={() => setNotification(null)}
        >
          {notification.message}
          <X style={{ width: '1rem', height: '1rem', marginLeft: '0.75rem' }} />
        </div>
      )}

      {/* Only show Navbar if logged in and loaded */}
      {isLoggedIn && !isLoading && (
        <Navbar
          isLoggedIn={isLoggedIn}
          currentView={currentView}
          setView={setCurrentView}
          onLogout={() => {
            // FIX: Clear state and local token on logout
            setIsLoggedIn(false);
            setCurrentView(VIEWS.LOGIN);
            setSelectedCountry(null);
            setSelectedDestination(null);
            localStorage.removeItem('authToken'); 
            setUserId(null); // Clear user ID on logout
          }}
        />
      )}
      <main>
        {renderView}
      </main>
      
      {/* Placeholder CSS for a basic toast notification */}
      <style>
        {`
          .notification-toast.bg-green-500 { background-color: #10b981; }
          .notification-toast.bg-red-500 { background-color: #ef4444; }
        `}
      </style>
    </div>
  );
};

export default App;