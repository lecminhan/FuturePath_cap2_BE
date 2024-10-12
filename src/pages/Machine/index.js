
import DatePicker from '../../components/DatePicker';
import NotificationIcons from '../../components/Notifications';
import machine from './machine.css';
import { RefreshCcw,  BellRing, Sun,  Search} from 'lucide-react';
import React, { useEffect, useState } from 'react';
function Machine(){
  const [machines, setMachines] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3004/api/machines') // URL tới API bạn vừa tạo
          .then(response => response.json())
          .then(data => {
            setMachines(data); // Lưu dữ liệu vào state
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      }, []);

    return(
      <div className='machine-status'>
        <div className='header'>
        <div className='reload'> <NotificationIcons/></div>
        </div>
        <div className='machine-active'>
        <h1>Danh sách máy</h1>
            <ul>
                {machines.map((machine) => (
                    <li key={machine.id}>
                        {machine.machine_name} - {machine.model}
                    </li>
                ))}
            </ul>
        </div>
        <div className='usage-chart'></div>
      </div>
    )
}
export default Machine;