import './App.scss';
import { Header } from '../src/components/header/Header';
import { Main } from './components/Main';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Reading } from './components/pages/Reading/Reading';
import { Listening } from './components/pages/Listening/Listening';
import { Quiz } from './components/pages/Quiz/Quiz';
import { NoMatch } from './components/pages/NoMatch';
import { Words } from './components/pages/Words/Words';
import { Home } from './components/pages/Home/Home';
import { Login } from './components/pages/login/Login';
import { useEffect, useRef, useState } from 'react';
export type UserInfo = {
    name: string;
    lasName: string;
    token: string;
};
function App(): JSX.Element {
    const isMounted = useRef(false);
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [user, Setuser] = useState();
    useEffect(() => {
        const user = localStorage.getItem('userInfo');
        const userInfo: UserInfo = user ? JSON.parse(user) : null;

        const loginWithToken = async () => {
            const response = await fetch('http://localhost:5000/api/me', {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    authorization: `Bearer ${userInfo.token}`
                })
            });
            const res = await response.json();
            if (res.success) {
                setAuthenticated(true);
                navigate('/home');
                Setuser(res.data);
            } else {
                localStorage.removeItem('userInfo');
            }
        };
        void loginWithToken();
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <div className="App">
            <Header />
            <Routes>
                {authenticated ? (
                    <>
                        <Route index path="/home" element={<Home />} />
                        <Route path="/reading" element={<Reading />} />
                        <Route path="/listening" element={<Listening />} />
                        <Route path="/words" element={<Words />} />
                        <Route path="/quiz" element={<Quiz />} />
                    </>
                ) : null}
                <Route
                    path="/"
                    element={
                        <Login
                            userInfo={user}
                            setAuthenticated={setAuthenticated}
                        />
                    }
                >
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
