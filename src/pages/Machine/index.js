import NotificationIcons from "../../components/Notifications";
import Machinepaginations from "../../components/MachinesTable/machinePagination";
import "./machine.css";
import React, { useEffect, useState } from "react";
import TimeChart from "../../components/ChartComponents/TimeChart";
import AddMachineForm from "../../components/AddMachineComponent/AddMachineComponent";
import { Plus } from "lucide-react";

function Machine() {
  const [showForm, setShowForm] = useState(false);
  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  return (
    <div className="machine-status">
      <div className="header">
        <div className="reload">
          {" "}
          <NotificationIcons />
        </div>
      </div>
      <div className="machine-active">
        <div className="section2-machine-active">
          <Machinepaginations />
        </div>
      </div>
    </div>
  );
}
export default Machine;
