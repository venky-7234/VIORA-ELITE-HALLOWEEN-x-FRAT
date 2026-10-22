import { useEffect, useState } from "react";

export type TicketPhase = "early_bird" | "transitioning" | "regular_bird" | "sales_closed";
export type TierStatus = "open" | "locked" | "transitioning" | "closed";

export interface IndividualTierState {
  id: "early_bird" | "regular_bird";
  name: string; // "Early Bird" | "Regular Bird"
  tierLabel: string; // "EARLY BIRD PASS" | "REGULAR BIRD PASS"
  price: number;
  formattedPrice: string; // "₹1,799" | "₹2,199"
  allocationText: string; // "50 tickets allocated"
  widgetUrl: string;
  status: TierStatus;
  isOpen: boolean;
  isLocked: boolean;
  isClosed: boolean;
  isTransitioning: boolean;
  ctaText: string;
  ctaFullText: string;
  badgeText: string;
  availabilityNote: string;
}

export interface TicketPhaseInfo {
  phase: TicketPhase;
  ticketLabel: string; // "EARLY BIRD", "REGULAR BIRD", "PRICES UPDATING", "TICKET SALES CLOSED"
  tierName: string; // "EARLY BIRD PASS", "REGULAR BIRD PASS"
  price: number | null;
  formattedPrice: string; // "₹1,799", "₹2,199", "Updating...", "Closed"
  ctaLabel: string; // "BOOK EARLY BIRD", "BOOK REGULAR BIRD", "PRICES UPDATING", "TICKET SALES CLOSED"
  ctaFullLabel: string; // "BOOK EARLY BIRD · ₹1,799", "BOOK REGULAR BIRD · ₹2,199"
  widgetUrl: string | null;
  isBookingEnabled: boolean;
  isClosed: boolean;
  isTransitioning: boolean;
  allocationText: string;
  statusMessage?: string;
  scheduleDescription: string;
  earlyBirdState: IndividualTierState;
  regularBirdState: IndividualTierState;
}

export const TICKET_SCHEDULE_CONFIG = {
  timeZone: "Asia/Kolkata",
  earlyBird: {
    price: 1799,
    formattedPrice: "₹1,799",
    allocation: 50,
    allocationText: "50 tickets allocated",
    widgetUrl: "https://konfhub.com/widget/id/f48412d2-b3ce-45e8-a64a-6d3a9df7b257",
    label: "EARLY BIRD",
    tierName: "EARLY BIRD PASS",
    ctaLabel: "BOOK EARLY BIRD",
    ctaFullLabel: "BOOK EARLY BIRD · ₹1,799",
    endTimeIso: "2026-10-26T00:00:00+05:30",
    endTimeMs: Date.parse("2026-10-26T00:00:00+05:30"),
  },
  transitioning: {
    label: "PRICES UPDATING",
    tierName: "TICKET TRANSITION",
    formattedPrice: "Updating...",
    ctaLabel: "PRICES UPDATING",
    ctaFullLabel: "PRICES UPDATING",
    message: "Ticket prices are updating — please check back shortly",
    startTimeIso: "2026-10-26T00:00:00+05:30",
    endTimeIso: "2026-10-26T00:01:00+05:30",
    startTimeMs: Date.parse("2026-10-26T00:00:00+05:30"),
    endTimeMs: Date.parse("2026-10-26T00:01:00+05:30"),
  },
  regularBird: {
    price: 2199,
    formattedPrice: "₹2,199",
    allocation: 50,
    allocationText: "50 tickets allocated",
    widgetUrl: "https://konfhub.com/widget/id/285d672d-5ed6-4787-8c21-ea099ad00b79",
    label: "REGULAR BIRD",
    tierName: "REGULAR BIRD PASS",
    ctaLabel: "BOOK REGULAR BIRD",
    ctaFullLabel: "BOOK REGULAR BIRD · ₹2,199",
    startTimeIso: "2026-10-26T00:01:00+05:30",
    endTimeIso: "2026-10-31T14:00:00+05:30",
    startTimeMs: Date.parse("2026-10-26T00:01:00+05:30"),
    endTimeMs: Date.parse("2026-10-31T14:00:00+05:30"),
  },
  closed: {
    label: "TICKET SALES CLOSED",
    tierName: "SALES CLOSED",
    formattedPrice: "Closed",
    ctaLabel: "TICKET SALES CLOSED",
    ctaFullLabel: "TICKET SALES CLOSED",
    message: "Ticket sales are now officially closed. No tickets will be sold at the gate.",
  },
} as const;

