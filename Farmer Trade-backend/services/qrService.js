/**
 * QR Code Service
 * 
 * Generates QR codes for bulk lots to verify authenticity during pickup/delivery.
 * QR contains: bulkLotId, fpoId, commodity, quantity, timestamp
 */

import QRCode from "qrcode";
import tursoClient from "../config/turso.js";

/**
 * Generate QR code data for a bulk lot
 * @param {string} bulkLotId - The bulk lot ID
 * @returns {object} QR code data URL and metadata
 */
const generateQRForLot = async (bulkLotId) => {
  // Fetch lot details from Turso
  const result = await tursoClient.execute({
    sql: "SELECT * FROM fpo_bulk_lots WHERE id = ?",
    args: [bulkLotId],
  });

  if (result.rows.length === 0) {
    throw new Error("Bulk lot not found");
  }

  const lot = result.rows[0];

  // Create QR payload
  const qrPayload = {
    type: "FARMER_TRADE_LOT",
    bulkLotId: lot.id,
    fpoId: lot.fpo_id,
    commodity: lot.commodity,
    variety: lot.variety,
    totalQuantity: lot.total_quantity,
    qualityGrade: lot.quality_grade,
    status: lot.status,
    generatedAt: new Date().toISOString(),
  };

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  // Update the lot with QR data
  await tursoClient.execute({
    sql: "UPDATE fpo_bulk_lots SET qr_code_data = ? WHERE id = ?",
    args: [JSON.stringify(qrPayload), bulkLotId],
  });

  return {
    bulkLotId: lot.id,
    commodity: lot.commodity,
    totalQuantity: lot.total_quantity,
    qrDataUrl,
    qrPayload,
  };
};

/**
 * Verify QR code data
 * @param {string} bulkLotId - The bulk lot ID to verify
 * @returns {object} Verification result with lot details
 */
const verifyQR = async (bulkLotId) => {
  // Fetch lot from Turso
  const result = await tursoClient.execute({
    sql: "SELECT * FROM fpo_bulk_lots WHERE id = ?",
    args: [bulkLotId],
  });

  if (result.rows.length === 0) {
    return {
      valid: false,
      message: "Lot not found in system",
    };
  }

  const lot = result.rows[0];

  // Check if QR data exists
  if (!lot.qr_code_data) {
    return {
      valid: false,
      message: "QR code not generated for this lot",
      lotId: bulkLotId,
    };
  }

  // Parse stored QR data
  let storedQR;
  try {
    storedQR = JSON.parse(lot.qr_code_data);
  } catch {
    return {
      valid: false,
      message: "Invalid QR data in database",
    };
  }

  // Verify QR type
  if (storedQR.type !== "FARMER_TRADE_LOT") {
    return {
      valid: false,
      message: "Invalid QR code type - not a Farmer Trade lot QR",
    };
  }

  // Verify lot ID matches
  if (storedQR.bulkLotId !== bulkLotId) {
    return {
      valid: false,
      message: "QR code does not match lot ID",
    };
  }

  return {
    valid: true,
    message: "QR code verified successfully",
    lotDetails: {
      id: lot.id,
      commodity: lot.commodity,
      variety: lot.variety,
      totalQuantity: lot.total_quantity,
      qualityGrade: lot.quality_grade,
      status: lot.status,
      fpoId: lot.fpo_id,
    },
    qrGeneratedAt: storedQR.generatedAt,
    verifiedAt: new Date().toISOString(),
  };
};

export { generateQRForLot, verifyQR };
