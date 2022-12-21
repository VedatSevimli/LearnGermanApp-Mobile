import React from 'react';
import {
    Outlet
  } from "react-router-dom";
  import {defaultConfig} from '../config/defaultConfig';





export const Main:React.FC = ():JSX.Element => {
    return(
        <div className='main' style={{background: defaultConfig().siteBackground}}>

            <Outlet />
        </div>
    )
}