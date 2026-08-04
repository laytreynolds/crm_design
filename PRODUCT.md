# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three roles, all real: sales agents (create orders, enter customer/handset/tariff details, chase a sale through to connection), ops/admin staff (push orders through the pipeline — TEKTON upload, C2B transfer, welcome calls, eSIM processing, contracts), and managers (use the dashboard/leaderboard for performance oversight across the sales team).

## Product Purpose

This repository is a design portfolio piece: a working front-end implementation of the Chadwell CRM order page redesign, built to showcase the redesign as a polished, explorable case study rather than to run as Chadwell's actual production system. It exists to demonstrate design and front-end craft against a real, plausible CRM workflow — not to process real orders.

## Positioning

Not a generic CRM demo — it's a faithful, deeply-detailed simulation of one specific real business's order pipeline (Chadwell, a UK mobile/telecoms reseller), down to real status names, real network partners, and real workflow steps a generic "CRM template" would not reproduce.

## Operating Context

Chadwell is a real UK mobile/telecoms reseller selling contracts on behalf of networks (EE, Vodafone, and others). Order terminology and pipeline stages are real domain facts and must be preserved exactly, not genericized: Consumer QC, Awaiting TEKTON Upload, Pending Welcome Call, Declined, Awaiting Contract (10+), Fully Connected, Connected – C2B Submitted, Add to Master, Connected – Awaiting C2B Transfer, E-Sim – To Process, Signed – Awaiting Sales Team, Awaiting Stock, Signed – Awaiting Plan, Future End Date, To Process, Cancelled, Issues, Complete, Awaiting Contract, Lost Quotes. Settings domains include Lead Status, Client Status, Order Status, Campaigns, Business Type, Current Network, Sale Type, Handset, Tariff, Lead Source, New Network, Bolt Ons Manager. Currency is GBP; addresses/postcodes are UK format.

## Capabilities and Constraints

Built with React + Vite, deployed statically to GitHub Pages (no backend). Data is hardcoded seed records (one order, one client) rather than a live API — every "View"/"Edit" action across the app opens the same demo record by design; this is deliberate portfolio scaffolding, not a bug to fix. Site access is gated by a client-side SHA-256 password check (`src/auth/authConfig.js`) — explicitly a casual gate, not real access control, since there is no backend to enforce one. The design source of record is `design/Order Page Redesign.dc.html` (a Claude Design project export); re-pull it before making changes meant to track the design. Screen/nav state persists in sessionStorage only (resets on browser close). Sidebar nav includes many destinations (order status sub-filters, most settings sub-items) that are present for shell realism but have no built screen behind them yet — see `src/app/navigation.js` and `NAV_SCREEN` in `src/app/App.jsx` for what's actually wired up.

## Brand Commitments

Product name: Chadwell CRM. Uses the "Chadwell Design System" (`src/ds/`) — tokens, component CSS, and React components (Badge, Button, Card, Icon, IconButton, Tag, Dialog, Toast, Tooltip, Checkbox, Input, Radio, Select, Switch, Tabs) — as the binding visual/component language; extend it rather than introducing parallel styling. Logo assets at `public/logo.png` and `public/logo_reverse.png`.

## Evidence on Hand

- `design/Order Page Redesign.dc.html` — the design source of record for the order page (Claude Design export).
- Seed data modules (`src/order/orderData.js`, `src/client/clientData.js`, and list-page `*Data.js` files) — the one full demo order/client record plus list-view mock rows; deliberately fictional Chadwell customer data, not real customer records.
- No real customer, sales, or performance data exists anywhere in this repo — dashboard metrics, leaderboards, and list rows are all fabricated for demo purposes and must not be treated or presented as real Chadwell business results.

## Product Principles

1. Preserve Chadwell's real domain vocabulary and pipeline stages exactly — this is what separates the piece from a generic CRM template.
2. Treat the single-seed-record, no-backend nature of the app as permanent demo scaffolding, not a gap to silently "fix" by inventing a backend or multiplying fake records.
3. Extend the Chadwell Design System rather than working around it; new UI should read as a natural extension of `src/ds/`.
4. Optimize for the piece reading as a credible, detailed real-world tool to someone evaluating the design work — craft and plausibility matter more than feature completeness.
5. Keep the design source (`design/Order Page Redesign.dc.html`) and the live implementation from silently diverging; re-pull it before design-tracking changes.
