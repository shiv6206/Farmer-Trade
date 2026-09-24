/**
 * Multi-Criteria Recommendation / Sale Score Engine
 * 
 * Scores each sale option based on multiple weighted criteria:
 * 1. Net Price (40% weight) — Higher is better
 * 2. Payment Speed (20% weight) — Faster is better
 * 3. Buyer Trust (20% weight) — Higher trust score is better
 * 4. Distance/Convenience (10% weight) — Closer is better
 * 5. Urgency Match (10% weight) — Better match with urgency is better
 */

const WEIGHTS = {
  netPrice: 0.40,
  paymentSpeed: 0.20,
  buyerTrust: 0.20,
  distance: 0.10,
  urgencyMatch: 0.10,
};

/**
 * Score a single sale option
 */
const scoreOption = (option) => {
  const scores = {};

  // 1. Net Price Score (0-100)
  // Normalize against a max expected price (e.g., ₹2000/qtl)
  const maxPrice = 2000;
  scores.netPrice = Math.min((option.netPricePerQtl / maxPrice) * 100, 100);

  // 2. Payment Speed Score (0-100)
  // paymentDays: 1 = instant, 7 = slow
  scores.paymentSpeed = Math.max(100 - (option.paymentDays || 3) * 14, 0);

  // 3. Buyer Trust Score (0-100)
  // trustScore: 0-100
  scores.buyerTrust = option.trustScore || 80;

  // 4. Distance Score (0-100)
  // distanceKm: closer is better, max 500km
  const maxDistance = 500;
  scores.distance = Math.max(100 - ((option.distanceKm || 50) / maxDistance) * 100, 0);

  // 5. Urgency Match Score (0-100)
  // If farmer urgency is high (few days) and buyer can pay fast, score is higher
  const urgencyDays = option.farmerUrgencyDays || 3;
  const deliveryDays = option.estimatedDeliveryDays || 2;
  scores.urgencyMatch = deliveryDays <= urgencyDays
    ? 100
    : Math.max(100 - (deliveryDays - urgencyDays) * 20, 0);

  // Calculate weighted total
  const totalScore = Object.keys(WEIGHTS).reduce((sum, key) => {
    return sum + (scores[key] * WEIGHTS[key]);
  }, 0);

  return {
    scores,
    totalScore: Math.round(totalScore * 10) / 10,
  };
};

/**
 * Generate recommendations for a bulk lot
 * @param {object} bulkLot - The FPO bulk lot details
 * @param {array} buyerOffers - Array of buyer offers/bids
 * @returns {object} Ranked recommendations with explainability
 */
const generateRecommendations = (bulkLot, buyerOffers = []) => {
  const quantity = bulkLot.total_quantity || bulkLot.quantity_quintals;

  // Default offers if none provided (demo mode)
  const offers = buyerOffers.length > 0 ? buyerOffers : getDefaultOffers(bulkLot);

  // Score and rank each offer
  const scoredOffers = offers.map((offer) => {
    const { scores, totalScore } = scoreOption({
      netPricePerQtl: offer.netPricePerQtl || offer.pricePerQtl,
      paymentDays: offer.paymentDays || 3,
      trustScore: offer.buyerTrustScore || 75,
      distanceKm: offer.distanceKm || 50,
      estimatedDeliveryDays: offer.deliveryDays || 2,
      farmerUrgencyDays: bulkLot.urgency_days || 3,
    });

    const grossTotal = (offer.netPricePerQtl || offer.pricePerQtl) * quantity;
    const netTotal = grossTotal - (offer.totalDeductions || 0);

    return {
      ...offer,
      scores,
      totalScore,
      grossTotal,
      netTotal,
      perQuintalAdvantage: (offer.netPricePerQtl || offer.pricePerQtl) - 1580, // vs mandi baseline
    };
  });

  // Sort by score (highest first)
  scoredOffers.sort((a, b) => b.totalScore - a.totalScore);

  // Add rank
  scoredOffers.forEach((offer, index) => {
    offer.rank = index + 1;
    offer.isRecommended = index === 0;
  });

  const recommended = scoredOffers[0];

  return {
    bulkLotId: bulkLot.id,
    commodity: bulkLot.commodity,
    quantity,
    recommendedOffer: recommended,
    allOffers: scoredOffers,
    explainability: generateRecommendationText(scoredOffers, quantity),
    scoringCriteria: WEIGHTS,
  };
};

/**
 * Default demo offers when no real bids exist
 */
const getDefaultOffers = (bulkLot) => {
  const commodity = bulkLot.commodity || "Onion";

  return [
    {
      buyerName: "Mumbai Fresh Traders",
      buyerTrustScore: 92,
      pricePerQtl: 1950,
      netPricePerQtl: 1820,
      totalDeductions: 130 * (bulkLot.total_quantity || 20),
      paymentDays: 1,
      deliveryDays: 1,
      distanceKm: 180,
      paymentMethod: "UPI",
    },
    {
      buyerName: "Delhi Wholesale Market",
      buyerTrustScore: 85,
      pricePerQtl: 2000,
      netPricePerQtl: 1780,
      totalDeductions: 220 * (bulkLot.total_quantity || 20),
      paymentDays: 3,
      deliveryDays: 3,
      distanceKm: 400,
      paymentMethod: "NEFT",
    },
    {
      buyerName: "Pune Local Mandi",
      buyerTrustScore: 78,
      pricePerQtl: 1750,
      netPricePerQtl: 1650,
      totalDeductions: 100 * (bulkLot.total_quantity || 20),
      paymentDays: 2,
      deliveryDays: 1,
      distanceKm: 120,
      paymentMethod: "Cash",
    },
  ];
};

/**
 * Generate human-readable recommendation text
 */
const generateRecommendationText = (offers, quantity) => {
  const best = offers[0];
  const second = offers[1];

  return {
    summary: `Based on price, payment speed, buyer reliability, and distance, we recommend **${best.buyerName}** with a score of ${best.totalScore}/100.`,
    bestOption: `${best.buyerName}: ₹${best.netTotal.toLocaleString()} total (₹${best.netPricePerQtl}/qtl), payment in ${best.paymentDays} day(s), trust score ${best.buyerTrustScore}%.`,
    runnerUp: second
      ? `Runner-up: ${second.buyerName} with score ${second.totalScore}/100, offering ₹${second.netTotal.toLocaleString()} total.`
      : null,
    keyFactors: [
      `Net price advantage: ₹${best.perQuintalAdvantage}/quintal above mandi baseline`,
      `Payment settlement: ${best.paymentDays} day(s)`,
      `Buyer reliability: ${best.buyerTrustScore}% trust score`,
      `Estimated delivery: ${best.deliveryDays} day(s)`,
    ],
  };
};

export { generateRecommendations, scoreOption, WEIGHTS };
