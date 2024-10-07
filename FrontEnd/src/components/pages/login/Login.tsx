import { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { Button } from '../../Button/button';
import { useUser } from '../../../context/userContext/userContext';
import { doLogin, register } from '../../../API/Login/login';
import { setSeo } from '../../../utils/seo';

type LoginPorps = {
    //
};
export const Login = (props: LoginPorps): JSX.Element => {
    const navigate = useNavigate();
    const { loginUser, error, loading } = useUser();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>(''); // State for error message
    setSeo(
        `Deutsch-Turkish App -${isLogin ? 'Anmelden' : 'Registrieren'}`,
        `${isLogin ? 'Anmelden' : 'Kostenlos registrieren'}`
    );
    const handleLogin = async (
        e?: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e?.preventDefault();
        try {
            if (isLogin) {
                const res = await loginUser(email, password);
                if (res?.success) {
                    navigate('/home');
                } else {
                    setErrorMessage(res?.message ?? '');
                }
            } else {
                const res = await register({
                    email,
                    lastName,
                    name: username,
                    password
                });
                if (!res.success) {
                    setErrorMessage(res.message);
                } else {
                    // Auto-login after registration
                    const loginRes = await loginUser(email, password);
                    if (loginRes?.success) {
                        sessionStorage.setItem(
                            'authToken',
                            loginRes.data?.token ?? ''
                        );
                        navigate('/'); // Redirect to home page
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            void handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {errorMessage && (
                    <div className="error-message">{errorMessage}</div>
                )}
                <form onSubmit={handleLogin} className="login-form">
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    onKeyUp={handleKeyUp}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p className="switch-mode-text">
                    {isLogin ? 'Need an account?' : 'Already have an account?'}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? ' Register here' : ' Login here'}
                    </span>
                </p>
            </div>
        </div>
    );
};
