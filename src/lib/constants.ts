import type { LineType } from './astronomy';

export const PLANET_NAMES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
] as const;

export type PlanetName = typeof PLANET_NAMES[number];

export const COLORS: Record<PlanetName, string> = {
  Sun:     '#FFD700',
  Moon:    '#d0d0d0',
  Mercury: '#87CEEB',
  Venus:   '#FF69B4',
  Mars:    '#FF4500',
  Jupiter: '#FFA500',
  Saturn:  '#DAA520',
  Uranus:  '#40E0D0',
  Neptune: '#6688FF',
  Pluto:   '#DA70D6',
};

export const SYMBOLS: Record<PlanetName, string> = {
  Sun:     '☉',
  Moon:    '☽',
  Mercury: '☿',
  Venus:   '♀',
  Mars:    '♂',
  Jupiter: '♃',
  Saturn:  '♄',
  Uranus:  '♅',
  Neptune: '♆',
  Pluto:   '♇',
};

export const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export function zodiacSign(lon: number): string {
  const sign = ZODIAC_SIGNS[Math.floor(lon / 30)];
  const degrees = (lon % 30).toFixed(1);
  return `${sign} ${degrees}°`;
}

export const LINE_TYPES: LineType[] = ['MC', 'IC', 'ASC', 'DSC'];

/** Dash array for polyline styling (null = solid) */
export const LINE_DASH: Record<LineType, string | undefined> = {
  MC:  undefined,
  IC:  '10 7',
  ASC: undefined,
  DSC: '6 4',
};

export const MEANINGS: Record<LineType, Record<PlanetName, string>> = {
  MC: {
    Sun:     'Career and public life radiate here — recognition and leadership come naturally.',
    Moon:    'Public nurturing roles and emotional community ties define your calling.',
    Mercury: 'Communication, writing, and teaching — your voice carries great influence.',
    Venus:   'Creative success, beauty, and social influence shape your reputation.',
    Mars:    'Ambition amplified — bold career moves and competitive drive pay off.',
    Jupiter: 'Expansion and professional luck flow here — opportunities find you.',
    Saturn:  'Discipline and long-term achievement — serious authority is earned.',
    Uranus:  'Innovation and disruption lead to unexpected notoriety.',
    Neptune: 'Artistic vocation and spiritual public calling draw admirers.',
    Pluto:   'Transformative power and lasting legacy define your place in history.',
  },
  IC: {
    Sun:     'Home and inner identity are deeply rooted here — a place of belonging.',
    Moon:    'Ancestral roots, emotional safety, and family bonds are strongest here.',
    Mercury: 'A stimulating home environment where ideas and conversations flourish.',
    Venus:   'Beautiful, harmonious domestic life and an aesthetically rich home.',
    Mars:    'Active, passionate home and family life full of energy and drive.',
    Jupiter: 'Expansive, fortunate home and generous family ties surround you.',
    Saturn:  'Structured, serious approach to home and heritage — deep responsibilities.',
    Uranus:  'Unconventional home life — freedom and originality in your private world.',
    Neptune: 'Dreamy, spiritual, or creative home environment full of imagination.',
    Pluto:   'Deep family transformation and powerful ancestral roots shape you.',
  },
  ASC: {
    Sun:     'Radiant vitality — you shine and attract attention effortlessly.',
    Moon:    'Emotional sensitivity and intuition are heightened in daily life.',
    Mercury: 'Sharp wit and youthful energy — effortless, charming communication.',
    Venus:   'Magnetic beauty and grace — others find you naturally irresistible.',
    Mars:    'Bold, energetic presence — you lead and inspire those around you.',
    Jupiter: 'Optimism and generosity radiate — expansion naturally follows you.',
    Saturn:  'Serious, disciplined presence — others respect your depth and gravity.',
    Uranus:  'Electric, eccentric aura — you stand out as brilliantly original.',
    Neptune: 'Mystical, dreamy impression — spiritual magnetism draws seekers.',
    Pluto:   'Intense, magnetic — your presence transforms everyone you meet.',
  },
  DSC: {
    Sun:     'Power partnerships — you shine brightest with a strong, vital partner.',
    Moon:    'Emotionally nurturing, deeply intuitive and caring relationships.',
    Mercury: 'Intellectual bonds and witty, mentally stimulating connections.',
    Venus:   'Romantic, harmonious — beautiful love and artful partnerships.',
    Mars:    'Passionate, dynamic, and excitingly charged relationships.',
    Jupiter: 'Lucky, growth-oriented partnerships — mutual expansion and generosity.',
    Saturn:  'Serious, committed long-term bonds; karmic ties that endure.',
    Uranus:  'Exciting, unconventional — liberating and awakening relationships.',
    Neptune: 'Soulmate connections and deeply spiritual, transcendent bonds.',
    Pluto:   'Intense, fated, powerfully transformative relationships.',
  },
};

// Birth data (hardcoded)
export const BIRTH = {
  year:  1989,
  month: 7,
  day:   1,
  hour:  21.5,  // 21:30 GMT
  lat:   45.4654,
  lng:   9.1859,
  label: 'July 1, 1989 · 9:30 PM GMT · Milan, Italy',
} as const;
