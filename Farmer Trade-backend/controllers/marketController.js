import { getPrice, getDistrictPrices, getAvailableDistricts, getDistrictCommodities } from "../services/marketPriceService.js";
import { calculateNetRealization } from "../services/netRealizationEngine.js";

// @desc    Get market prices for a district and commodity
// @route   GET /api/market/prices
const getMarketPrices = async (req, res) => {
  try {
    const { district, commodity } = req.query;

    // If no district specified, return all available districts
    if (!district) {
      return res.status(200).json({
        success: true,
        message: "Provide ?district=Nashik&commodity=Onion for specific prices",
        availableDistricts: getAvailableDistricts(),
      });
    }

    // If district but no commodity, return all prices for that district
    if (!commodity) {
      const prices = getDistrictPrices(district);
      if (!prices) {
        return res.status(404).json({
          message: `No prices found for district: ${district}`,
          availableDistricts: getAvailableDistricts(),
        });
      }

      return res.status(200).json({
        success: true,
        district,
        commodities: getDistrictCommodities(district),
        prices,
      });
    }

    // Get specific price
    const price = getPrice(district, commodity);
    if (!price) {
      return res.status(404).json({
        message: `No price found for ${commodity} in ${district}`,
        availableDistricts: getAvailableDistricts(),
      });
    }

    res.status(200).json({
      success: true,
      price,
    });
  } catch (error) {
    console.error("Get market prices error:", error);
    res.status(500).json({ message: "Failed to fetch market prices" });
  }
};

// @desc    Calculate net realization comparison for a quantity
// @route   GET /api/market/net-realization
const getNetRealization = async (req, res) => {
  try {
    const { district, commodity, quantity } = req.query;

    if (!district || !commodity || !quantity) {
      return res.status(400).json({
        message: "district, commodity, and quantity are required",
        example: "/api/market/net-realization?district=Nashik&commodity=Onion&quantity=20",
      });
    }

    const quantityQuintals = parseFloat(quantity);
    if (isNaN(quantityQuintals) || quantityQuintals <= 0) {
      return res.status(400).json({ message: "quantity must be a positive number" });
    }

    // Get market price for the district
    const marketPrice = getPrice(district, commodity);

    // Calculate net realization with custom mandi price if available
    const customPrices = marketPrice
      ? { mandi: marketPrice.price }
      : null;

    const result = calculateNetRealization(quantityQuintals, customPrices);

    res.status(200).json({
      success: true,
      district,
      commodity,
      ...result,
    });
  } catch (error) {
    console.error("Get net realization error:", error);
    res.status(500).json({ message: "Failed to calculate net realization" });
  }
};

export { getMarketPrices, getNetRealization };
