/**
 * Seasonal homepage callouts.
 *
 * A callout shows only inside its yearly month-day window, judged in Rochester
 * time. The build decides whether to render it, and the page removes it in the
 * browser once the window has closed, so a site that is not rebuilt over the
 * holidays does not keep promoting an out-of-season service. A window that
 * opens while the site sits unbuilt appears with the next deploy.
 */
import type { ServiceSlug } from './services';

export interface SeasonWindow {
  /** First day shown, as 'MM-DD'. */
  start: string;
  /** Last day shown, as 'MM-DD'. Earlier than start means the window crosses New Year. */
  end: string;
}

/**
 * Holiday lighting consultations start in September (service FAQ), and the
 * 2026 holiday search ads were scheduled to end December 12.
 */
export const holidayLightingPromo: { serviceSlug: ServiceSlug; window: SeasonWindow } = {
  serviceSlug: 'holiday-lighting',
  window: { start: '09-15', end: '12-12' },
};

/** Month and day ('MM-DD') of a moment in America/New_York. */
export function rochesterMonthDay(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('month')}-${value('day')}`;
}

export function isInSeason(window: SeasonWindow, date: Date = new Date()): boolean {
  const today = rochesterMonthDay(date);
  return window.start <= window.end
    ? today >= window.start && today <= window.end
    : today >= window.start || today <= window.end;
}
