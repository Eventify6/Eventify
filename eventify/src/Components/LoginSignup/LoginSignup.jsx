import { useState } from 'react';
import './LoginSignup.css';
import { setCookie } from '../../utils/cookieUtils';
import { IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const initialSignup = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'user',
};
const initialLogin = { email: '', password: '' };

export default function LoginSignup({ onAuth }) {
    const [mode, setMode] = useState('login');
    const [loginData, setLoginData] = useState(initialLogin);
    const [signupData, setSignupData] = useState(initialSignup);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirm, setShowSignupConfirm] = useState(false);
    const [error, setError] = useState('');
    // Track touched fields
    const [loginTouched, setLoginTouched] = useState({ email: false, password: false });
    const [signupTouched, setSignupTouched] = useState({ firstName: false, lastName: false, email: false, password: false, confirmPassword: false, phone: false });

    // Validation helpers
    const isEmailValid = email => /.+@.+\..+/.test(email);
    const isPasswordValid = password => password.length >= 6;
    const isLoginValid = loginData.email && loginData.password && isEmailValid(loginData.email);
    const isSignupValid = Object.values(signupData).every(Boolean) && isEmailValid(signupData.email) && isPasswordValid(signupData.password) && signupData.password === signupData.confirmPassword;

    // Field error states
    const loginFieldErrors = {
        email: loginData.email === '' ? 'Email is required.' : (!isEmailValid(loginData.email) ? 'Invalid email.' : ''),
        password: loginData.password === '' ? 'Password is required.' : (!isPasswordValid(loginData.password) ? 'Password must be at least 6 characters.' : ''),
    };
    const signupFieldErrors = {
        firstName: signupData.firstName === '' ? 'First name is required.' : '',
        lastName: signupData.lastName === '' ? 'Last name is required.' : '',
        email: signupData.email === '' ? 'Email is required.' : (!isEmailValid(signupData.email) ? 'Invalid email.' : ''),
        password: signupData.password === '' ? 'Password is required.' : (!isPasswordValid(signupData.password) ? 'Password must be at least 6 characters.' : ''),
        confirmPassword: signupData.confirmPassword === '' ? 'Confirm password is required.' : (signupData.password !== signupData.confirmPassword ? 'Passwords do not match.' : ''),
        phone: signupData.phone === '' ? 'Phone number is required.' : '',
    };

    // Handlers
    const handleLoginChange = e => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setLoginTouched({ ...loginTouched, [e.target.name]: true });
    };
    const handleSignupChange = e => {
        setSignupData({ ...signupData, [e.target.name]: e.target.value });
        setSignupTouched({ ...signupTouched, [e.target.name]: true });
    };
    const handleBlurLogin = e => {
        setLoginTouched({ ...loginTouched, [e.target.name]: true });
    };
    const handleBlurSignup = e => {
        setSignupTouched({ ...signupTouched, [e.target.name]: true });
    };

    const handleLogin = e => {
        e.preventDefault();
        if (!loginData.email || !loginData.password) return setError('All fields are required.');
        if (!isEmailValid(loginData.email)) return setError('Please enter a valid email address.');
        // Mock login: just check if userData cookie matches
        const userData = JSON.parse(localStorage.getItem('mockUserData') || '{}');
        if (userData.email === loginData.email && userData.password === loginData.password) {
            setCookie('isLoggedIN', 'true', 7);
            setCookie('userData', JSON.stringify(userData), 7);
            onAuth();
        } else {
            setError('Invalid email or password.');
        }
    };

    const handleSignup = e => {
        e.preventDefault();
        if (!Object.values(signupData).every(Boolean)) return setError('All fields are required.');
        if (!isEmailValid(signupData.email)) return setError('Please enter a valid email address.');
        if (signupData.password !== signupData.confirmPassword) return setError('Passwords do not match.');
        // Mock signup: save to localStorage and cookie
        const user = { ...signupData };
        localStorage.setItem('mockUserData', JSON.stringify(user));
        setCookie('isLoggedIN', 'true', 7);
        setCookie('userData', JSON.stringify(user), 7);
        onAuth();
    };

    return (
        <div className="login-signup-container">
            {mode === 'login' ? (
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        onBlur={handleBlurLogin}
                        required
                        className={loginFieldErrors.email && loginTouched.email ? 'input-error' : ''}
                    />
                    {loginFieldErrors.email && loginTouched.email && <div className="form-error">{loginFieldErrors.email}</div>}
                    <div className="password-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            onBlur={handleBlurLogin}
                            required
                            className={loginFieldErrors.password && loginTouched.password ? 'input-error' : ''}
                        />
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(v => !v)}
                                edge="end"
                                size="small"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    </div>
                    {loginFieldErrors.password && loginTouched.password && <div className="form-error">{loginFieldErrors.password}</div>}
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="main-btn" disabled={!isLoginValid}>Login</button>
                    <div className="switch-link">
                        Don&apos;t have an account?{' '}
                        <span onClick={() => { setMode('signup'); setError(''); }}>Sign up</span>
                    </div>
                </form>
            ) : (
                <form className="signup-form" onSubmit={handleSignup}>
                    <h2>Sign Up</h2>
                    <div className="signup-row">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={signupData.firstName}
                            onChange={handleSignupChange}
                            onBlur={handleBlurSignup}
                            required
                            className={signupFieldErrors.firstName && signupTouched.firstName ? 'input-error' : ''}
                        />
                        {signupFieldErrors.firstName && signupTouched.firstName && <div className="form-error">{signupFieldErrors.firstName}</div>}
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={signupData.lastName}
                            onChange={handleSignupChange}
                            onBlur={handleBlurSignup}
                            required
                            className={signupFieldErrors.lastName && signupTouched.lastName ? 'input-error' : ''}
                        />
                        {signupFieldErrors.lastName && signupTouched.lastName && <div className="form-error">{signupFieldErrors.lastName}</div>}
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        onBlur={handleBlurSignup}
                        required
                        className={signupFieldErrors.email && signupTouched.email ? 'input-error' : ''}
                    />
                    {signupFieldErrors.email && signupTouched.email && <div className="form-error">{signupFieldErrors.email}</div>}
                    <div className="password-field">
                        <input
                            type={showSignupPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            onBlur={handleBlurSignup}
                            required
                            className={signupFieldErrors.password && signupTouched.password ? 'input-error' : ''}
                        />
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowSignupPassword(v => !v)}
                                edge="end"
                                size="small"
                            >
                                {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    </div>
                    {signupFieldErrors.password && signupTouched.password && <div className="form-error">{signupFieldErrors.password}</div>}
                    <div className="password-field">
                        <input
                            type={showSignupConfirm ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={signupData.confirmPassword}
                            onChange={handleSignupChange}
                            onBlur={handleBlurSignup}
                            required
                            className={signupFieldErrors.confirmPassword && signupTouched.confirmPassword ? 'input-error' : ''}
                        />
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowSignupConfirm(v => !v)}
                                edge="end"
                                size="small"
                            >
                                {showSignupConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    </div>
                    {signupFieldErrors.confirmPassword && signupTouched.confirmPassword && <div className="form-error">{signupFieldErrors.confirmPassword}</div>}
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        onBlur={handleBlurSignup}
                        required
                        className={signupFieldErrors.phone && signupTouched.phone ? 'input-error' : ''}
                    />
                    {signupFieldErrors.phone && signupTouched.phone && <div className="form-error">{signupFieldErrors.phone}</div>}
                    <div className="select-group">
                        <label htmlFor="userType">User Type</label>
                        <select
                            id="userType"
                            name="userType"
                            value={signupData.userType}
                            onChange={handleSignupChange}
                            required
                        >
                            <option value="user">Attendee</option>
                            <option value="admin">Host</option>
                        </select>
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <button type="submit" className="main-btn" disabled={!isSignupValid}>Sign Up</button>
                    <div className="switch-link">
                        Already have an account?{' '}
                        <span onClick={() => { setMode('login'); setError(''); }}>Login</span>
                    </div>
                </form>
            )}
        </div>
    );
} 