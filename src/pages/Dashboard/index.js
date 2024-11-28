import { RefreshCcw, BellRing, Sun, Search } from 'lucide-react';
import dashboard from './dashboard.css';
import SearchBar from '../../components/Search';
import NotificationIcons from '../../components/Notifications';
import React, { useEffect, useState } from 'react';
import StatusComponent from '../../components/StatusComponent/StatusComponents';
import CombinedChart from '../../components/ChartComponents/combinedChart';
import useRecentTransactions from '../../hooks/useRecentTransactions';
import useTotalRevenue from "../../hooks/useTotalRevenue";
function Dashboard() {
    const [loadingRevenue, setLoadingRevenue] = useState(false); // Loading state
    const [errorRevenue, setErrorRevenue] = useState(null); // Error state
    const { userTransactions, loading: loadingTransactions, error: errorTransactions } = useRecentTransactions();
    const { totalRevenue, loading, error } = useTotalRevenue();
    if (loadingRevenue || loadingTransactions) {
        return <div>Loading...</div>;
    }
    if (loading) return <p>Loading revenue data...</p>;
    if (error) return <p>Error: {error}</p>;
    if (errorRevenue || errorTransactions) {
        return (
            <div>
                <p>Error: {errorRevenue || errorTransactions}</p>
            </div>
        );
    }
    
    
    return (
        <>
            <div className='dashboard'>
                <div className="header">
                    <div className="reload">
                        <NotificationIcons />
                    </div>
                </div>
                <div className='section1'>
                    <div className='today-revenue box-color'>
                        <h3>Tổng doanh thu</h3>
                        <p>  <p>{totalRevenue ? `${totalRevenue}` : "No revenue data available."}</p> </p>
                    </div>
                    <StatusComponent className='available box-color' />
                    <StatusComponent className='active box-color' />
                    <StatusComponent className='maintenance box-color' />
                </div>
                <div className='section2'>
                    <div className='chart box-color'>
                        <CombinedChart />
                    </div>
                    <div className='r-transactions box-color'>
                        <div className='title-recentrans'>Giao dịch gần đây</div>
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
