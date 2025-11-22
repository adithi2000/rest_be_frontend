// src/utils/http.ts

import axios, { type AxiosInstance, type AxiosError } from 'axios'; // 1
import { type SalaryHistoryDto,type  FacultyProfileDto } from '../model/model';
// 2. Define the base URL for your Spring Boot backend
const BASE_URL = 'http://localhost:8080';

// 3. Create an instance of Axios
const http: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json', // We send JSON data
    },
});

// 4. Request Interceptor: Attach the JWT to every request before it is sent
//Checks if there is no oauth api request done to prevet sending token to oauth url
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // 5
        
        // If a token exists, add the Authorization header
        if (token && config.url && !config.url.includes('/oauth2')) { // 6
            config.headers.Authorization = `Bearer ${token}`; // 7
        }
        return config; // 8
    },
    (error) => {
        return Promise.reject(error); // Handle request setup errors
    }
);

// 9. Response Interceptor: Global error handling
http.interceptors.response.use(
    (response) => response, // 10. Success: Just return the response data
    (error: AxiosError) => {
        // 11. Check for Unauthorized status (Token expired/invalid)
        if (error.response && error.response.status === 401) {
            
            // 12. Token is invalid or expired! Clear storage and force redirect.
            localStorage.removeItem('jwtToken');
            
            // Note: We cannot use React's useNavigate() here, so we force a page reload.
            window.location.href = BASE_URL + '/login'; 
            
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export const getSalaryHistory = async (): Promise<SalaryHistoryDto[]> => {
    // We use the SECURED 'http' instance here.
    const response = await http.get<SalaryHistoryDto[]>('/api/faculty/salary/history');
    
    // The JWT was automatically added to the request headers by the interceptor.
    // The 401 check is waiting on the response side via the interceptor.
    
    return response.data; 
};

export const getFacultyProfile = async (): Promise<FacultyProfileDto> => {
    // We use the SECURED 'http' instance again.
    const response = await http.get<FacultyProfileDto>('/api/faculty/details');
    return response.data;
};

// Inside src/utils/http.ts (Review)

export const downloadPayslip = (payslipId: number): void => {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
        // Handle missing token, though interceptors should catch this
        return; 
    }
    
    // 1. Construct the secure URL with the JWT attached
    const downloadUrl = `http://localhost:8080/api/faculty/salary/download/${payslipId}?token=${token}`;
    
    // 2. Trigger the download using the browser's native window function
    window.open(downloadUrl, '_blank');
};

export default http; // 13. Export the custom Axios instance