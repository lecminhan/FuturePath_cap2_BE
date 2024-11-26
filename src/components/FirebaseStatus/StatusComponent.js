import React from "react";
import useFetchFirestoreData from "./useFetchFirestoreData";
import useFetchRealtimeData from "./useFetchRealtimeData";

const StatusDashboard = () => {
  const { data: firestoreData, loading: firestoreLoading } = useFetchFirestoreData("machines");
  const { data: realtimeData, loading: realtimeLoading } = useFetchRealtimeData("/machines/status");

  if (firestoreLoading || realtimeLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Machine Status from Firestore</h2>
      <ul>
        {firestoreData.map((item) => (
          <li key={item.id}>
            Machine ID: {item.id}, Status: {item.status}
          </li>
        ))}
      </ul>

      <h2>Machine Status from Realtime Database</h2>
      <pre>{JSON.stringify(realtimeData, null, 2)}</pre>
    </div>
  );
};

export default StatusDashboard;
