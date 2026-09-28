import test from "node:test";
import assert from "node:assert/strict";
import { generateToken, verifyToken } from "../services/authService.js";
import { generateOTP } from "../services/otpService.js";

test("OTP is a six-digit numeric code", () => {
  assert.match(generateOTP(), /^\d{6}$/);
});

test("JWT signing and verification require a strong configured secret", () => {
  const previousSecret = process.env.JWT_SECRET;
  const previousEnvironment = process.env.NODE_ENV;
  process.env.JWT_SECRET = "a-test-secret-that-is-long-enough-for-signing";
  process.env.NODE_ENV = "production";

  try {
    const token = generateToken("user-1", "FARMER");
    assert.equal(verifyToken(token).id, "user-1");

    process.env.JWT_SECRET = "hackathon_secret_key";
    assert.throws(() => generateToken("user-1", "FARMER"), /JWT_SECRET/);
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
  }
});