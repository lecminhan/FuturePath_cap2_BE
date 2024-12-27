import React, { useState, useEffect, useCallback } from "react";
import Map, { NavigationControl, Marker, Popup } from "react-map-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const containerStyle = {
  width: "920px",
  height: "500px",
  padding: "20px",
  margin: "20px",
  borderRadius: "5px",
};

const center = {
  latitude: 16.053,
  longitude: 108.2482,
};

function MyMapbox() {
  const [viewport, setViewport] = useState({
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 10,
    width: "400px",
    height: "400px",
  });
  const API_HOST = process.env.REACT_APP_API_HOST;
  const token = localStorage.getItem("authToken");
  const roleName = localStorage.getItem("roleName"); // Lấy role từ localStorage
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        let locationData = [];
        let ownerMachineIds = [];

        // Gọi API cho ROLE_OWNER để lấy danh sách machine_id
        if (roleName === "ROLE_OWNER") {
          const ownerResponse = await axios.get(
            `${API_HOST}/api/machines/owner/current`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "69420",
              },
            }
          );
          ownerMachineIds = ownerResponse.data.map((machine) => machine.id);
          console.log(ownerMachineIds);
        }

        // Gọi API locations
        const locationResponse = await axios.get(`${API_HOST}/api/locations`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        });
        locationData = locationResponse.data;

        // Lọc các location trùng id nếu roleName là ROLE_OWNER
        if (roleName === "ROLE_OWNER" && ownerMachineIds.length > 0) {
          locationData = locationData.filter((location) =>
            ownerMachineIds.includes(location.id)
          );
        }

        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLocations();
  }, [API_HOST, roleName, token]);

  const onLoad = useCallback((map) => {
    const bounds = [
      [center.longitude - 0.05, center.latitude - 0.05],
      [center.longitude + 0.05, center.latitude + 0.05],
    ];
    map.fitBounds(bounds, { padding: 20 });
  }, []);

  return (
    <Map
      {...viewport}
      onMove={(evt) =>
        setViewport({
          ...viewport,
          latitude: evt.viewState.latitude,
          longitude: evt.viewState.longitude,
          zoom: evt.viewState.zoom,
        })
      }
      mapboxAccessToken="pk.eyJ1IjoibGV4dWFudGFuMTU5IiwiYSI6ImNsbzM4c2cweDBmcWQyaW1ueG14Nndva3AifQ.TSdOxrNmWd8JO8jV6C5bHg"
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onLoad={(e) => onLoad(e.target)}
      style={containerStyle}
    >
      <NavigationControl position="top-right" />

      {locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.lng}
          latitude={location.lat}
          onClick={() => setSelectedLocation(location)} // Xử lý click
        >
          <div style={{ color: "red", fontWeight: "bold" }}>
            <img
              style={{ height: 50, width: 50 }}
              src="/images/MapPointer.png"
              alt="Map Pointer"
            />
          </div>
        </Marker>
      ))}

      {/* Hiển thị Popup khi Marker được click */}
      {selectedLocation && (
        <Popup
          longitude={selectedLocation.lng}
          latitude={selectedLocation.lat}
          onClose={() => setSelectedLocation(null)} // Đóng Popup
          closeOnClick={false}
        >
          <div>
            <strong>{selectedLocation.name}</strong>
            <br></br>
            Địa chỉ: {selectedLocation.address}
            <br></br>
            Phường: {selectedLocation.ward}
            <br></br>
            Quận: {selectedLocation.district}
            <br></br>
            Thành phố:{selectedLocation.city}
            <br></br>
            Số lượng máy: {selectedLocation.machineCount}{" "}
          </div>
        </Popup>
      )}
    </Map>
  );
}

export default React.memo(MyMapbox);
