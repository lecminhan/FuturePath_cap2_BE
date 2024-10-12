import NotificationIcons from "../../components/Notifications";
import style from './style.css';
import React, { useEffect, useState } from 'react'
function User (){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3004/api/users') // URL tới API bạn vừa tạo
          .then(response => response.json())
          .then(data => {
            setUsers(data); // Lưu dữ liệu vào state
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      }, []);
    return(
        <div className='user'>
            <div className='header'>
            <div className='reload'> <NotificationIcons/></div>
            </div>
            
            <div className="user-table">
                 <div>
                <h1>Danh sách người dùng</h1>
                    <ul>
                        {users.map(user => (
                        <li key={user.user_id}>
                            {user.fullname} - {user.email} - {user.balance}
                        </li>
                    ))}
                    </ul>
                    </div>
            </div>
        </div>
    )
}
export default User;
