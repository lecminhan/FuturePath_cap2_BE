// CostChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../config/ChartOptions';
import useChartData from '../../hooks/useChartData';

const CostChart = () => {
    const { chartData, loading, error } = useChartData();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Kiểm tra xem chartData có tồn tại và có dữ liệu cho costChart không
    if (!chartData || !chartData.costChartData) {
        return <div>No data available</div>;
    }

    return <Line data={chartData.costChartData} options={chartOptions} />;
};

export default CostChart;
