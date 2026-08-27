import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TempleMap = ({ templeLat = 20.8880, templeLng = 70.4012, zones = {} }) => {
  const defaultZoneCoordinates = {
    main_entrance: [templeLat + 0.0005, templeLng - 0.0005],
    queue_area: [templeLat + 0.0002, templeLng + 0.0003],
    darshan_hall: [templeLat, templeLng],
    prasadam_area: [templeLat - 0.0003, templeLng + 0.0004],
    exit_gates: [templeLat - 0.0006, templeLng - 0.0002],
    parking_lot: [templeLat + 0.0010, templeLng - 0.0010],
    medical_center: [templeLat - 0.0008, templeLng + 0.0008]
  };

  const getMarkerColor = (risk) => {
    switch (risk) {
      case 'CRITICAL': return '#D32F2F';
      case 'HIGH': return '#E65100';
      case 'MODERATE': return '#ED6C02';
      default: return '#2E7D32';
    }
  };

  return (
    <div className="temple-card p-3 h-100" style={{ minHeight: '380px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold text-maroon mb-0">TEMPLE PREMISES GIS ZONE MAP</h6>
        <div className="d-flex gap-2" style={{ fontSize: '0.75rem' }}>
          <span className="badge badge-low">🟢 LOW</span>
          <span className="badge badge-moderate">🟡 MODERATE</span>
          <span className="badge badge-high">🟠 HIGH</span>
          <span className="badge badge-critical">🔴 CRITICAL</span>
        </div>
      </div>

      <div style={{ height: '320px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-beige)' }}>
        <MapContainer center={[templeLat, templeLng]} zoom={17} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(zones).map(([key, zone]) => {
            const coords = defaultZoneCoordinates[key] || [templeLat, templeLng];
            const color = getMarkerColor(zone.risk_level);
            const densityPercent = Math.min(100, Math.round((zone.visitors / (zone.capacity || 2000)) * 100));

            return (
              <CircleMarker
                key={key}
                center={coords}
                radius={20}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.8, weight: 3 }}
              >
                <Popup>
                  <div style={{ minWidth: '200px', color: '#2C1810', fontFamily: 'Segoe UI, sans-serif' }}>
                    <h6 style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#6B1D2F' }}>{zone.name}</h6>
                    <hr style={{ margin: '4px 0', borderColor: '#E0D5C7' }} />
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                      <div><strong>Devotees:</strong> {zone.visitors}</div>
                      <div><strong>Density Load:</strong> {densityPercent}%</div>
                      <div><strong>Active Queue:</strong> {zone.queue || 0}</div>
                      <div><strong>Est. Wait Time:</strong> {Math.round(zone.queue / 30.0)} min</div>
                      <div><strong>Risk Level:</strong> <span style={{ color: color, fontWeight: 'bold' }}>{zone.risk_level}</span></div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default TempleMap;
