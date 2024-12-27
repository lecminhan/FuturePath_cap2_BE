// chartOptions.js
// chartConfig.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các phần tử của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ Thời gian Sử dụng Máy và Chi phí Giao dịch",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Ngày",
      },
    },
    y1: {
      type: "linear",
      position: "left",
      title: {
        display: true,
        text: "Thời gian (giờ)",
      },
    },
    y2: {
      type: "linear",
      position: "right",
      title: {
        display: true,
        text: "Chi phí (VND)",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};
