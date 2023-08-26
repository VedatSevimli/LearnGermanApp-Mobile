import './App.scss';
import { useEffect, useRef, useState } from 'react';
import { Header } from '../src/components/header/Header';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Reading } from './components/pages/Reading/Reading';
import { Listening } from './components/pages/Listening/Listening';
import { Quiz } from './components/pages/Quiz/Quiz';
import { NoMatch } from './components/pages/NoMatch';
import { Words } from './components/pages/Words/Words';
import { Home } from './components/pages/Home/Home';
import { Login } from './components/pages/login/Login';
import { Footer } from './components/Footer/footer';

import { loginWithToken } from './components/API/VerbList/login';
import {
    getVerbList,
    verbLevelE
} from './components/API/Login/getVerbListWithLevel';
import { Verb } from './components/modules/verbs/verbs.type';
import { VerbDetails } from './components/pages/Worddetails/Worddetails';

export type UserInfo = {
    name: string;
    lasName: string;
    token: string;
};
function App(): JSX.Element {
    const isMounted = useRef(false);
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [user, Setuser] = useState<{
        _id: string;
        name: string;
        lastName: string;
        email: string;
    }>();
    const [verbList, setVerbList] = useState<Verb[]>([]);

    useEffect(() => {
        const doLoginWithToken = async () => {
            const user = localStorage.getItem('userInfo');
            const userInfo: UserInfo = user ? JSON.parse(user) : null;
            const res = userInfo
                ? await loginWithToken({ token: userInfo?.token })
                : null;

            if (res?.success) {
                setAuthenticated(true);
                navigate('/home');
                Setuser(res.data);
            } else {
                localStorage.removeItem('userInfo');
                Setuser(res?.data);
            }
        };
        try {
            void doLoginWithToken();
        } catch (error) {
            console.log(error);
        }

        return () => {
            isMounted.current = false;
        };
    }, [authenticated]);

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            const verbs = await getVerbList({ level: verbLevelE.A1 });
            setVerbList(verbs);
        };
        try {
            void getVerbListA();
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <div className="App">
            <Header userInfo={user} setAuthenticated={setAuthenticated} />
            <main className="main">
                <Routes>
                    <Route index path="/" element={<Home />} />
                    <Route index path="/home" element={<Home />} />
                    <Route path="/reading" element={<Reading />} />
                    <Route path="/listening" element={<Listening />} />
                    <Route path="/words" element={<Words words={verbList} />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route
                        path="/wordDetails/:word"
                        element={<VerbDetails />}
                    />

                    <Route
                        path="/login"
                        element={<Login setAuthenticated={setAuthenticated} />}
                    >
                        <Route path="*" element={<NoMatch />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
