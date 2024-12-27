import { useState, useEffect, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDB } from "../FirebaseConfig"; // Ensure the correct path to FirebaseConfig

const useFirebaseMachineStatus = (WashingMachineList) => {
  const [firebaseStatus, setFirebaseStatus] = useState([]);
  const unsubscribeRefs = useRef([]);

  useEffect(() => {
    // Clean up previous subscriptions
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];

    if (WashingMachineList.length > 0) {
      WashingMachineList.forEach((machine) => {
        const statusRef = ref(
          realtimeDB,
          `WashingMachineList/${machine.secretId}/status`
        );
        const unsubscribe = onValue(statusRef, (snapshot) => {
          const data = snapshot.val();
          // Only update the state if the status has changed
          setFirebaseStatus((prevStatus) => {
            // Find the existing status for this machine
            const existingStatus = prevStatus.find(
              (status) => status.secretId === machine.secretId
            );

            // If the status has not changed, no need to update
            if (existingStatus && existingStatus.status === data) {
              return prevStatus; // No update needed
            }

            // Otherwise, update the state
            const updatedStatus = prevStatus.filter(
              (status) => status.secretId !== machine.secretId
            );
            return [
              ...updatedStatus,
              {
                secretId: machine.secretId,
                status: data,
              },
            ];
          });
        });

        // Store unsubscribe function in ref
        unsubscribeRefs.current.push(unsubscribe);
      });
    }

    // Cleanup function
    return () => {
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    };
  }, [WashingMachineList.length]); // Now depends on the length of WashingMachineList, not the list itself

  return firebaseStatus;
};

export default useFirebaseMachineStatus;
