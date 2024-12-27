import React from "react";
import useTotalUsageTime from "../../hooks/useTotalUsageTime";

const MachineUsage = ({ machineId }) => {
  const { totalTime, loading, error } = useTotalUsageTime(machineId);

  if (loading) return <span>Đang tải...</span>;
  if (error) return <span>Lỗi: {error}</span>;

  return <span>{totalTime} giờ</span>;
};

export default MachineUsage;
