import { useNavigate } from 'react-router-dom';
import './NoMatch.scss'; // Import your CSS for styling
import { noMatch } from '../../images/image';

export const NoMatch: React.FC = (): JSX.Element => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
                <p className="not-found-description">
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </p>
                <button className="not-found-button" onClick={handleGoHome}>
                    Go to Homepage
                </button>
                <div className="not-found-image">
                    {/* You can use an illustration or SVG here */}
                    <img src={noMatch} alt="404 illustration" />
                </div>
            </div>
        </div>
    );
};
