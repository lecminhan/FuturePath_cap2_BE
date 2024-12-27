import React, { useState } from "react";
import axios from "axios";
import { TextField, List, ListItem, ListItemText } from "@mui/material";

const MapboxAutocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const MAPBOX_TOKEN =
    "pk.eyJ1IjoibGV4dWFudGFuMTU5IiwiYSI6ImNsbzM4c2cweDBmcWQyaW1ueG14Nndva3AifQ.TSdOxrNmWd8JO8jV6C5bHg"; // Thay thế bằng Mapbox Access Token của bạn

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              autocomplete: true,
              limit: 5,
              types: "place,locality,neighborhood,address",
            },
          }
        );
        setResults(response.data.features);
      } catch (error) {
        console.error("Error fetching data from Mapbox:", error);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setResults([]);
    onSelect({
      description: place.place_name,
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    });
  };

  return (
    <div>
      <TextField
        fullWidth
        value={query}
        onChange={handleInputChange}
        placeholder="Tìm kiếm địa điểm"
      />
      {results.length > 0 && (
        <List>
          {results.map((place) => (
            <ListItem key={place.id} onClick={() => handleSelect(place)} button>
              <ListItemText primary={place.place_name} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default MapboxAutocomplete;
