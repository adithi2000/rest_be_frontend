import React, { useEffect} from 'react';
import { Container, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading} = useAuth(); // Use the custom hook to get auth state

    useEffect(() => {
        // If already authenticated, redirect to the main page immediately
        if (isAuthenticated) {
            navigate('/salary-history', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const startOAuth = () => {
        // In a real application, replace this with your actual OAuth URL and parameters
        // This is the CRITICAL step that redirects the browser away from your app
        const OAUTH_URL = 'http://localhost:8080/oauth2/authorization/google';
        window.location.href = OAUTH_URL;
    };
       
    return (
        // Centers the login card both horizontally and vertically (vh-100)
        <Container className="d-flex justify-content-center align-items-center vh-100 bg-light ">
          <Card className="p-5 shadow-lg text-center" style={{ maxWidth: '450px', width: '90%' }}>
            <Card.Title as="h2" className="mb-4 text-primary fw-bold">
              🎓 Faculty Portal Access
            </Card.Title>
            <Card.Text className="text-muted mb-4">
                Welcome to IIIT Bangalore Faculty Salary Portal.
                Please Proceed to login with Google.
            </Card.Text>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={startOAuth} // Triggers the browser redirect
              disabled={loading || isAuthenticated} // Disable while checking session or if already logged in
            >
              {loading ? (
                <><Spinner animation="border" size="sm" className="me-2" /> Checking Status...</>
              ) : (
                'Proceed to Institutional Login'
              )}
            </Button>
            {isAuthenticated && (
              <Alert variant="success" className="mt-4">
                You are already logged in! Redirecting...
              </Alert>
            )}
          </Card>
        </Container>
    );
};

export default Login;


