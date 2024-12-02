// src/hooks/useFirebaseMachineStatus.js

import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../FirebaseConfig"; // Ensure the correct path to FirebaseConfig

const useFirebaseMachineStatus = (machines) => {
  const [firebaseStatus, setFirebaseStatus] = useState([]); // State to store Firebase data
  const unsubscribeRefs = useRef([]); // Store unsubscribe functions in a ref

  useEffect(() => {
    // Clean up previous subscriptions when machines change
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];

    if (machines.length > 0) {
      // Subscribe to Firebase status updates for each machine
      machines.forEach((machine) => {
        const machinesRef = ref(realtimeDB, `machines/${machine.id}/status`);
        const unsubscribe = onValue(machinesRef, (snapshot) => {
          // snapshot holds the data from Firebase
          const data = snapshot.val(); // Get the actual value of the snapshot

          if (data) {
            // Use snapshot to get data and update the status state
            setFirebaseStatus((prevStatus) => {
              const updatedStatus = prevStatus.filter(
                (status) => status.machineId !== machine.id
              );
              return [
                ...updatedStatus,
                {
                  machineId: machine.id,
                  status: data,
                },
              ];
            });
          }
        });

        // Store unsubscribe function in ref
        unsubscribeRefs.current.push(unsubscribe);
      });
    }

    // Cleanup function to unsubscribe when the component unmounts or machines change
    return () => {
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    };
  }, [machines]);

  return firebaseStatus;
};

export default useFirebaseMachineStatus;
