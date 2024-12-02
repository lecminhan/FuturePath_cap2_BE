import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import useMachineIncomeList from "../../hooks/useMachineIncomeList";
import useMachineIncome from "../../hooks/useMachineIncome";

function Rmachinepaginations() {
  const {
    currentItems,
    currentPage,
    totalPages,
    loading,
    error,
    handlePageChange,
  } = useMachineIncomeList();

  // Fetch machine income data
  const {
    incomeByMachine,
    loading: incomeLoading,
    error: incomeError,
  } = useMachineIncome();

  // Show loading or error states for the data fetch
  if (loading || incomeLoading) return <p>Đang tải dữ liệu...</p>;
  if (error || incomeError) return <p>Có lỗi xảy ra: {error || incomeError}</p>;

  return (
    <div>
      <table className="machines-information-table">
        <thead>
          <tr>
            <th>Mã số máy</th>
            <th>Tên Máy</th>
            <th>Trạng thái</th>
            <th>Địa điểm</th>
            <th>Thu nhập</th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.status}</td>
                <td>
                  {data.locationName},<br />
                  {data.locationAddress}
                </td>
                <td>{incomeByMachine[data.id]?.totalIncome || 0} VND</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            border: 0,
            borderRadius: 10,
            background: "#fff",
            padding: "5px 10px",
          }}
        >
          <ChevronLeft className="chevronStyle" />
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            style={{
              backgroundColor:
                currentPage === index + 1 ? "lightblue" : "white",
              border: 0,
              borderRadius: 10,
              padding: "5px 10px",
            }}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            border: 0,
            borderRadius: 10,
            background: "#fff",
            padding: "5px 10px",
          }}
        >
          <ChevronRight className="chevronStyle" />
        </button>
      </div>
    </div>
  );
}

export default Rmachinepaginations;
