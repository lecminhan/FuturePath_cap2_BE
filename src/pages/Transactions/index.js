import React from "react";
import { useNavigate } from "react-router-dom";
import TransactionPaginations from "../../components/Paginations/transactionsPagination";
import style from "./style.css";
import NotificationIcons from "../../components/Notifications";
import { Undo2 } from "lucide-react";
function TransactionsPage() {
  const navigate = useNavigate();

  return (
    <div className="transactions">
      <div className="top-header">
        <div></div>
        <div>
          <NotificationIcons />
        </div>
      </div>

      <div className="t-table">
        <div></div>
        <TransactionPaginations />
        <button onClick={() => navigate("/revenue")} className="t-button">
          <Undo2 />
        </button>
      </div>
    </div>
  );
}

export default TransactionsPage;
