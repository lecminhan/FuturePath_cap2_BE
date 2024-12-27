export const generateChartData = (usageHistory) => {
  // Tạo một đối tượng để nhóm theo ngày
  const dailyData = usageHistory.reduce((acc, item) => {
    const startDate = new Date(
      item.startTime[0], // year
      item.startTime[1] - 1, // month (0-based)
      item.startTime[2], // day
      item.startTime[3], // hour
      item.startTime[4], // minute
      item.startTime[5], // second
      0 // mili giây
    );
    const endDate = new Date(
      item.endTime[0], // year
      item.endTime[1] - 1, // month (0-based)
      item.endTime[2], // day
      item.endTime[3], // hour
      item.endTime[4], // minute
      item.endTime[5], // second
      0 // mili giây
    );

    const dateKey = startDate.toLocaleDateString("vi-VN"); // Sử dụng ngày (theo định dạng "dd/MM/yyyy") làm khóa

    // Tính thời gian sử dụng cho mỗi giao dịch
    const usageDuration = (endDate - startDate) / (1000 * 60 * 60); // Convert to hours
    const transactionCost = item.cost || 0;

    if (!acc[dateKey]) {
      acc[dateKey] = { totalDuration: 0, totalCost: 0 };
    }

    // Cộng dồn thời gian sử dụng và chi phí cho mỗi ngày
    acc[dateKey].totalDuration += usageDuration;
    acc[dateKey].totalCost += transactionCost;

    return acc;
  }, {});

  // Chuyển đối tượng thành mảng và sắp xếp theo ngày
  const dates = Object.keys(dailyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const usageDurations = dates.map((date) => dailyData[date].totalDuration);
  const transactionCosts = dates.map((date) => dailyData[date].totalCost);

  return {
    labels: dates,
    datasets: [
      {
        label: "Thời gian sử dụng (giờ)",
        data: usageDurations,
        borderColor: "#FE876F",
        backgroundColor: "#FE876F",
        yAxisID: "y1",
        tension: 0.4,
        pointBackgroundColor: "#FE876F",
        pointBorderColor: "#FE876F",
      },
      {
        label: "Chi phí giao dịch (VND)",
        data: transactionCosts,
        borderColor: "#ACD7D9",
        backgroundColor: "#ACD7D9",
        yAxisID: "y2",
        tension: 0.4,
        pointBackgroundColor: "#ACD7D9",
        pointBorderColor: "#ACD7D9",
      },
    ],
  };
};

export const generateTimeChartData = (usageHistory) => {
  // Nhóm và tính tổng thời gian sử dụng cho mỗi ngày
  const dailyData = usageHistory.reduce((acc, item) => {
    const startDate = new Date(
      item.startTime[0], // year
      item.startTime[1] - 1, // month (0-based)
      item.startTime[2], // day
      item.startTime[3], // hour
      item.startTime[4], // minute
      item.startTime[5], // second
      0 // mili giây
    );
    const endDate = new Date(
      item.endTime[0], // year
      item.endTime[1] - 1, // month (0-based)
      item.endTime[2], // day
      item.endTime[3], // hour
      item.endTime[4], // minute
      item.endTime[5], // second
      0 // mili giây
    );
    const dateKey = startDate.toLocaleDateString("vi-VN");

    // Tính thời gian sử dụng cho mỗi giao dịch
    const usageDuration = (endDate - startDate) / (1000 * 60 * 60); // Convert to hours

    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }

    acc[dateKey] += usageDuration;

    return acc;
  }, {});

  const dates = Object.keys(dailyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const usageDurations = dates.map((date) => dailyData[date]);

  return {
    labels: dates,
    datasets: [
      {
        label: "Thời gian sử dụng (giờ)",
        data: usageDurations,
        borderColor: "#FE876F",
        backgroundColor: "#FE876F",
        tension: 0.4,
        pointBackgroundColor: "#FE876F",
        pointBorderColor: "#FE876F",
      },
    ],
  };
};

export const generateCostChartData = (usageHistory) => {
  // Nhóm và tính tổng chi phí giao dịch cho mỗi ngày
  const dailyData = usageHistory.reduce((acc, item) => {
    const startDate = new Date(
      item.startTime[0], // year
      item.startTime[1] - 1, // month (0-based)
      item.startTime[2], // day
      item.startTime[3], // hour
      item.startTime[4], // minute
      item.startTime[5], // second
      0 // mili giây
    );
    const dateKey = startDate.toLocaleDateString("vi-VN");

    const transactionCost = item.cost || 0;

    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }

    acc[dateKey] += transactionCost;

    return acc;
  }, {});

  const dates = Object.keys(dailyData).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const transactionCosts = dates.map((date) => dailyData[date]);

  return {
    labels: dates,
    datasets: [
      {
        label: "Chi phí giao dịch (VND)",
        data: transactionCosts,
        borderColor: "#ACD7D9",
        backgroundColor: "#ACD7D9",
        tension: 0.4,
        pointBackgroundColor: "#ACD7D9",
        pointBorderColor: "#ACD7D9",
      },
    ],
  };
};
