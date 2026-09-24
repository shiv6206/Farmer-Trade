/**
 * Net Realization Engine
 * 
 * Calculates the net return for a farmer under 3 sale scenarios:
 * 1. Nearby Mandi (APMC)
 * 2. Individual Direct Buyer
 * 3. Farmer Trade FPO Aggregated Bulk Sale
 *Mock data is used for gross prices and deductions, but in production, these would be fetched from market APIs.
 * - Mandi: ₹1,600/qtl gross, ₹20/qtl deductions = ₹1,580/qtl net
 * - Direct Buyer: ₹1,950/qtl gross, ₹280/qtl deductions = ₹1,670/qtl net
 * - FPO Bulk: ₹1,950/qtl gross, ₹130/qtl deductions = ₹1,820/qtl net
 */

// Deduction breakdown per scenario
const SCENARIOS = {
  mandi: {
    name: "Nearby Mandi (APMC)",
    grossPricePerQtl: 1600,
    deductions: {
      commission_agent: 10,    // Arhatiya commission
      market_fee: 3,           // APMC market fee
      transport: 5,            // Short distance local transport
      weighing: 2,             // Weighing charges
    },
  },
  directBuyer: {
    name: "Individual Direct Buyer",
    grossPricePerQtl: 1950,
    deductions: {
      transport: 200,          // Individual buyer transport (high)
      handling: 50,            // Manual handling
      commission: 30,          // Middleman cut
    },
  },
  fpoBulk: {
    name: "Farmer Trade FPO Aggregated Bulk Sale",
    grossPricePerQtl: 1950,
    deductions: {
      shared_transport: 80,    // Bulk shared transport (much lower per qtl)
      handling: 30,            // FPO handling charges
      fpo_commission: 20,      // FPO service fee
    },
  },
};

/**
 * Calculate net realization for all 3 scenarios
 * @param {number} quantityQuintals - Total quantity in quintals
 * @param {object} customPrices - Optional custom gross prices { mandi, directBuyer, fpoBulk }
 * @returns {object} Comparison of all 3 scenarios with rankings
 */
const calculateNetRealization = (quantityQuintals, customPrices = null) => {
  const results = [];

  for (const [key, scenario] of Object.entries(SCENARIOS)) {
    // Allow overriding gross price (e.g., from market API)
    const grossPrice = customPrices?.[key] || scenario.grossPricePerQtl;

    // Calculate total deductions
    const totalDeductionsPerQtl = Object.values(scenario.deductions).reduce(
      (sum, val) => sum + val,
      0
    );

    const netPricePerQtl = grossPrice - totalDeductionsPerQtl;
    const grossTotal = grossPrice * quantityQuintals;
    const deductionsTotal = totalDeductionsPerQtl * quantityQuintals;
    const netTotal = netPricePerQtl * quantityQuintals;

    results.push({
      scenario: key,
      name: scenario.name,
      grossPricePerQtl: grossPrice,
      deductionsBreakdown: scenario.deductions,
      totalDeductionsPerQtl,
      netPricePerQtl,
      quantityQuintals,
      grossTotal,
      deductionsTotal,
      netTotal,
    });
  }

  // Sort by net price (highest first)
  results.sort((a, b) => b.netPricePerQtl - a.netPricePerQtl);

  // Add rank and recommendation
  results.forEach((r, index) => {
    r.rank = index + 1;
    r.isRecommended = index === 0;
  });

  // Calculate advantage over mandi
  const mandiNet = results.find((r) => r.scenario === "mandi")?.netPricePerQtl || 0;
  results.forEach((r) => {
    r.advantageOverMandi = r.netPricePerQtl - mandiNet;
    r.advantagePerTotal = r.advantageOverMandi * quantityQuintals;
  });

  // Generate explainability text
  const recommended = results[0];
  const explainability = generateExplainability(results, quantityQuintals);

  return {
    quantityQuintals,
    recommended: recommended.name,
    scenarios: results,
    explainability,
    summary: {
      bestNetReturn: recommended.netTotal,
      mandiNetReturn: results.find((r) => r.scenario === "mandi")?.netTotal,
      additionalIncome: recommended.advantagePerTotal,
      advantagePerQuintal: recommended.advantageOverMandi,
    },
  };
};

/**
 * Generate human-readable explainability text
 */
const generateExplainability = (results, quantity) => {
  const mandi = results.find((r) => r.scenario === "mandi");
  const fpo = results.find((r) => r.scenario === "fpoBulk");
  const direct = results.find((r) => r.scenario === "directBuyer");

  const advantage = fpo.netPricePerQtl - mandi.netPricePerQtl;
  const totalExtra = advantage * quantity;

  return {
    summary: `Selling ${quantity} quintals through Farmer Trade FPO aggregation gives you ₹${advantage} more per quintal compared to the nearest mandi.`,
    mandi: `At the nearby mandi, you would receive ₹${mandi.netPricePerQtl}/quintal after deductions (₹${mandi.totalDeductionsPerQtl}/qtl). Total: ₹${mandi.netTotal.toLocaleString()}.`,
    direct: `A direct buyer offers ₹${direct.netPricePerQtl}/quintal after transport and handling costs (₹${direct.totalDeductionsPerQtl}/qtl). Total: ₹${direct.netTotal.toLocaleString()}.`,
    fpo: `Through Farmer Trade FPO bulk sale, you get ₹${fpo.netPricePerQtl}/quintal with shared transport savings (₹${fpo.totalDeductionsPerQtl}/qtl deductions). Total: ₹${fpo.netTotal.toLocaleString()}.`,
    advantage: `By choosing Farmer Trade, you earn an additional ₹${totalExtra.toLocaleString()} on this lot (${quantity} quintals × ₹${advantage}/quintal).`,
  };
};

export { calculateNetRealization, SCENARIOS };
