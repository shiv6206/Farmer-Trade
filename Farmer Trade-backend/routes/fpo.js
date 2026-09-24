import { Router } from "express";
import { getAvailableLots, aggregateLots, getBulkLots } from "../controllers/fpoController.js";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";

const router = Router();

// Public route - any authenticated user can view available lots
router.get("/available-lots", auth, getAvailableLots);

// FPO-only routes
router.post("/aggregate", auth, roleCheck("FPO"), aggregateLots);
router.get("/bulk-lots", auth, roleCheck("FPO"), getBulkLots);

export default router;
