

export const generateChartData = (usageHistory) => {
    const usageDurations = usageHistory.map(item => {
        const startDateTime = new Date(...item.startTime);
        const endDateTime = new Date(...item.endTime);
        return (endDateTime - startDateTime) / (1000 * 60 * 60); // Convert to hours
    });
    
    const transactionCosts = usageHistory.map(item => item.cost || 0);
    const dates = usageHistory.map(item => new Date(...item.startTime).toLocaleDateString('vi-VN'));

    return {
        labels: dates,
        datasets: [
            {
                label: 'Thời gian sử dụng (giờ)',
                data: usageDurations,
                borderColor: '#FE876F',
                backgroundColor: 'rgba(254, 135, 111, 0.2)',
                yAxisID: 'y1',
                tension: 0.4,
                pointBackgroundColor: '#FE876F',
                pointBorderColor: '#FE876F',
            },
            {
                label: 'Chi phí giao dịch (VND)',
                data: transactionCosts,
                borderColor: '#ACD7D9',
                backgroundColor: '#ACD7D9',
                yAxisID: 'y2',
                tension: 0.4,
                pointBackgroundColor: '#ACD7D9',
                pointBorderColor: '#ACD7D9',
            },
        ],
    };
};

export const generateTimeChartData = (usageHistory) => {
    const usageDurations = usageHistory.map(item => {
        const startDateTime = new Date(...item.startTime);
        const endDateTime = new Date(...item.endTime);
        return (endDateTime - startDateTime) / (1000 * 60 * 60); // Convert to hours
    });
    
    const dates = usageHistory.map(item => new Date(...item.startTime).toLocaleDateString('vi-VN'));

    return {
        labels: dates,
        datasets: [
            {
                label: 'Thời gian sử dụng (giờ)',
                data: usageDurations,
                borderColor: '#FE876F',
                backgroundColor: 'rgba(254, 135, 111, 0.2)',
                tension: 0.4,
                pointBackgroundColor: '#FE876F',
                pointBorderColor: '#FE876F',
            },
        ],
    };
};

export const generateCostChartData = (usageHistory) => {
    const transactionCosts = usageHistory.map(item => item.cost || 0);
    const dates = usageHistory.map(item => new Date(...item.startTime).toLocaleDateString('vi-VN'));

    return {
        labels: dates,
        datasets: [
            {
                label: 'Chi phí giao dịch (VND)',
                data: transactionCosts,
                borderColor: '#ACD7D9',
                backgroundColor: '#ACD7D9',
                tension: 0.4,
                pointBackgroundColor: '#ACD7D9',
                pointBorderColor: '#ACD7D9',
            },
        ],
    };
};
