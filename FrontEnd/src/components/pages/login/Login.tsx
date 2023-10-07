import { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import Button from '../../Button/buttons';
import { doLogin } from '../../../API/Login/login';

type LoginPorps = {
    setAuthenticated: (isloggin: boolean) => void;
};
export const Login = ({ setAuthenticated }: LoginPorps): JSX.Element => {
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
            const res = await doLogin({ email, password });

            if (res.success) {
                // handle successful login
                const userInfo = JSON.stringify({
                    name: res.userName,
                    lastName: res.userlastName,
                    token: res.token
                });

                localStorage.setItem('userInfo', userInfo);
                setIsLoading(false);
                setAuthenticated(true);
                setResponseMssg('');
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

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            void handleLogin(username, password);
        }
    };

    return (
        <div className="login">
            <div className="login-header">
                <h2>Login</h2>
            </div>

            <div className="login-content">
                <label>
                    Email:
                    <input
                        type="text"
                        id="email44"
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
                        onKeyPress={handleKeyPress}
                    />
                </label>
                <br />
            </div>

            <div className="login-footer">
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
