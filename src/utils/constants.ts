export const COLORS = {
  primary: '#468499',
  background: '#26414A',
  accent: '#E58E26',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkGray: '#424242',
  black: '#000000',
  transparent: 'transparent',
  
  // Map colors
  mapDefault: '#2C3E50',
  mapHighlight: '#4CAF50',
  mapBorder: '#34495E',
  mapWater: '#3498DB',
};

export const FONTS = {
  headline: 'SpaceGrotesk-Regular',
  headlineBold: 'SpaceGrotesk-Bold',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Font sizes
  caption: 12,
  body: 16,
  subtitle: 18,
  title: 24,
  heading: 32,
  display: 48,
};

export const CONTINENTS: Record<string, { name: string; countries: string[] }> = {
  Europe: {
    name: 'Europe',
    countries: [
      'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 
      'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 
      'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 
      'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 
      'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 
      'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 
      'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 
      'Turkey', 'Ukraine', 'United Kingdom', 'Vatican City'
    ]
  },
  Asia: {
    name: 'Asia',
    countries: [
      'Afghanistan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia',
      'China', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan',
      'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon',
      'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea',
      'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia',
      'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan',
      'Thailand', 'Timor-Leste', 'Turkmenistan', 'United Arab Emirates',
      'Uzbekistan', 'Vietnam', 'Yemen'
    ]
  },
  Africa: {
    name: 'Africa',
    countries: [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
      'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros',
      'Democratic Republic of the Congo', 'Republic of the Congo', 'Djibouti',
      'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
      'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya',
      'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali',
      'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
      'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles',
      'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan',
      'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
    ]
  },
  'North America': {
    name: 'North America',
    countries: [
      'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada',
      'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador',
      'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico',
      'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia',
      'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'United States'
    ]
  },
  'South America': {
    name: 'South America',
    countries: [
      'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador',
      'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
    ]
  },
  Oceania: {
    name: 'Oceania',
    countries: [
      'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia',
      'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa',
      'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu'
    ]
  }
};

export const DEFAULT_TIMER_DURATIONS = {
  Europe: 900, // 15 minutes
  Asia: 1800, // 30 minutes
  Africa: 1500, // 25 minutes
  'North America': 600, // 10 minutes
  'South America': 480, // 8 minutes
  Oceania: 300, // 5 minutes
  'All World': 3600, // 60 minutes
};

export const IAP_PRODUCT_IDS = {
  ASIA: 'com.geoguesser.asia',
  AFRICA: 'com.geoguesser.africa',
  NORTH_AMERICA: 'com.geoguesser.north_america',
  SOUTH_AMERICA: 'com.geoguesser.south_america',
  OCEANIA: 'com.geoguesser.oceania',
  ALL_WORLD: 'com.geoguesser.all_world',
};

export const ACHIEVEMENT_IDS = {
  EUROPE_COMPLETE: 'europe_100_percent',
  ASIA_COMPLETE: 'asia_100_percent',
  AFRICA_COMPLETE: 'africa_100_percent',
  NORTH_AMERICA_COMPLETE: 'north_america_100_percent',
  SOUTH_AMERICA_COMPLETE: 'south_america_100_percent',
  OCEANIA_COMPLETE: 'oceania_100_percent',
  ALL_WORLD_COMPLETE: 'all_world_100_percent',
  SPEED_DEMON: 'all_world_under_10_min',
  PERFECTIONIST: 'perfect_game',
  GLOBE_TROTTER: 'all_continents_unlocked',
};
