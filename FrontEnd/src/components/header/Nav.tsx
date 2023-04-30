import  React from 'react';
import './Nav.scss'
import{Link} from 'react-router-dom';


export const Nav:React.FC = ():JSX.Element => {

    return(
        <nav>
                <Link to='/home'>Home</Link>
                <Link to='/reading'>Reading</Link>
                <Link to='/listening'>Listening</Link>
                <Link to='/words'>Words</Link>
                <Link to='/quiz'>Quiz</Link>
                <Link to='/login'>Login</Link>
            </nav>
    )
}