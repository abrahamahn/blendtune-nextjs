// main/apps/web/src/pages/static.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@router/index';

import { Button, Checkbox, Heading, Skeleton, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import Header from '@client/features/layout/header';
import LeftBar from '@features/layout/leftbar';
import StoreProvider from '@core/providers/StoreProvider';
import {
  setArtistCreatorName,
  setGender,
  setUserType,
  setOccupation,
  setDateOfBirth,
  setMarketingConsent,
} from '@core/store/slices';
import { useSession } from '@features/auth/services';

import './static.css';

/** Shared static-page layout: header, left sidebar, content area. */
const StaticLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreProvider>
    <div className="static-layout">
      <div className="static-header">
        <Header />
      </div>
      <div className="static-main">
        <div className="static-rail">
          <LeftBar />
        </div>
        <div className="static-content">{children}</div>
      </div>
    </div>
  </StoreProvider>
);

/** Skeleton shown while the welcome page's session data is loading. */
const WelcomeSkeleton: React.FC = () => (
  <div className="welcome-screen">
    <div className="welcome-card">
      <div className="welcome-head">
        <Skeleton width="12rem" height="1.5rem" />
        <Skeleton width="16rem" height="0.75rem" />
      </div>
      <div className="welcome-form">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} height="3rem" />
        ))}
        <div className="welcome-dob">
          <Skeleton height="3rem" />
          <Skeleton height="3rem" />
          <Skeleton height="3rem" />
        </div>
        <Skeleton height="2.5rem" />
      </div>
    </div>
  </div>
);

/**
 * Welcome onboarding form:
 * - Gathers user information during onboarding.
 * - Dispatches user data to Redux for global state management.
 * - Sends profile data to the backend for account setup.
 */