/**
 * Returns the current time in milliseconds, supporting an injectable simulated clock
 * via query parameters (`?testPhase=early_bird|transitioning|regular_bird|sales_closed` or `?simulatedTime=ISO_STRING`)
 * for automated or manual verification without altering system time.
 */
export function getSimulatedOrCurrentTime(): number {
  if (typeof window !== "undefined") {
    try {
      const params = new URLSearchParams(window.location.search);
      const testPhase = params.get("testPhase")?.toLowerCase();
      if (testPhase === "early_bird" || testPhase === "early") {
        return TICKET_SCHEDULE_CONFIG.earlyBird.endTimeMs - 60000; // 1 min before early bird ends
      }
      if (testPhase === "transitioning" || testPhase === "gap") {
        return TICKET_SCHEDULE_CONFIG.transitioning.startTimeMs + 30000; // 30s into the 1-min gap
      }
      if (testPhase === "regular_bird" || testPhase === "regular") {
        return TICKET_SCHEDULE_CONFIG.regularBird.startTimeMs + 60000; // 1 min into regular bird
      }
      if (testPhase === "closed" || testPhase === "sales_closed") {
        return TICKET_SCHEDULE_CONFIG.regularBird.endTimeMs + 60000; // 1 min after sales end
      }
      const simulatedTime = params.get("simulatedTime");
      if (simulatedTime) {
        const parsed = Date.parse(simulatedTime);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch {
      // In SSR or test runners without window.location
    }
  }
  return Date.now();
}

/**
 * Pure, timezone-safe evaluator deriving all ticket attributes strictly from UTC epoch timestamps.
 * Guarantees that price, ticket label, CTA text, and widget iframe URL cannot disagree.
 */
export function getTicketPhaseInfo(currentTimeMs: number = getSimulatedOrCurrentTime()): TicketPhaseInfo {
  const { earlyBird, transitioning, regularBird, closed } = TICKET_SCHEDULE_CONFIG;

  // 1. Evaluate Individual Early Bird State
  const isEarlyBirdOpen = currentTimeMs < earlyBird.endTimeMs;
  const earlyBirdState: IndividualTierState = isEarlyBirdOpen
    ? {
        id: "early_bird",
        name: "Early Bird",
        tierLabel: earlyBird.tierName,
        price: earlyBird.price,
        formattedPrice: earlyBird.formattedPrice,
        allocationText: earlyBird.allocationText,
        widgetUrl: earlyBird.widgetUrl,
        status: "open",
        isOpen: true,
        isLocked: false,
        isClosed: false,
        isTransitioning: false,
        ctaText: earlyBird.ctaLabel,
        ctaFullText: earlyBird.ctaFullLabel,
        badgeText: "ACTIVE NOW",
        availabilityNote: "Available until 25 October 2026, 11:59 PM IST",
      }
    : {
        id: "early_bird",
        name: "Early Bird",
        tierLabel: earlyBird.tierName,
        price: earlyBird.price,
        formattedPrice: earlyBird.formattedPrice,
        allocationText: earlyBird.allocationText,
        widgetUrl: earlyBird.widgetUrl,
        status: "closed",
        isOpen: false,
        isLocked: false,
        isClosed: true,
        isTransitioning: false,
        ctaText: "EARLY BIRD ENDED",
        ctaFullText: "EARLY BIRD ENDED",
        badgeText: "TIER CLOSED",
        availabilityNote: "Closed on 26 October 2026 at 12:00 AM IST",
      };

  // 2. Evaluate Individual Regular Bird State
  let regularBirdState: IndividualTierState;
  if (currentTimeMs < transitioning.startTimeMs) {
    // Before Early Bird ends: LOCKED
    regularBirdState = {
      id: "regular_bird",
      name: "Regular Bird",
      tierLabel: regularBird.tierName,
      price: regularBird.price,
      formattedPrice: regularBird.formattedPrice,
      allocationText: regularBird.allocationText,
      widgetUrl: regularBird.widgetUrl,
      status: "locked",
      isOpen: false,
      isLocked: true,
      isClosed: false,
      isTransitioning: false,
      ctaText: "LOCKED TILL EARLY BIRD ENDS",
      ctaFullText: "🔒 LOCKED · OPENS 26 OCT",
      badgeText: "🔒 LOCKED TILL 26 OCT",
      availabilityNote: "Unlocks automatically on 26 Oct 2026 at 12:01 AM IST once Early Bird closes",
    };
  } else if (currentTimeMs < transitioning.endTimeMs) {
    // 1-minute buffer: TRANSITIONING
    regularBirdState = {
      id: "regular_bird",
      name: "Regular Bird",
      tierLabel: regularBird.tierName,
      price: regularBird.price,
      formattedPrice: regularBird.formattedPrice,
      allocationText: regularBird.allocationText,
      widgetUrl: regularBird.widgetUrl,
      status: "transitioning",
      isOpen: false,
      isLocked: true,
      isClosed: false,
      isTransitioning: true,
      ctaText: "PRICES UPDATING — PLEASE WAIT",
      ctaFullText: "PRICES UPDATING",
      badgeText: "UPDATING",
      availabilityNote: "Ticket prices are updating — opens at 12:01 AM IST",
    };
  } else if (currentTimeMs < regularBird.endTimeMs) {
    // From 26 Oct 12:01 AM to 31 Oct 2:00 PM: OPEN
    regularBirdState = {
      id: "regular_bird",
      name: "Regular Bird",
      tierLabel: regularBird.tierName,
      price: regularBird.price,
      formattedPrice: regularBird.formattedPrice,
      allocationText: regularBird.allocationText,
      widgetUrl: regularBird.widgetUrl,
      status: "open",
      isOpen: true,
      isLocked: false,
      isClosed: false,
      isTransitioning: false,
      ctaText: regularBird.ctaLabel,
      ctaFullText: regularBird.ctaFullLabel,
      badgeText: "ACTIVE NOW",
      availabilityNote: "Available until 31 October 2026, 2:00 PM IST",
    };
  } else {
    // After 31 Oct 2:00 PM: CLOSED
    regularBirdState = {
      id: "regular_bird",
      name: "Regular Bird",
      tierLabel: regularBird.tierName,
      price: regularBird.price,
      formattedPrice: regularBird.formattedPrice,
      allocationText: regularBird.allocationText,
      widgetUrl: regularBird.widgetUrl,
      status: "closed",
      isOpen: false,
      isLocked: false,
      isClosed: true,
      isTransitioning: false,
      ctaText: "TICKET SALES CLOSED",
      ctaFullText: "SALES CLOSED",
      badgeText: "CLOSED",
      availabilityNote: "Sales closed on 31 October 2026, 2:00 PM IST",
    };
  }

  // 3. Before 26 October 2026 at 12:00 AM IST: Early Bird
  if (currentTimeMs < earlyBird.endTimeMs) {
    return {
      phase: "early_bird",
      ticketLabel: earlyBird.label,
      tierName: earlyBird.tierName,
      price: earlyBird.price,
      formattedPrice: earlyBird.formattedPrice,
      ctaLabel: earlyBird.ctaLabel,
      ctaFullLabel: earlyBird.ctaFullLabel,
      widgetUrl: earlyBird.widgetUrl,
      isBookingEnabled: true,
      isClosed: false,
      isTransitioning: false,
      allocationText: earlyBird.allocationText,
      scheduleDescription: "Available until 25 October 2026, 11:59 PM IST",
      earlyBirdState,
      regularBirdState,
    };
  }

  // 4. 26 October 2026 from 12:00 AM IST to 12:01 AM IST: 1-minute Transition Gap
  if (currentTimeMs < transitioning.endTimeMs) {
    return {
      phase: "transitioning",
      ticketLabel: transitioning.label,
      tierName: transitioning.tierName,
      price: null,
      formattedPrice: transitioning.formattedPrice,
      ctaLabel: transitioning.ctaLabel,
      ctaFullLabel: transitioning.ctaFullLabel,
      widgetUrl: null,
      isBookingEnabled: false,
      isClosed: false,
      isTransitioning: true,
      allocationText: "Price update in progress",
      statusMessage: transitioning.message,
      scheduleDescription: "Transitioning to Regular Bird tier",
      earlyBirdState,
      regularBirdState,
    };
  }

  // 5. From 26 October 2026 at 12:01 AM IST to 31 October 2026 at 2:00 PM IST: Regular Bird
  if (currentTimeMs < regularBird.endTimeMs) {
    return {
      phase: "regular_bird",
      ticketLabel: regularBird.label,
      tierName: regularBird.tierName,
      price: regularBird.price,
      formattedPrice: regularBird.formattedPrice,
      ctaLabel: regularBird.ctaLabel,
      ctaFullLabel: regularBird.ctaFullLabel,
      widgetUrl: regularBird.widgetUrl,
      isBookingEnabled: true,
      isClosed: false,
      isTransitioning: false,
      allocationText: regularBird.allocationText,
      scheduleDescription: "Available until 31 October 2026, 2:00 PM IST",
      earlyBirdState,
      regularBirdState,
    };
  }

  // 6. After 31 October 2026 at 2:00 PM IST: Sales Closed
  return {
    phase: "sales_closed",
    ticketLabel: closed.label,
    tierName: closed.tierName,
    price: null,
    formattedPrice: closed.formattedPrice,
    ctaLabel: closed.ctaLabel,
    ctaFullLabel: closed.ctaFullLabel,
    widgetUrl: null,
    isBookingEnabled: false,
    isClosed: true,
    isTransitioning: false,
    allocationText: "Sales closed",
    statusMessage: closed.message,
    scheduleDescription: "Sales ended on 31 October 2026, 2:00 PM IST",
    earlyBirdState,
    regularBirdState,
  };
}

/**
 * React hook that manages dynamic real-time ticket phase state.
 * Subscribes to a 1-second interval timer with clean unmount handling so that
 * an open browser tab automatically transitions across schedule thresholds.
 */
export function useTicketPhase(clockOverrideMs?: number): TicketPhaseInfo {
  const [phaseInfo, setPhaseInfo] = useState<TicketPhaseInfo>(() =>
    getTicketPhaseInfo(clockOverrideMs ?? getSimulatedOrCurrentTime())
  );

  useEffect(() => {
    if (clockOverrideMs !== undefined) {
      setPhaseInfo(getTicketPhaseInfo(clockOverrideMs));
      return;
    }

    const checkAndUpdate = () => {
      const nextInfo = getTicketPhaseInfo();
      setPhaseInfo((prev) => {
        if (
          prev.phase !== nextInfo.phase ||
          prev.price !== nextInfo.price ||
          prev.isBookingEnabled !== nextInfo.isBookingEnabled
        ) {
          return nextInfo;
        }
        return prev;
      });
    };

    const intervalId = window.setInterval(checkAndUpdate, 1000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [clockOverrideMs]);

  return phaseInfo;
}
