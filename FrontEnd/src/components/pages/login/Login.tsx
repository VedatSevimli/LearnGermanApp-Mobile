import React, { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import Button from '../../Button/buttons';

export const Login = (): JSX.Element => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [responseMssg, setResponseMssg] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLogin = async (
        email: string,
        password: string
    ): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000'
                },
                body: JSON.stringify({ email, password })
            });
            const res = await response.json();

            if (res.success) {
                // handle successful login
                const userInfo = JSON.stringify({
                    name: res.userName,
                    lastName: res.userlastName,
                    token: res.token
                });
                localStorage.setItem('userInfo', userInfo);
                setIsLoading(false);
                navigate('/home');
            } else {
                // handle failed login
                setResponseMssg(res.message);
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="login-header">
                <h2>Login</h2>
            </div>
            <div className="login-content">
                <label>
                    Eamil:
                    <input
                        type="text"
                        name="email"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        autoComplete="on"
                        placeholder="E-Mail.."
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password.."
                    />
                </label>
                <br />
            </div>

            <div className="footer">
                <span className="res-mssg">{responseMssg}</span>

                <Button
                    type="primary"
                    style={{ borderRadius: '4px' }}
                    onClick={() => void handleLogin(username, password)}
                >
                    <span>Login</span>
                    <LoadingSpinner isLoading={isLoading} small />
                </Button>
            </div>
        </div>
    );
};
