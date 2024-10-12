import revenue from './revenue.css'
import NotificationIcons from '../../components/Notifications';
import DatePicker from '../../components/DatePicker';
import React, { useEffect, useState } from 'react';
function Revenue(){
    const [totalrevenue, setTotalrevenue] = useState([]);
    const [usertransactions, setUsertransactions] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi API để lấy tổng doanh thu
                const totalrevenueResponse = await fetch('http://localhost:3004/api/revenue/totalrevenue'); 
                const totalrevenueData = await totalrevenueResponse.json(); 
                if (totalrevenueData.length > 0) {
                    setTotalrevenue(totalrevenueData[0].sum); // Truy cập vào phần tử đầu tiên của mảng và lấy giá trị sum
                }

                //list danh sách giao dịch gần nhất
                const usertransactionsResponse = await fetch('http://localhost:3004/api/revenue/user-transactions'); // Thay đổi URL nếu cần
                const usertransactionsData = await usertransactionsResponse.json();
                setUsertransactions(usertransactionsData); // Lưu dữ liệu vào state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData(); // Gọi hàm fetchData khi component được mount
    }, []); // Chỉ chạy 1 lần khi component mount
    return(
        <div className="revenue">
            <div className='header'>
            <div className='reload'> <NotificationIcons/></div>
            </div>
            <div className="section-1 ">
            <div className="section-left">
                <div className="table1 box">
                    <div style={{fontSize:"20px",marginLeft:"10px",color:"#5B6C8F"}}>
                        Date Picker
                    </div>
                    <div className="datePicker3">
                        <DatePicker/>
                    </div>
                </div>
                <div className="table2 box">
                        <div>Total Revenue</div>
                        <div>${totalrevenue}</div>
                </div>
                <div className="table3 box">
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
                        <div>view all transaction</div>
                </div>
            </div>
            <div className="section-right">
                <div className='table4 box'>4</div>
            </div>
            </div>
            <div className="section-2 box">
                5
            </div>
        </div>
    )
}
export default Revenue;