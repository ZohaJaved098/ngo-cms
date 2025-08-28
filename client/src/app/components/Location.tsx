"use client";

import { useEffect, useRef } from "react";
import L, { Map as LeafletMap, Marker } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
type LocationProps = {
  mode: "create" | "edit" | "view";
  lat?: number;
  lng?: number;
  onChange?: (lat: number, lng: number) => void;
};

const Location = ({ mode, lat, lng, onChange }: LocationProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const iconMarkup = renderToStaticMarkup(
    <FaMapMarkerAlt color="red" size={40} />
  );
  const customMarker = L.divIcon({
    html: iconMarkup,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      [lat || 24.8607, lng || 67.0011],
      13
    );
    mapInstanceRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add marker
    if (lat && lng) {
      markerRef.current = L.marker([lat, lng], {
        draggable: mode !== "view",
        icon: customMarker,
      }).addTo(map);
    } else if (mode !== "view") {
      markerRef.current = L.marker([24.8607, 67.0011], {
        draggable: true,
        icon: customMarker,
      }).addTo(map);
    }

    // Handle drag
    if (markerRef.current && mode !== "view") {
      markerRef.current.on("dragend", () => {
        const { lat, lng } = markerRef.current!.getLatLng();
        onChange?.(lat, lng);
      });
    }

    // Handle click
    if (mode !== "view") {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
            map
          );
        }
        onChange?.(lat, lng);
      });
    }

    return () => {
      map.remove();
    };
  }, [lat, lng, mode, onChange, customMarker]);

  return (
    <div className="mb-4 flex flex-col w-full gap-5 z-0">
      <h1 className={`${mode === "view" && "font-bold"}`}>Location:</h1>
      <div className="flex flex-wrap gap-5">
        <p>Longitude: {lng}</p>
        <p>Latitude: {lat}</p>
      </div>
      <MapContainer center={[24.8607, 67.0011]} zoom={13}>
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
      <div className="relative w-full h-96 rounded-lg border border-gray-300 shadow-md overflow-hidden">
        <div ref={mapRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
    </div>
  );
};

export default Location;
