// ContactMap.tsx
"use client";

import { memo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Ayarlar ---
const OFFICE = {
  name: "Neşeli Gayrimenkul",
  lat: 39.965831,
  lng: 32.646853,
  addressLines: ["Merkez Mahallesi, Emlak Caddesi No:123", "Kadıköy, İstanbul"],
  phone: "+902161234567",
  email: "info@neseligayrimenkul.com",
};

// Popup açıkken, haritayı 100px sağa it (popup'ın kesilmesini azaltır)
function NudgeOnPopupOpen() {
  const map = useMap();
  useEffect(() => {
    const handler = () => map.panBy([100, 0]); // 100px sağa
    map.on("popupopen", handler);
    return () => {
      map.off("popupopen", handler);
    };
  }, [map]);
  return null;
}

// Leaflet default marker ikonlarını 1.9.4 ile eşle
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Popup içerik bileşeni
const OfficePopup = memo(function OfficePopup() {
  const gmaps = `https://www.google.com/maps?q=${OFFICE.lat},${OFFICE.lng}`;
  const amaps = `http://maps.apple.com/?daddr=${OFFICE.lat},${OFFICE.lng}`;

  return (
    <div className="text-center p-2">
      <h3 className="text-lg font-bold text-blue-600 mb-2">{OFFICE.name}</h3>
      <p className="text-gray-600 text-sm mb-3 leading-snug">
        {OFFICE.addressLines[0]} <br />
        {OFFICE.addressLines[1]}
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        <a
          href={`tel:${OFFICE.phone}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          📞 Ara
        </a>
        <a
          href={`mailto:${OFFICE.email}`}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          ✉️ E-posta
        </a>
        <a
          href={gmaps}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          🗺️ Google Maps
        </a>
        <a
          href={amaps}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          🍎 Apple Maps
        </a>
      </div>
    </div>
  );
});

export default function ContactMap() {
  // Marker ortada kalınca popup üstte kesilmesin diye merkezi hafif doğuya kaydır
  const center: [number, number] = [OFFICE.lat, OFFICE.lng + 0.0002];

  return (
    <div className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl"
        preferCanvas
        scrollWheelZoom
      >
        <NudgeOnPopupOpen />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[OFFICE.lat, OFFICE.lng]} icon={DefaultIcon}>
          <Popup>
            <OfficePopup />
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
