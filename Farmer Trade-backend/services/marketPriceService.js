

// Mock data for market prices in different districts and commodities

const mockMarketPrices = {
  Nashik: {
    Onion: { price: 1600, unit: "per quintal", market: "Nashik APMC", trend: "stable" },
    Tomato: { price: 1200, unit: "per quintal", market: "Nashik APMC", trend: "up" },
    Grapes: { price: 4500, unit: "per quintal", market: "Nashik APMC", trend: "down" },
    Pomegranate: { price: 5200, unit: "per quintal", market: "Nashik APMC", trend: "stable" },
    Soybean: { price: 3800, unit: "per quintal", market: "Nashik APMC", trend: "up" },
    Cotton: { price: 6200, unit: "per quintal", market: "Nashik APMC", trend: "stable" },
  },
  Pune: {
    Onion: { price: 1550, unit: "per quintal", market: "Pune APMC", trend: "down" },
    Tomato: { price: 1100, unit: "per quintal", market: "Pune APMC", trend: "stable" },
    Grapes: { price: 4200, unit: "per quintal", market: "Pune APMC", trend: "up" },
    Pomegranate: { price: 5000, unit: "per quintal", market: "Pune APMC", trend: "stable" },
    Soybean: { price: 3700, unit: "per quintal", market: "Pune APMC", trend: "down" },
    Cotton: { price: 6000, unit: "per quintal", market: "Pune APMC", trend: "up" },
  },
  Mumbai: {
    Onion: { price: 1700, unit: "per quintal", market: "Mumbai APMC", trend: "up" },
    Tomato: { price: 1300, unit: "per quintal", market: "Mumbai APMC", trend: "stable" },
    Grapes: { price: 4800, unit: "per quintal", market: "Mumbai APMC", trend: "down" },
    Pomegranate: { price: 5500, unit: "per quintal", market: "Mumbai APMC", trend: "up" },
    Soybean: { price: 3900, unit: "per quintal", market: "Mumbai APMC", trend: "stable" },
    Cotton: { price: 6400, unit: "per quintal", market: "Mumbai APMC", trend: "up" },
  },
  Jalna: {
    Onion: { price: 1500, unit: "per quintal", market: "Jalna APMC", trend: "down" },
    Soybean: { price: 3600, unit: "per quintal", market: "Jalna APMC", trend: "stable" },
    Cotton: { price: 5900, unit: "per quintal", market: "Jalna APMC", trend: "down" },
  },
  Ahmednagar: {
    Onion: { price: 1580, unit: "per quintal", market: "Ahmednagar APMC", trend: "stable" },
    Grapes: { price: 4300, unit: "per quintal", market: "Ahmednagar APMC", trend: "up" },
    Soybean: { price: 3750, unit: "per quintal", market: "Ahmednagar APMC", trend: "stable" },
  },
};

// Get price for a specific district + commodity
const getPrice = (district, commodity) => {
  const districtKey = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  const commodityKey = commodity.charAt(0).toUpperCase() + commodity.slice(1).toLowerCase();

  if (mockMarketPrices[districtKey] && mockMarketPrices[districtKey][commodityKey]) {
    return {
      district: districtKey,
      commodity: commodityKey,
      ...mockMarketPrices[districtKey][commodityKey],
    };
  }

  return null;
};

// Get all prices for a district
const getDistrictPrices = (district) => {
  const districtKey = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  return mockMarketPrices[districtKey] || null;
};

// Get all available districts
const getAvailableDistricts = () => {
  return Object.keys(mockMarketPrices);
};

// Get all commodities available in a district
const getDistrictCommodities = (district) => {
  const districtKey = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
  if (mockMarketPrices[districtKey]) {
    return Object.keys(mockMarketPrices[districtKey]);
  }
  return [];
};

export { getPrice, getDistrictPrices, getAvailableDistricts, getDistrictCommodities };
