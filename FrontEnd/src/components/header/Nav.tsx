import React from 'react';
import './Nav.scss';
import { Link } from 'react-router-dom';
import { UserData } from '../../modules/login/login.type';

type NavProps = {
    userInfo: UserData | null;
    logout: () => void;
};
export const Nav: React.FC<NavProps> = ({ userInfo, logout }): JSX.Element => {
    return (
        <nav>
            <Link to="/home">Home</Link>
            <Link to="/reading">Reading</Link>
            <Link to="/listening">Listening</Link>
            <Link to="/words">Words</Link>
            <Link to="/quiz">Quiz</Link>
            {userInfo ? (
                <div className="user-info">
                    <div className="user-icon">
                        {userInfo?.name[0]?.toUpperCase()}
                    </div>
                    <div className="user-dropdown">
                        <span onClick={logout}>Logout</span>
                        <Link to="/languages">Languages</Link>
                        <Link to="/news">News</Link>
                    </div>
                </div>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};
