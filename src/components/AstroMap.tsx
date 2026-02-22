import { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { PlanetMap, LineType, LineSegments } from '../lib/astronomy';
import { getLineSegments } from '../lib/astronomy';
import { COLORS, LINE_DASH, BIRTH } from '../lib/constants';
import type { PlanetName } from '../lib/constants';

interface AstroMapProps {
  planets: PlanetMap;
  gst: number;
  selectedPlanet: PlanetName | null;
  showAll: boolean;
  activeLineTypes: LineType[];
}

const starIcon = L.divIcon({
  html: '<div style="font-size:22px;line-height:1;text-shadow:0 0 6px #FFD700">★</div>',
  className: '',
  iconAnchor: [11, 11],
});

interface PlanetLines {
  name: string;
  color: string;
  segments: { type: LineType; segs: LineSegments; dash?: string }[];
}

function usePlanetLines(
  planets: PlanetMap,
  gst: number,
  selectedPlanet: PlanetName | null,
  showAll: boolean,
  activeLineTypes: LineType[]
): PlanetLines[] {
  return useMemo(() => {
    const names = showAll
      ? Object.keys(planets)
      : selectedPlanet
      ? [selectedPlanet]
      : [];

    return names.map((name) => ({
      name,
      color: COLORS[name as PlanetName],
      segments: activeLineTypes.map((lt) => ({
        type: lt,
        segs: getLineSegments(planets[name], lt, gst),
        dash: LINE_DASH[lt],
      })),
    }));
  }, [planets, gst, selectedPlanet, showAll, activeLineTypes]);
}

export default function AstroMap({ planets, gst, selectedPlanet, showAll, activeLineTypes }: AstroMapProps) {
  const planetLines = usePlanetLines(planets, gst, selectedPlanet, showAll, activeLineTypes);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ flex: 1, minHeight: 0 }}
      zoomControl={true}
    >
      {/* Dark-filtered OSM tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
        maxZoom={18}
        className="dark-tiles"
      />

      {/* Birth location marker */}
      <Marker position={[BIRTH.lat, BIRTH.lng]} icon={starIcon}>
        <Popup>
          <strong>★ Milan</strong>
          <br />
          Your birthplace
        </Popup>
      </Marker>

      {/* Astrocartography lines */}
      {planetLines.map(({ name, color, segments }) =>
        segments.map(({ type, segs, dash }) =>
          segs.map((pts, i) => (
            <Polyline
              key={`${name}-${type}-${i}`}
              positions={pts}
              pathOptions={{
                color,
                weight: 2.5,
                opacity: 0.95,
                dashArray: dash,
              }}
            />
          ))
        )
      )}
    </MapContainer>
  );
}
