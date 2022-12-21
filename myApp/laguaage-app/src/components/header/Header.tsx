import  React from 'react';
import { Nav } from './Nav';
import  logo from "../../images/language-svgrepo-com.svg";
import './Header.scss';
import { Main } from '../Main';
import { Route, Routes } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { Reading } from '../pages/Reading/Reading';
import { Listening } from '../pages/Listening/Listening';
import { Words } from '../pages/Words/Words';
import { Quiz } from '../pages/Quiz/Quiz';
import { NoMatch } from '../../NoMatch';



export const Header:React.FC= ():JSX.Element =>{
    return(
        <div className='header-wrapper'>
            <div className='company'>
                <img className='logo' src={logo} alt="" />
            </div>

            <Nav/>
        </div>
    )
}
