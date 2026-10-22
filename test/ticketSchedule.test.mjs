import test from "node:test";
import assert from "node:assert/strict";
import {
  TICKET_SCHEDULE_CONFIG,
  getTicketPhaseInfo,
} from "../src/config/ticketSchedule.ts";

test("1. Before Early Bird ends: returns early_bird tier, ₹1,799, exact widget URL, and enabled CTA", () => {
  // 1 hour before Early Bird end time (2026-10-25 23:00:00 IST)
  const time = TICKET_SCHEDULE_CONFIG.earlyBird.endTimeMs - 3600000;
  const info = getTicketPhaseInfo(time);

  assert.equal(info.phase, "early_bird");
  assert.equal(info.ticketLabel, "EARLY BIRD");
  assert.equal(info.tierName, "EARLY BIRD PASS");
  assert.equal(info.price, 1799);
  assert.equal(info.formattedPrice, "₹1,799");
  assert.equal(info.ctaLabel, "BOOK EARLY BIRD");
  assert.equal(info.ctaFullLabel, "BOOK EARLY BIRD · ₹1,799");
  assert.equal(
    info.widgetUrl,
    "https://konfhub.com/widget/id/f48412d2-b3ce-45e8-a64a-6d3a9df7b257?ticketId=124554%7C1"
  );
  assert.equal(info.isBookingEnabled, true);
  assert.equal(info.isClosed, false);
  assert.equal(info.isTransitioning, false);

  // Dual tier state verification: Early Bird is OPEN, Regular Bird is LOCKED
  assert.equal(info.earlyBirdState.isOpen, true);
  assert.equal(info.earlyBirdState.isClosed, false);
  assert.equal(info.earlyBirdState.ctaText, "BOOK EARLY BIRD");
  assert.equal(info.regularBirdState.isOpen, false);
  assert.equal(info.regularBirdState.isLocked, true);
  assert.match(info.regularBirdState.ctaText, /LOCKED/i);
});

test("2. The 1-minute transition gap (26 Oct 12:00 AM to 12:01 AM IST): disables CTA and hides widget", () => {
  // Exactly at 26 Oct 12:00:30 AM IST (middle of transition gap)
  const time = TICKET_SCHEDULE_CONFIG.transitioning.startTimeMs + 30000;
  const info = getTicketPhaseInfo(time);

  assert.equal(info.phase, "transitioning");
  assert.equal(info.ticketLabel, "PRICES UPDATING");
  assert.equal(info.price, null);
  assert.equal(info.widgetUrl, null);
  assert.equal(info.isBookingEnabled, false);
  assert.equal(info.isClosed, false);
  assert.equal(info.isTransitioning, true);
  assert.match(info.statusMessage || "", /updating/i);

  // Dual tier state: Early Bird is CLOSED, Regular Bird is updating/locked
  assert.equal(info.earlyBirdState.isOpen, false);
  assert.equal(info.earlyBirdState.isClosed, true);
  assert.equal(info.regularBirdState.isOpen, false);
  assert.equal(info.regularBirdState.isTransitioning, true);
});

test("3. From Regular Bird start (26 Oct 12:01 AM IST): returns regular_bird tier, ₹2,199, exact widget URL, and enabled CTA", () => {
  // 1 hour after Regular Bird starts (2026-10-26 01:01:00 IST)
  const time = TICKET_SCHEDULE_CONFIG.regularBird.startTimeMs + 3600000;
  const info = getTicketPhaseInfo(time);

  assert.equal(info.phase, "regular_bird");
  assert.equal(info.ticketLabel, "REGULAR BIRD");
  assert.equal(info.tierName, "REGULAR BIRD PASS");
  assert.equal(info.price, 2199);
  assert.equal(info.formattedPrice, "₹2,199");
  assert.equal(info.ctaLabel, "BOOK REGULAR BIRD");
  assert.equal(info.ctaFullLabel, "BOOK REGULAR BIRD · ₹2,199");
  assert.equal(
    info.widgetUrl,
    "https://konfhub.com/widget/id/285d672d-5ed6-4787-8c21-ea099ad00b79?ticketId=124982%7C1"
  );
  assert.equal(info.isBookingEnabled, true);
  assert.equal(info.isClosed, false);
  assert.equal(info.isTransitioning, false);

  // Dual tier state: Early Bird is CLOSED, Regular Bird is OPEN
  assert.equal(info.earlyBirdState.isOpen, false);
  assert.equal(info.earlyBirdState.isClosed, true);
  assert.equal(info.earlyBirdState.ctaText, "EARLY BIRD ENDED");
  assert.equal(info.regularBirdState.isOpen, true);
  assert.equal(info.regularBirdState.isLocked, false);
  assert.equal(info.regularBirdState.ctaText, "BOOK REGULAR BIRD");
});

test("4. After Regular Bird sales end (31 Oct 2:00 PM IST): disables CTA, returns closed status, hides widget", () => {
  // 1 minute after sales end (2026-10-31 14:01:00 IST)
  const time = TICKET_SCHEDULE_CONFIG.regularBird.endTimeMs + 60000;
  const info = getTicketPhaseInfo(time);

  assert.equal(info.phase, "sales_closed");
  assert.equal(info.ticketLabel, "TICKET SALES CLOSED");
  assert.equal(info.ctaLabel, "TICKET SALES CLOSED");
  assert.equal(info.widgetUrl, null);
  assert.equal(info.isBookingEnabled, false);
  assert.equal(info.isClosed, true);
  assert.equal(info.isTransitioning, false);
  assert.match(info.statusMessage || "", /closed/i);

  // Dual tier state: Both tiers CLOSED
  assert.equal(info.earlyBirdState.isOpen, false);
  assert.equal(info.earlyBirdState.isClosed, true);
  assert.equal(info.regularBirdState.isOpen, false);
  assert.equal(info.regularBirdState.isClosed, true);
});
