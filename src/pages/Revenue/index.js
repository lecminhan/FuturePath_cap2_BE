import revenue from './revenue.css'
import NotificationIcons from '../../components/Notifications';
import DatePicker from '../../components/DatePickerComponents';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/Search';
import RMachinepaginations from '../../components/Paginations/revenueMachinePaginations';
import { Navigate, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import useTotalRevenue from '../../hooks/useTotalRevenue';
import useRecentTransactions from '../../hooks/useRecentTransactions';

import CostChart from '../../components/ChartComponents/RevenueChart';

function Revenue(){
    const { totalRevenue, loading: loadingRevenue, error: errorRevenue } = useTotalRevenue();
    const { userTransactions, loading: loadingTransactions, error: errorTransactions } = useRecentTransactions();
    const navigate = useNavigate();
    if (loadingRevenue || loadingTransactions) {
        return <div>Loading...</div>;
    }

    if (errorRevenue || errorTransactions) {
        return (
            <div>
                <p>Error: {errorRevenue || errorTransactions}</p>
            </div>
        );
    }
    return(
        <div className="revenue">
            <div className='header'>
            <div className='reload'> <NotificationIcons/></div>
            </div>
            <div className="section-1 ">
            <div className="section-left">
                <div className="table1 box">
                    <div className='DatePicker'>
                        <DatePicker/>
                    </div>
                </div>
                <div className="table2 box">
                        <div style={{textAlign:'center', fontSize:'20px', fontWeight:600, color:'#5B6C8F'}}>Tổng doanh thu</div>
                        <div style={{textAlign:'center', fontSize:'25px',color:'#5B6C8F' }}>{totalRevenue} VND</div>
                </div>
                <div className="table3 box">
                <div className='title-recentrans'> Giao dịch gần đây</div>
                <ul className='content-recentrans'>
                {userTransactions.length === 0 ? (
                    <li>No transactions found</li>
                        ) : (
                            userTransactions.map((transaction) => (
                            <li
                                style={{ marginLeft: '20px', color: '#5B6C8F' }}
                                        key={transaction.id + transaction.userName}
                                    >
                                        <strong>Người dùng:</strong> {transaction.userName}
                                        <br />
                                        {new Date(
                                            `${transaction.timestamp[0]}-${transaction.timestamp[1]}-${transaction.timestamp[2]} ${transaction.timestamp[3]}:${transaction.timestamp[4]}`
                                        ).toLocaleDateString()}
                                        <br />
                                        <strong>
                                            <div
                                                style={{
                                                    textAlign: 'right',
                                                    marginRight: '20px',
                                                    color: '#2FE5B6',
                                                }}
                                            >
                                                {transaction.amount} VND
                                            </div>
                                        </strong>
                                        <hr style={{ width: '80%' }} />
                                    </li>
                                ))
                            )}
                        </ul>
                    <div className='viewalltransactions'>
                    <button className='button-viewalltransactions'
                    onClick={() => navigate('/transactions')} 
                    >
                        Xem tất cả giao dịch
                    </button>
                    </div>
                </div>
            </div>
            <div className="section-right">
                <div className='table4 box'>
                <div className='machine-tablebox'>
                <div className='Rmachine-paginations'>            
                    <RMachinepaginations/>
                    </div>           
                </div>
            </div>
        </div>
     </div>
     <div className="section-2 box">  
            <div className='transactions-chart'>
                <CostChart/>
            </div>
        </div>
     </div>
    )
}
export default Revenue;