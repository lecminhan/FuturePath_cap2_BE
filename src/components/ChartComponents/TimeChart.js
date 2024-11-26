// TimeChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../config/ChartOptions';
import useChartData from '../../hooks/useChartData';

const TimeChart = () => {
    const { chartData, loading, error } = useChartData();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Kiểm tra xem chartData có tồn tại và có dữ liệu cho timeChart không
    if (!chartData || !chartData.timeChartData) {
        return <div>No data available</div>;
    }

    return <Line data={chartData.timeChartData} options={chartOptions} />;
};

export default TimeChart;
