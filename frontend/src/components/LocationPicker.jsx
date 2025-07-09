// src/components/LocationPicker.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

const LocationPicker = ({ value, onChange }) => {
  const [search, setSearch] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState([]);
  const [position, setPosition] = useState(value?.coords || [20.5888, -100.3899]); // Querétaro centro por defecto

  const handleSearchChange = async (e) => {
    const text = e.target.value;
    setSearch(text);
    if (text.length > 3) {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${text}&format=json&limit=5&countrycodes=mx`);
      setSuggestions(res.data);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    const { lat, lon, display_name } = place;
    const coords = [parseFloat(lat), parseFloat(lon)];
    setPosition(coords);
    setSearch(display_name);
    setSuggestions([]);
    onChange({ address: display_name, coords });
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setPosition(coords);
        onChange({ address: search, coords });
      },
    });
    return position === null ? null : <Marker position={position} />;
  }

  return (
    <div className="space-y-2">
      <label className="font-semibold">Buscar ubicación</label>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Ej. Calle 5 de Febrero, Querétaro"
        className="w-full border rounded px-3 py-2"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border max-h-40 overflow-y-auto shadow rounded text-sm">
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(sug)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}
      <div className="h-64 mt-2">
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="h-full w-full z-0">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
