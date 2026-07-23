# Solenix Solutions — Metrics Log

Quarterly snapshot of website performance, kept **in the repo** so the 1-year
"is the ₹1,000/yr domain worth it?" review has a bulletproof record even if a
free-tier dashboard resets its retention window. Companion to
`SOLENIX_METRICS_REVIEW_PLAN` (Part B = this log, Part C = the year-end review).

- **Tracking live since:** 2026-07-23 — GA4 property `G-E77FC0LCBQ`
- **Data retention:** set GA4 to **14 months** (Admin → Data settings → Data retention)
- **Cadence:** ~10 min, once per quarter (4×/year). Append one row per quarter — never edit past rows.

> ⚠️ Analytics only counts from the day it went live (2026-07-23). Numbers before
> that date do not exist. If tracking ever breaks, note the gap here — a gap means
> the data measures the gap, not the website.

## Where each number comes from

| Column | Source | How to read it |
| --- | --- | --- |
| Users, Sessions | GA4 → Reports (set the date range to the quarter) | unique visitors & visits |
| whatsapp_click · call_click · email_click · form_submit · distributor_click | GA4 → Reports → Engagement → **Events** | the decision metric — "contact intents" |
| GSC clicks · impressions · Top 3 queries | Google Search Console (16-mo window) | how people find you in Google search |
| GBP calls · GBP site clicks | Google Business Profile → Performance | often the most business-relevant numbers |
| Notes | you | **the gold column** — ask every new buyer "how did you find us?" and log any order/enquiry that came via the site or a WhatsApp link. One attributed order settles the whole domain question by itself. |

## Log

| Quarter | Users | Sessions | whatsapp_click | call_click | email_click | form_submit | distributor_click | GSC clicks | GSC impressions | Top 3 queries | GBP calls | GBP site clicks | Notes (orders/enquiries attributed to site) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _Q3 2026_ |  |  |  |  |  |  |  |  |  |  |  |  | _tracking started 2026-07-23_ |

<!-- Append one row per quarter. Suggested schedule from launch (2026-07-23):
     Q3 2026 → log ~2026-09-30 · Q4 2026 → ~2026-12-31 · Q1 2027 → ~2027-03-31 · Q2 2027 → ~2027-06-30
     Run the full 1-year review at ~month 11 (June 2027), BEFORE the domain auto-renews. -->
