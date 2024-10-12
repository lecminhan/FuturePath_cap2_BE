import { RefreshCcw,  BellRing, Sun,  Search} from 'lucide-react';
import dashboard from './dashboard.css';
import axios from 'axios'
import SearchBar from '../../components/Search';
import NotificationIcons from '../../components/Notifications';
import React, { useEffect, useState } from 'react';
import DatePicker from '../../components/DatePicker';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale,    PointElement, LineElement, Title, Tooltip, Legend);
function Dashboard(){
    const [revenues, setRevenues] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [usertransactions, setUsertransactions] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [], // Chứa ngày hoặc thời gian
        datasets: [
            {
                label: 'transactions',
                data: [], // Chứa doanh thu tương ứng với labels
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }
        ]
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API để lấy tổng doanh thu
                const revenuesResponse = await fetch('http://localhost:3004/api/dashboard/revenues'); 
                const revenuesData = await revenuesResponse.json(); 
                if (revenuesData.length > 0) {
                    setRevenues(revenuesData[0].sum); // Truy cập vào phần tử đầu tiên của mảng và lấy giá trị sum
                }

                // Gọi API để lấy dữ liệu giao dịch
                const transactionsResponse = await fetch('http://localhost:3004/api/dashboard/trans');
                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData); // Lưu dữ liệu giao dịch vào state

                // API biểu đồ
                const response = await fetch('http://localhost:3004/api/dashboard/trans');
                const data = await response.json();
                const labels = data.map(transaction => new Date(transaction.timestamp).toLocaleDateString());
                const revenues = data.map(transaction => parseFloat(transaction.amount));

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Transactions',
                            data: revenues,
                            fill: false,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                        }
                    ]
                });


                //API user-transactions
                 // Gọi API để lấy dữ liệu giao dịch
                 const usertransactionsResponse = await fetch('http://localhost:3004/api/dashboard/user-transactions'); // Thay đổi URL nếu cần
                 const usertransactionsData = await usertransactionsResponse.json();
                 setUsertransactions(usertransactionsData); // Lưu dữ liệu vào state
                
        // Lưu dữ liệu vào usertransactions
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData(); // Gọi hàm fetchData khi component được mount
    }, []); // Chỉ chạy 1 lần khi component mount
    return(
        <>
            <div className='dashboard'>
                <div className='top-header'>
                    <div> <SearchBar/></div>
                    <div ><NotificationIcons/></div>
                </div>
                <div className='section1'>
                    <div className='today-revenue box-color'>
                        <h3>Total Revenue</h3>
                        <p>${revenues}</p>
                    </div>
                    <div className='available box-color'>
                        <h3>Available</h3>
                        <p>0</p>
                    </div>
                    <div className='active box-color' >
                        <h3>Active Machines</h3>
                        <p>0</p>
                    </div>
                    <div className='maintenance box-color'>
                        <h3>Maintenance</h3>
                        <p>0</p>
                    </div>
                </div>
                <div className='section2 '>
                        <div className='chart box-color'>
                            <div className='datePicker'>
                                <DatePicker/>
                            </div>
                            <div className='chart-line'>
                                <Line data={chartData} options={{ responsive: true }} />
                            </div>
                        </div>
                        <div className='r-transactions box-color'>
                        <div className='title-recentrans'> Recent Transactions</div>
                        <ul className='content-recentrans'>
                            {usertransactions.map((transaction) => (
                                <li style={{marginLeft:'20px', color:'#5B6C8F'}} key={transaction.transaction_time + transaction.user_name}>
                                    <strong>User Name:</strong> {transaction.user_name}, 
                                    <br></br>
                                    {new Date(transaction.transaction_time).toLocaleString()}, 
                                    <br></br>
                                    <strong> <div style={{textAlign:'right', marginRight:'20px',color:'#2FE5B6'}}>${transaction.transaction_amount}</div></strong> 
                                    <hr style={{width:'80%'}}></hr>
                                </li>
                                        ))}
                        </ul>

                        </div>
                </div>
            </div>
        </>
      
    )
}
export default Dashboard;