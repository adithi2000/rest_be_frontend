import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import the custom hook

/*
Since you need to complete the login flow and then securely fetch data, we will create the files in this order:

The Redirect Handler (Oauth2RedirectHandler.tsx): Captures the JWT and calls the global login function.

The Container (SalaryHistoryContainer.tsx): Fetches the protected salary data using your utility.

The Presentation (SalaryHistoryPresentation.tsx): Renders the final UI. */

const OauthRedirectHandler: React.FC = () => {
  const navigate = useNavigate(); // 1. useNavigate to redirect after login
  const location = useLocation(); // 2. useLocation to access query params
  const { login } = useAuth(); // 2. Use the custom hook to get the login function

  // useEffect runs the logic once when the component is loaded
  useEffect(() => {
    // Get the URL parameters (query string)
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); // Look for the JWT string

    if (token) {
      //  Success: Call the global login function
      login(token); 
      
      //  Navigate to the history page (App will be running, but this starts data load)
      // The fetchProfile inside login() will update the global state.
      navigate('/salary-history', { replace: true });
      
    } else {
      // 6. Failure: Handle error if token is missing
      console.error('Authentication Error: No token received.');
      navigate('/', { replace: true }); 
    }
  }, [location.search, navigate, login]);
return (
    <div className="text-center my-5">
      {/* Bootstrap Spinner */}
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Completing Secure Login...</p>
    </div>
  );
};

export default OauthRedirectHandler;