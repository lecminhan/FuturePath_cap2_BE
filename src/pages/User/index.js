import NotificationIcons from "../../components/Notifications";
import Userpaginations from "../../components/Paginations/userPaginations";
import style from './style.css';
import React, { useEffect, useState } from 'react'
function User (){

    return(
        <div className='user'>
            <div className='header'>
            <div className='reload'> <NotificationIcons/></div>
            </div>    
            <div className="user-table">
                    <Userpaginations/>
            </div>
        </div>
    )
}
export default User;
