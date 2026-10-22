import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Lock,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import { halloweenEvent } from "../config/halloweenEvent";
import { useTicketPhase } from "../config/ticketSchedule";
import "./HalloweenTicketsPage.css";

export const HalloweenTicketsPage: React.FC = () => {
  const ticket = useTicketPhase();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipFormData, setVipFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    groupSize: "4-6",
    specialRequests: "",
  });
  const [vipSubmitted, setVipSubmitted] = useState(false);
  const [vipSubmitting, setVipSubmitting] = useState(false);

  // Scroll to top upon landing on the checkout page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const handleVipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVipSubmitting(true);
    const payload = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      fullName: vipFormData.fullName.trim(),
      email: vipFormData.email.trim(),
      phoneNumber: vipFormData.phone.trim(),
      groupTier: vipFormData.groupSize,
      specialRequests: vipFormData.specialRequests.trim(),
      inquiryType: "VIP Table / Large Squad Inquiry",
    };

    const webhookUrl =
      halloweenEvent.googleSheetsWebhookUrl ||
      import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;

    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      }
      localStorage.setItem("viora_vip_inquiry", JSON.stringify(payload));
    } catch (err) {
      console.warn("VIP inquiry submission error:", err);
    } finally {
      setVipSubmitting(false);
      setVipSubmitted(true);
    }
  };

  return (
    <main className="tickets-page">
      {/* Background Ambience */}
      <div className="tickets-page-bg" aria-hidden="true">
        <div className="tickets-page-radial" />
        <div className="tickets-page-mesh" />
      </div>

      {/* Navigation Bar */}
      <header className="tickets-page-header">
        <div className="tickets-header-inner">
          <Link to="/" className="tickets-back-link" aria-label="Return to landing page">
            <ArrowLeft size={16} />
            <span>RETURN TO THE NIGHT</span>
          </Link>

          <Link to="/" className="tickets-brand-logo-link" aria-label="VIORA ELITE">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.svg`}
              alt="VIORA ELITE"
              className="tickets-brand-logo"
            />
          </Link>

          <div className="tickets-header-sigil" aria-hidden="true">
            <span>Φ · Ρ · Α · Τ</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <section className="tickets-page-content">
        <div className="tickets-container">
          {/* Header & Event Meta */}
          <div className="tickets-summary-card">
            <div className="tickets-summary-top">
              <span className="tickets-pill-tag">
                {ticket.isBookingEnabled ? `OFFICIAL CHECKOUT · ${ticket.ticketLabel}` : ticket.ticketLabel}
              </span>
              <span className="tickets-sigil-dot">🦇</span>
              <span className="tickets-limited-tag">{ticket.allocationText}</span>
            </div>

            <h1 className="tickets-event-title">
              HALLOWEEN <span className="title-cross">×</span> FRAT
            </h1>
            <p className="tickets-event-subtitle">
              TWO WORLDS COLLIDE. ONE NIGHT TAKES OVER.
            </p>

            {/* Event Quick Details */}
            <div className="tickets-meta-row">
              <div className="meta-badge-item">
                <Calendar size={14} className="meta-icon" />
                <span>Saturday, 31 October 2026</span>
              </div>
              <div className="meta-badge-item">
                <Clock size={14} className="meta-icon" />
                <span>10:30 PM Onwards</span>
              </div>
              <div className="meta-badge-item">
                <MapPin size={14} className="meta-icon" />
                <span>Hyderabad (Secret Venue Reveal)</span>
              </div>
            </div>

            {/* Dual Tier Status Overview */}
            <div className="tickets-tier-status-bar">
              <div className={`tier-status-chip ${ticket.earlyBirdState.isOpen ? "chip-active" : "chip-closed"}`}>
                <div className="chip-left">
                  <span className="chip-name">EARLY BIRD</span>
                  <span className="chip-price">₹1,799</span>
                </div>
                <span className={`chip-badge ${ticket.earlyBirdState.isOpen ? "chip-badge-open" : "chip-badge-closed"}`}>
                  {ticket.earlyBirdState.isOpen ? "● ACTIVE NOW" : "ENDED"}
                </span>
              </div>
              <div className={`tier-status-chip ${ticket.regularBirdState.isOpen ? "chip-active" : ticket.regularBirdState.isLocked ? "chip-locked" : "chip-closed"}`}>
                <div className="chip-left">
                  <span className="chip-name">REGULAR BIRD</span>
                  <span className="chip-price">₹2,199</span>
                </div>
                <span className={`chip-badge ${ticket.regularBirdState.isOpen ? "chip-badge-open" : ticket.regularBirdState.isLocked ? "chip-badge-locked" : "chip-badge-closed"}`}>
                  {ticket.regularBirdState.isLocked ? "🔒 LOCKED TILL 26 OCT" : ticket.regularBirdState.isOpen ? "● ACTIVE NOW" : "CLOSED"}
                </span>
              </div>
            </div>

            {/* Pricing Highlight */}
            <div className="tickets-pass-banner">
              <div className="pass-banner-left">
                <span className="pass-tier-label">{ticket.tierName}</span>
                <span className="pass-tier-desc">
                  {ticket.isBookingEnabled
                    ? "Full experience access · Masquerade ball · Costume contest entry"
                    : ticket.scheduleDescription}
                </span>
              </div>
              <div className="pass-banner-right">
                <span className="pass-price-amount">{ticket.formattedPrice}</span>
                <span className="pass-price-tax">{ticket.price ? "All Taxes Included" : ""}</span>
              </div>
            </div>
          </div>

          {/* KonfHub Widget Card or Transition/Closed Card */}
          {ticket.widgetUrl ? (
            <div className="konfhub-page-card" data-lenis-prevent="true">
              <div className="konfhub-card-topbar">
                <div className="secure-badge">
                  <ShieldCheck size={16} className="shield-icon" />
                  <span>OFFICIAL KONFHUB SECURE CHECKOUT</span>
                </div>
                <div className="payment-modes">
                  <span>UPI · CARDS · NET BANKING</span>
                </div>
              </div>

              {/* Official KonfHub Widget iframe */}
              <div className="konfhub-iframe-wrapper">
                <iframe
                  key={ticket.widgetUrl}
                  src={ticket.widgetUrl}
                  id="konfhub-widget"
                  title={`Register for HALLOWEEN X FRAT - ${ticket.ticketLabel}`}
                  width="100%"
                  height="500"
                  allow="payment"
                  className="konfhub-iframe-embed"
                />
              </div>

              <div className="konfhub-card-bottombar">
                <div className="guarantee-col">
                  <Lock size={13} className="lock-icon" />
                  <span>256-bit encrypted checkout powered directly by KonfHub</span>
                </div>
                <div className="guarantee-col">
                  <span>⚡ Instant QR pass sent via email & WhatsApp</span>
                </div>
              </div>
            </div>
          ) : ticket.isTransitioning ? (
            <div className="ticket-status-card ticket-status-card--transition" data-lenis-prevent="true">
              <div className="status-card-icon-wrap">
                <Clock size={36} className="status-card-icon" />
              </div>
              <h2 className="status-card-title">Ticket Prices Are Updating</h2>
              <p className="status-card-desc">
                {ticket.statusMessage || "Ticket prices are updating — please check back shortly."}
              </p>
              <div className="status-card-badge">
                <span>Transitioning to Regular Bird Tier (₹2,199)</span>
              </div>
              <p className="status-card-auto-hint">
                This page will automatically refresh as soon as Regular Bird sales open at 12:01 AM IST.
              </p>
            </div>
          ) : (
            <div className="ticket-status-card ticket-status-card--closed" data-lenis-prevent="true">
              <div className="status-card-icon-wrap">
                <Lock size={36} className="status-card-icon" />
              </div>
              <h2 className="status-card-title">Ticket Sales Officially Closed</h2>
              <p className="status-card-desc">
                {ticket.statusMessage || "Ticket sales are now closed. No tickets will be sold at the gate."}
              </p>
              <p className="status-card-subtext">
                Entry at the venue is strictly guarded and limited to verified passholders. For VIP table or squad enquiries, use the concierge option below.
              </p>
            </div>
          )}

          {/* Experience Perks Breakdown */}
          <div className="tickets-perks-grid">
            <div className="perk-box">
              <div className="perk-icon-wrap">
                <Check size={14} />
              </div>
              <div className="perk-text">
                <strong>Guaranteed Entry</strong>
                <p>Digital QR pass scanned at venue gate with verified entry.</p>
              </div>
            </div>

            <div className="perk-box">
              <div className="perk-icon-wrap">
                <Check size={14} />
              </div>
              <div className="perk-text">
                <strong>The Full Experience</strong>
                <p>Dance floor, wicked food & drinks, tarot corner, and costume contest.</p>
              </div>
            </div>

            <div className="perk-box">
              <div className="perk-icon-wrap">
                <Check size={14} />
              </div>
              <div className="perk-text">
                <strong>Strict 21+ Community</strong>
                <p>Curated crowd, exclusive atmosphere, and uninhibited vibes.</p>
              </div>
            </div>
          </div>

          {/* Squad / VIP Tables Inquiry Bar */}
          <div className="vip-concierge-card">
            <div className="vip-concierge-copy">
              <h3 className="vip-concierge-title">Arriving with a Large Squad or Need VIP Tables?</h3>
              <p className="vip-concierge-text">
                Special arrangements and table packages are available for squads of 7+ souls.
              </p>
            </div>
            <button
              type="button"
              className="vip-concierge-btn"
              onClick={() => setIsVipModalOpen(true)}
            >
              <span>VIP SQUAD INQUIRY</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="tickets-page-footer">
        <div className="tickets-footer-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} VIORA ELITE × FRAT. ALL RIGHTS RESERVED.
          </p>
          <div className="footer-links">
            <Link to="/" className="footer-link">MAIN EXPERIENCE</Link>
            <span className="footer-dot">·</span>
            <a
              href={halloweenEvent.instagram || "https://www.instagram.com/viora.elite?dlrf=enc3anpzN2UwNmty"}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              INSTAGRAM
            </a>
            <span className="footer-dot">·</span>
            <a
              href={halloweenEvent.websiteUrl || "https://www.vioraelite.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              WEBSITE
            </a>
          </div>
        </div>
      </footer>

      {/* VIP / Squad Inquiry Modal */}
      {isVipModalOpen && (
        <div
          className="vip-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsVipModalOpen(false);
          }}
        >
          <div className="vip-modal-dialog">
            <button
              type="button"
              className="vip-modal-close"
              onClick={() => {
                setIsVipModalOpen(false);
                setVipSubmitted(false);
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {vipSubmitted ? (
              <div className="vip-modal-success">
                <ShieldCheck size={42} className="success-icon" />
                <h3>VIP Inquiry Received</h3>
                <p>
                  Our concierge team will reach out to your phone/email shortly with private table arrangements and customized pricing.
                </p>
                <button
                  type="button"
                  className="vip-modal-done-btn"
                  onClick={() => {
                    setIsVipModalOpen(false);
                    setVipSubmitted(false);
                  }}
                >
                  RETURN TO TICKETS
                </button>
              </div>
            ) : (
              <form onSubmit={handleVipSubmit} className="vip-inquiry-form">
                <span className="vip-form-tag">CONCIERGE DESK</span>
                <h3 className="vip-form-title">VIP Table & Large Squad Inquiry</h3>
                <p className="vip-form-desc">
                  Tell us about your group and we will arrange an exclusive table package.
                </p>

                <div className="vip-form-field">
                  <label htmlFor="vip-name">Lead Name *</label>
                  <input
                    id="vip-name"
                    type="text"
                    required
                    placeholder="Full Name"
                    value={vipFormData.fullName}
                    onChange={(e) =>
                      setVipFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                  />
                </div>

                <div className="vip-form-row">
                  <div className="vip-form-field">
                    <label htmlFor="vip-phone">Phone Number *</label>
                    <input
                      id="vip-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={vipFormData.phone}
                      onChange={(e) =>
                        setVipFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>

                  <div className="vip-form-field">
                    <label htmlFor="vip-email">Email Address *</label>
                    <input
                      id="vip-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={vipFormData.email}
                      onChange={(e) =>
                        setVipFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="vip-form-field">
                  <label htmlFor="vip-group">Estimated Squad Size *</label>
                  <select
                    id="vip-group"
                    value={vipFormData.groupSize}
                    onChange={(e) =>
                      setVipFormData((prev) => ({ ...prev, groupSize: e.target.value }))
                    }
                  >
                    <option value="4-6">4–6 People</option>
                    <option value="7-10">7–10 People (VIP Table)</option>
                    <option value="11+">11+ People (Private Booth)</option>
                  </select>
                </div>

                <div className="vip-form-field">
                  <label htmlFor="vip-requests">Special Requests / Preferences</label>
                  <textarea
                    id="vip-requests"
                    rows={3}
                    placeholder="Bottle service preferences, arrival time, specific seating..."
                    value={vipFormData.specialRequests}
                    onChange={(e) =>
                      setVipFormData((prev) => ({
                        ...prev,
                        specialRequests: e.target.value,
                      }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={vipSubmitting}
                  className="vip-submit-button"
                >
                  {vipSubmitting ? "TRANSMITTING..." : "SUBMIT VIP INQUIRY"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
