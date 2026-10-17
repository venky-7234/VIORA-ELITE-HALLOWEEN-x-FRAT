import { useEffect, useState } from "react";
import { halloweenEvent, halloweenEventTimestamp } from "../config/halloweenEvent";

interface Countdown { days: string; hours: string; minutes: string; seconds: string }
const zero = { days: "00", hours: "00", minutes: "00", seconds: "00" };

export function HalloweenCountdown() {
  const [countdown, setCountdown] = useState<Countdown>(zero);
  const validDate = Number.isFinite(halloweenEventTimestamp);

  useEffect(() => {
    if (!validDate) return;
    const update = () => {
      const seconds = Math.max(0, Math.floor((halloweenEventTimestamp - Date.now()) / 1000));
      setCountdown({
        days: String(Math.floor(seconds / 86400)).padStart(2, "0"),
        hours: String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0"),
        minutes: String(Math.floor((seconds % 3600) / 60)).padStart(2, "0"),
        seconds: String(seconds % 60).padStart(2, "0"),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [validDate]);

  return <section className="countdown-section" id="countdown" aria-labelledby="countdown-title">
    <p className="halloween-eyebrow horror-reveal">VI &nbsp; / &nbsp; COUNTDOWN TO DARKNESS</p>
    <h2 className="horror-reveal" id="countdown-title">The darkness is <em>coming.</em></h2>
    {validDate ? <>
      <div className="countdown-grid" aria-label={`${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes and ${countdown.seconds} seconds until the event`}>
        {Object.entries(countdown).map(([unit, value]) => <div className="countdown-unit" key={unit}><strong>{value}</strong><span>{unit.toUpperCase()}</span></div>)}
      </div>
      {halloweenEvent.timeZone && <p className="countdown-timezone">EVENT TIME · {halloweenEvent.timeZone}</p>}
    </> : <p className="countdown-announcement">The date will be revealed when the house is ready.</p>}
    <span className="countdown-rule"/>
  </section>;
}
