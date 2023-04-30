import  React from 'react';
import { Nav } from './Nav';
import  logo from "../../images/language-svgrepo-com.svg";
import './Header.scss';




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
