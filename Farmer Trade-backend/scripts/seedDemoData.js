/**
 * Seed Demo Data Script
 * 
 * Run with: node scripts/seedDemoData.js
 * 
 * Inserts sample farmers, FPOs, buyers, and lots into Turso
 * for the hackathon demo scenario (20 quintals Grade-A Onion in Nashik)
 */

import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const seed = async () => {
  console.log("🌱 Seeding Farmer Trade demo data...\n");

  try {
    // ==================== USERS ====================

    // Farmers
    const farmers = [
      { id: uuidv4(), name: "Ramesh Patil", phone: "9876543210", role: "FARMER", district: "Nashik" },
      { id: uuidv4(), name: "Suresh Jadhav", phone: "9876543211", role: "FARMER", district: "Nashik" },
      { id: uuidv4(), name: "Mahesh Deshmukh", phone: "9876543212", role: "FARMER", district: "Nashik" },
      { id: uuidv4(), name: "Prakash More", phone: "9876543213", role: "FARMER", district: "Pune" },
      { id: uuidv4(), name: "Anil Shinde", phone: "9876543214", role: "FARMER", district: "Ahmednagar" },
    ];

    // FPOs
    const fpos = [
      { id: uuidv4(), name: "Nashik Krishi Producer Co Ltd", phone: "9800000001", role: "FPO", district: "Nashik" },
      { id: uuidv4(), name: "Pune Farm Collective", phone: "9800000002", role: "FPO", district: "Pune" },
    ];

    // Buyers
    const buyers = [
      { id: uuidv4(), name: "Mumbai Fresh Traders", phone: "9900000001", role: "BUYER", district: "Mumbai" },
      { id: uuidv4(), name: "Delhi Wholesale Market", phone: "9900000002", role: "BUYER", district: "Delhi" },
      { id: uuidv4(), name: "Pune Local Mandi", phone: "9900000003", role: "BUYER", district: "Pune" },
    ];

    // Transporters
    const transporters = [
      { id: uuidv4(), name: "Raj Transport Services", phone: "9700000001", role: "TRANSPORTER", district: "Nashik" },
    ];

    const allUsers = [...farmers, ...fpos, ...buyers, ...transporters];

    // Insert users
    for (const user of allUsers) {
      await turso.execute({
        sql: "INSERT OR IGNORE INTO users (id, name, phone, role, district) VALUES (?, ?, ?, ?, ?)",
        args: [user.id, user.name, user.phone, user.role, user.district],
      });
    }
    console.log(`✅ Inserted ${allUsers.length} users (${farmers.length} farmers, ${fpos.length} FPOs, ${buyers.length} buyers, ${transporters.length} transporters)`);

    // ==================== FARMER LOTS ====================

    const farmerLots = [
      {
        id: uuidv4(),
        farmer_id: farmers[0].id,
        commodity: "Onion",
        variety: "Nashik Red",
        quantity_quintals: 20,
        quality_grade: "Grade-A",
        harvest_date: "2026-08-25",
        urgency_days: 3,
        expected_price: 1950,
        status: "LISTED",
      },
      {
        id: uuidv4(),
        farmer_id: farmers[1].id,
        commodity: "Onion",
        variety: "Nashik Red",
        quantity_quintals: 15,
        quality_grade: "Grade-A",
        harvest_date: "2026-08-24",
        urgency_days: 2,
        expected_price: 1900,
        status: "LISTED",
      },
      {
        id: uuidv4(),
        farmer_id: farmers[2].id,
        commodity: "Onion",
        variety: "Nashik Red",
        quantity_quintals: 25,
        quality_grade: "Grade-B",
        harvest_date: "2026-08-23",
        urgency_days: 5,
        expected_price: 1700,
        status: "LISTED",
      },
      {
        id: uuidv4(),
        farmer_id: farmers[3].id,
        commodity: "Tomato",
        variety: "Pune Local",
        quantity_quintals: 10,
        quality_grade: "Grade-A",
        harvest_date: "2026-08-25",
        urgency_days: 1,
        expected_price: 1200,
        status: "LISTED",
      },
      {
        id: uuidv4(),
        farmer_id: farmers[4].id,
        commodity: "Soybean",
        variety: "JS-335",
        quantity_quintals: 30,
        quality_grade: "Grade-A",
        harvest_date: "2026-08-20",
        urgency_days: 7,
        expected_price: 3800,
        status: "LISTED",
      },
    ];

    for (const lot of farmerLots) {
      await turso.execute({
        sql: `INSERT OR IGNORE INTO farmer_lots 
              (id, farmer_id, commodity, variety, quantity_quintals, quality_grade, harvest_date, urgency_days, expected_price, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [lot.id, lot.farmer_id, lot.commodity, lot.variety, lot.quantity_quintals, lot.quality_grade, lot.harvest_date, lot.urgency_days, lot.expected_price, lot.status],
      });
    }
    console.log(`✅ Inserted ${farmerLots.length} farmer lots`);

    // ==================== FPO BULK LOT (Demo: 60 quintals aggregated) ====================

    const bulkLotId = uuidv4();
    await turso.execute({
      sql: `INSERT OR IGNORE INTO fpo_bulk_lots 
            (id, fpo_id, commodity, variety, total_quantity, quality_grade, reserve_price, pickup_location, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        bulkLotId,
        fpos[0].id,
        "Onion",
        "Nashik Red",
        60,
        "Grade-A",
        1800,
        "Nashik APMC Warehouse, Gate 3",
        "OPEN_FOR_BIDS",
      ],
    });

    // Map farmer lots to bulk lot
    const onionLots = farmerLots.filter((l) => l.commodity === "Onion");
    for (const lot of onionLots) {
      await turso.execute({
        sql: "INSERT OR IGNORE INTO fpo_lot_mappings (bulk_lot_id, farmer_lot_id) VALUES (?, ?)",
        args: [bulkLotId, lot.id],
      });
      await turso.execute({
        sql: "UPDATE farmer_lots SET status = 'AGGREGATED' WHERE id = ?",
        args: [lot.id],
      });
    }

    console.log(`✅ Created FPO bulk lot: ${bulkLotId.slice(0, 8)}... (60 quintals, OPEN_FOR_BIDS)`);
    console.log(`   Mapped ${onionLots.length} farmer lots to bulk lot`);

    // ==================== SUMMARY ====================

    console.log("\n📊 Demo Data Summary:");
    console.log("====================");
    console.log(`Farmers: ${farmers.length} (Nashik: 3, Pune: 1, Ahmednagar: 1)`);
    console.log(`FPOs: ${fpos.length}`);
    console.log(`Buyers: ${buyers.length}`);
    console.log(`Farmer Lots: ${farmerLots.length}`);
    console.log(`Bulk Lot: 1 (60 quintals Onion, OPEN_FOR_BIDS)`);
    console.log("\n🎯 Demo Scenario:");
    console.log("   20 quintals Grade-A Nashik Red Onion");
    console.log("   Mandi price: ₹1,600/qtl → Net ₹1,580/qtl");
    console.log("   Direct buyer: ₹1,950/qtl → Net ₹1,670/qtl");
    console.log("   FPO Bulk: ₹1,950/qtl → Net ₹1,820/qtl (WINNER)");
    console.log("   Additional income: ₹4,800 for 20 quintals");
    console.log("\n✅ Seed complete! Server can now use this data.");

  } catch (error) {
    console.error("❌ Seed error:", error);
  }
};

seed();