const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve user session data
  const {
    userArtistCreatorName,
    userGender,
    userDateOfBirth,
    userType,
    userOccupation,
    userMarketingConsent,
    sessionLoading,
  } = useSession();

  // Local states for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Parses a date string (YYYY-MM-DD) into an object with separate year, month, and day fields.
   */
  const parseDateOfBirth = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
    };
  };

  // Initialize date of birth state based on session data or default to the current year
  const initialDobState = userDateOfBirth
    ? parseDateOfBirth(userDateOfBirth)
    : { year: new Date().getFullYear(), month: 1, day: 1 };

  const [dobState, setDobState] = useState(initialDobState);

  // If session is still loading, show skeleton
  if (sessionLoading) {
    return <WelcomeSkeleton />;
  }

  /**
   * Updates the date of birth state when a user selects a new value.
   */
  const handleDobChange = (part: string, value: string) => {
    setDobState((prevState) => ({
      ...prevState,
      [part]: parseInt(value, 10),
    }));
  };

  /**
   * Handles user profile submission.
   * - Validates user input and sends the profile data to the backend.
   * - Navigates the user to the `/sounds` page upon success.
   */
  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Format the date of birth as a string
    const dobString = `${dobState.year}-${String(dobState.month).padStart(2, '0')}-${String(dobState.day).padStart(2, '0')}`;

    try {
      // Dispatch the updated date of birth to Redux
      dispatch(setDateOfBirth(dobString));

      // Send profile update request to the backend
      const response = await fetch('/api/account/basic-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userArtistCreatorName,
          userType,
          userOccupation,
          userGender,
          userDateOfBirth: dobString,
          userMarketingConsent,
        }),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
        navigate('/sounds');
      } else {
        setErrorMessage('An error occurred during profile update.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during profile update.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Defines occupation types based on user type.
   */
  const occupationTypes =
    userType === 'musician'
      ? [
          'Rapper',
          'Singer',
          'Songwriter',
          'Music Producer',
          'Audio Engineer',
          'DJ',
          'Artist Manager',
          'Record Label',
          'Other',
        ]
      : [
          'Film/TV Producer',
          'Game Developer',
          'YouTuber',
          'Podcaster',
          'Corporate',
          'Event Planner',
          'Influencer',
          'Other',
        ];

  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <div className="welcome-head">
          <Heading as="h1" size="lg">
            Welcome to Blendtune
          </Heading>
          <Text as="p" size="sm" tone="muted">
            Tell us a little about yourself to get started.
          </Text>
        </div>

        <form className="welcome-form" onSubmit={handleProfileUpdate}>
          <FormField
            label="Artist, creator, or organization name"
            type="text"
            value={userArtistCreatorName || ''}
            onChange={(e) => dispatch(setArtistCreatorName(e.target.value))}
            placeholder="Your name"
            required
          />

          <label className="welcome-field">
            <span className="welcome-label">Using it for…</span>
            <select
              value={userType || ''}
              onChange={(e) => dispatch(setUserType(e.target.value))}
              className="welcome-select"
              required
            >
              <option value="">Select</option>
              <option value="musician">Music Release</option>
              <option value="video creator">Content</option>
            </select>
          </label>

          <label className="welcome-field">
            <span className="welcome-label">I am a…</span>
            <select
              value={userOccupation || ''}
              onChange={(e) => dispatch(setOccupation(e.target.value))}
              className="welcome-select"
              required
            >
              <option value="">Select</option>
              {occupationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="welcome-field">
            <span className="welcome-label">Gender</span>
            <select
              onChange={(e) => dispatch(setGender(e.target.value))}
              value={userGender || ''}
              className="welcome-select"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <div className="welcome-field">
            <span className="welcome-label">Date of birth</span>
            <div className="welcome-dob">
              <select
                value={dobState.month}
                onChange={(e) => handleDobChange('month', e.target.value)}
                className="welcome-select welcome-dob-month"
                aria-label="Month"
                required
              >
                <option value="">MM</option>
                {[...Array(12).keys()].map((month) => (
                  <option key={month} value={month + 1}>
                    {month + 1}
                  </option>
                ))}
              </select>
              <select
                value={dobState.day}
                onChange={(e) => handleDobChange('day', e.target.value)}
                className="welcome-select welcome-dob-day"
                aria-label="Day"
                required
              >
                <option value="">DD</option>
                {[...Array(31).keys()].map((day) => (
                  <option key={day} value={day + 1}>
                    {day + 1}
                  </option>
                ))}
              </select>
              <select
                value={dobState.year}
                onChange={(e) => handleDobChange('year', e.target.value)}
                className="welcome-select welcome-dob-year"
                aria-label="Year"
                required
              >
                <option value="">YYYY</option>
                {[...Array(2024 - 1960 + 1).keys()].map((year) => (
                  <option key={year} value={year + 1960}>
                    {year + 1960}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Checkbox
            checked={userMarketingConsent ?? false}
            onChange={(checked) => dispatch(setMarketingConsent(checked))}
            className="welcome-consent"
            label="I agree to receive new music or promos via email."
          />

          {errorMessage ? (
            <Text as="span" size="sm" tone="danger">
              {errorMessage}
            </Text>
          ) : (
            <Text as="span" size="sm" tone="muted">
              This helps generate your profile page and improve recommendations.
            </Text>
          )}

          <Button variant="primary" type="submit" className="welcome-submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Complete signup'}
          </Button>
        </form>
      </div>
    </div>
  );
};

/** /welcome — post-signup onboarding form, wrapped in the app's header/sidebar layout. */
export const WelcomePage: React.FC = () => (
  <StaticLayout>
    <Welcome />
  </StaticLayout>
);

/** Terms page content: fetches and renders the static terms HTML. */
const Terms: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    fetch('/html/terms.html')
      .then((response) => response.text())
      .then((data) => {
        setHtmlContent(data);
      });
  }, []);

  return (
    <div className="static-prose">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </div>
  );
};

/** /terms — the terms of service page, wrapped in the app's header/sidebar layout. */
export const TermsPage: React.FC = () => (
  <StaticLayout>
    <Terms />
  </StaticLayout>
);

/**
 * PrivacyPolicy page content:
 * - Fetches and displays the privacy policy from a static HTML file.
 * - Uses `dangerouslySetInnerHTML` to render raw HTML content.
 */
const PrivacyPolicy: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    fetch('/html/privacy-policy.html')
      .then((response) => response.text())
      .then((data) => setHtmlContent(data));
  }, []);

  return (
    <div className="static-prose">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </div>
  );
};

/** /privacy-policy — the privacy policy page, wrapped in the app's header/sidebar layout. */
export const PrivacyPolicyPage: React.FC = () => (
  <StaticLayout>
    <PrivacyPolicy />
  </StaticLayout>
);
