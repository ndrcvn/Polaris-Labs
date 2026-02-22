// Astrocartography astronomy calculations
// Extracted from reference HTML — simplified ecliptic-longitude approach

const D2R = Math.PI / 180;
const rad = (d: number) => d * D2R;
const deg = (r: number) => r / D2R;
const n360 = (a: number) => ((a % 360) + 360) % 360;

export function jday(y: number, m: number, d: number, h: number): number {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + h / 24;
}

function obliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T;
}

/** Greenwich Sidereal Time in degrees */
export function gst0(jd: number): number {
  const T = (jd - 2451545) / 36525;
  return n360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T);
}

/** Simplified ecliptic longitudes for all 10 planets (degrees) */
function planetLons(jd: number): Record<string, number> {
  const T = (jd - 2451545) / 36525;
  const s = (a: number) => Math.sin(rad(a));

  const Ms = n360(357.52911 + 35999.05029 * T);
  const C = (1.914602 - 0.004817 * T) * s(Ms) + (0.019993 - 0.000101 * T) * s(2 * Ms) + 0.000289 * s(3 * Ms);
  const sun = n360(280.46646 + 36000.76983 * T + C);

  const mL = n360(218.3165 + 481267.8813 * T);
  const mM = n360(134.9634 + 477198.8676 * T);
  const mD = n360(297.8502 + 445267.1115 * T);
  const mF = n360(93.2721 + 483202.0175 * T);
  const moon = n360(mL + 6.2888 * s(mM) + 1.274 * s(2 * mD - mM) + 0.6583 * s(2 * mD) + 0.2136 * s(2 * mM) - 0.1851 * s(mD) - 0.1143 * s(2 * mF));

  const meM = n360(168.6562 + 149472.5153 * T);
  const mercury = n360(252.2509 + 149472.6674 * T + 23.44 * s(meM) + 2.98 * s(2 * meM));

  const vM = n360(48.0052 + 58517.8039 * T);
  const venus = n360(181.9798 + 58517.8156 * T + 0.7758 * s(vM));

  const maM = n360(19.373 + 19140.3023 * T);
  const mars = n360(355.433 + 19140.2993 * T + 10.6912 * s(maM) + 0.6228 * s(2 * maM));

  const jM = n360(20.9 + 3034.906 * T);
  const jupiter = n360(34.3515 + 3034.9057 * T + 5.5549 * s(jM) + 0.1683 * s(2 * jM));

  const saM = n360(317.02 + 1222.114 * T);
  const saturn = n360(50.0774 + 1222.1138 * T + 6.3585 * s(saM) + 0.2204 * s(2 * saM));

  const urM = n360(141.05 + 428.48 * T);
  const uranus = n360(313.7 + 428.49 * T + 5.3 * s(urM));

  const neM = n360(256.23 + 218.46 * T);
  const neptune = n360(295.99 + 218.46 * T + 1.0 * s(neM));

  const pluto = n360(238.9 + 144.96 * (T / 100));

  return { Sun: sun, Moon: moon, Mercury: mercury, Venus: venus, Mars: mars, Jupiter: jupiter, Saturn: saturn, Uranus: uranus, Neptune: neptune, Pluto: pluto };
}

/** Convert ecliptic longitude (β=0 assumed) to equatorial RA/Dec (degrees) */
function toEq(lon: number, eps: number): { ra: number; dec: number } {
  const l = rad(lon);
  const e = rad(eps);
  return {
    ra: n360(deg(Math.atan2(Math.sin(l) * Math.cos(e), Math.cos(l)))),
    dec: deg(Math.asin(Math.sin(e) * Math.sin(l))),
  };
}

export interface PlanetData {
  lon: number;  // ecliptic longitude (degrees)
  ra: number;   // right ascension (degrees)
  dec: number;  // declination (degrees)
}

export type PlanetMap = Record<string, PlanetData>;

/** Compute planet positions for a given Julian Date */
export function computePlanetData(jd: number): PlanetMap {
  const T = (jd - 2451545) / 36525;
  const eps = obliquity(T);
  const lons = planetLons(jd);
  const result: PlanetMap = {};
  for (const [name, lon] of Object.entries(lons)) {
    const eq = toEq(lon, eps);
    result[name] = { lon, ra: eq.ra, dec: eq.dec };
  }
  return result;
}

// ── Line generation ──────────────────────────────────────────────

/** Geographic longitude where planet is on MC (culminating).
 *  GST and RA are both in degrees. Returns value in [-180, 180]. */
export function mcLon(ra: number, gst: number): number {
  const g = ((ra - gst) % 360 + 360) % 360;
  return g > 180 ? g - 360 : g;
}

/** Geographic longitude of the IC (opposite of MC) */
export function icLon(ra: number, gst: number): number {
  let lon = mcLon(ra, gst) + 180;
  if (lon > 180) lon -= 360;
  return lon;
}

/** Geographic longitude where planet rises at given latitude.
 *  Returns null if planet is circumpolar or never rises there. */
function ascLon(ra: number, dec: number, lat: number, gst: number): number | null {
  const v = -Math.tan(rad(lat)) * Math.tan(rad(dec));
  if (Math.abs(v) > 1) return null;
  const H = deg(Math.acos(v));
  const g = ((n360(ra - H) - gst) % 360 + 360) % 360;
  return g > 180 ? g - 360 : g;
}

/** Geographic longitude where planet sets at given latitude. */
function dscLon(ra: number, dec: number, lat: number, gst: number): number | null {
  const v = -Math.tan(rad(lat)) * Math.tan(rad(dec));
  if (Math.abs(v) > 1) return null;
  const H = deg(Math.acos(v));
  const g = ((n360(ra + H) - gst) % 360 + 360) % 360;
  return g > 180 ? g - 360 : g;
}

export type LatLng = [number, number];
export type LineSegments = LatLng[][];

/** Build a vertical MC or IC line: array containing one two-point segment. */
export function buildVerticalLine(lon: number): LineSegments {
  return [[[-85, lon], [85, lon]]];
}

/** Build curved ASC or DSC line segments across all latitudes. */
function buildCurvedLine(
  ra: number,
  dec: number,
  gst: number,
  lonFn: (ra: number, dec: number, lat: number, gst: number) => number | null
): LineSegments {
  const segs: LineSegments = [];
  let seg: LatLng[] = [];
  let prevLon: number | null = null;

  for (let lat = 85; lat >= -85; lat -= 0.5) {
    const lon = lonFn(ra, dec, lat, gst);
    if (lon === null) {
      if (seg.length > 1) segs.push(seg);
      seg = [];
      prevLon = null;
      continue;
    }
    if (prevLon !== null && Math.abs(lon - prevLon) > 80) {
      if (seg.length > 1) segs.push(seg);
      seg = [];
      prevLon = null;
    }
    seg.push([lat, lon]);
    prevLon = lon;
  }
  if (seg.length > 1) segs.push(seg);
  return segs;
}

export type LineType = 'MC' | 'IC' | 'ASC' | 'DSC';

/** Get all line segments for a planet and line type */
export function getLineSegments(planet: PlanetData, lineType: LineType, gst: number): LineSegments {
  const { ra, dec } = planet;
  switch (lineType) {
    case 'MC':  return buildVerticalLine(mcLon(ra, gst));
    case 'IC':  return buildVerticalLine(icLon(ra, gst));
    case 'ASC': return buildCurvedLine(ra, dec, gst, ascLon);
    case 'DSC': return buildCurvedLine(ra, dec, gst, dscLon);
  }
}
