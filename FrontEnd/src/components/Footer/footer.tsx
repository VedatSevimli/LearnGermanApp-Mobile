import React from 'react';
import { Link } from 'react-router-dom';
import './footer.scss';

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/home">Home</Link>
                <Link to="/reading">Reading</Link>
                <Link to="/listening">Listening</Link>
                <Link to="/words">Words</Link>
                <Link to="/quiz">Quiz</Link>
                <Link to="/">&#9400; Copyright Sevimli GmBh</Link>
            </div>
        </footer>
    );
};
