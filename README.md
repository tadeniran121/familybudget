# 💰 FamilyBudget

> **An open-source family budget planner built for real life.**  
> Free. No accounts. No backend. Just open your browser and start budgeting.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tadeniran121/familybudget)

---

## 📋 Product Requirements Document

| | |
|---|---|
| **Version** | 0.1 — Initial Draft |
| **Status** | In Review |
| **License** | MIT |
| **Repository** | [github.com/tadeniran121/familybudget](https://github.com/tadeniran121/familybudget) |

---

## Table of Contents

1. [Overview](#1-overview)
2. [Target Users](#2-target-users)
3. [User Stories](#3-user-stories)
4. [Feature Requirements](#4-feature-requirements)
5. [Technical Approach](#5-technical-approach)
6. [Default Budget Categories](#6-default-budget-categories)
7. [Open Source & Contributor Guidelines](#7-open-source--contributor-guidelines)
8. [Success Metrics](#8-success-metrics)
9. [Release Plan](#9-release-plan)
10. [Design Principles](#10-design-principles)

---

## 1. Overview

### 1.1 Problem Statement

Most families manage household budgets using generic spreadsheets — powerful but cumbersome to maintain month-to-month, intimidating for non-technical users, and impossible to share and collaborate on in real time. There is no widely-adopted open source tool that is opinionated enough to be useful out of the box, yet flexible enough to work for families across different financial situations, household structures, and currencies.

### 1.2 Vision

FamilyBudget is a free, open-source web application that gives any family — regardless of technical ability — a guided, visual, and collaborative way to plan, track, and reflect on their household finances throughout the year. It should feel like having a financially-savvy friend who has already done the hard work of designing the spreadsheet for you.

### 1.3 Goals

- ✅ Provide a fully guided setup that eliminates the "blank sheet terror" of starting a budget from scratch
- ✅ Support dual-income households and multi-person budget splitting
- ✅ Track budget vs. actuals with visual dashboards across all 12 months
- ✅ Support multiple currencies with UK (GBP) as the primary locale out of the box
- ✅ Be deployable with zero technical knowledge via GitHub Pages or Netlify
- ✅ Be fully open source and contributor-friendly from day one

### 1.4 Non-Goals

- ❌ Not a banking integration tool — no connection to real bank accounts
- ❌ Not a SaaS product — no backend, no user accounts, no subscription fees
- ❌ Not a tax filing tool — it surfaces tax-relevant categories but provides no tax advice
- ❌ Not a mobile app — optimised for browser, though fully mobile-responsive

---

## 2. Target Users

FamilyBudget is designed to be configured for any household's personal situation.

| Persona | Who they are | Key need | Currency context |
|---|---|---|---|
| 🇬🇧 **The UK Family** | Dual-income couple with children, based in the UK | Track mortgage, council tax, childcare, and savings goals in one place | GBP primary |
| 🌍 **The Global Family** | Internationally mobile household managing expenses across currencies | Multi-currency tracking and relocation budget categories | Multi-currency |
| 👫 **New Starters** | Young couple setting up their first household budget together | Guided setup, sensible defaults, shared access | Configurable |
| 👶 **The Growing Family** | Parents with young children tracking nursery, baby supplies, and education costs | Childcare cost calculator, children-specific expense categories | GBP / configurable |

---

## 3. User Stories

### 3.1 Setup & Onboarding

| As a... | I want to... | So that... |
|---|---|---|
| First-time user | be guided through setting up my household profile (members, income, currency) | I can start budgeting without knowing what categories I need |
| User | add or remove budget categories to fit my household | the tool reflects my real life, not a generic template |
| Dual-income couple | enter two incomes separately and see a combined household view | I understand our total financial position clearly |

### 3.2 Monthly Budgeting

| As a... | I want to... | So that... |
|---|---|---|
| User | set a monthly budget for each spending category | I have a plan to work to each month |
| User | enter my actual spend at any point in the month | I can compare what I planned vs. what I actually spent |
| User | carry forward a budget into the next month with one click | I don't have to re-enter the same figures every month |
| Dual-income household | split a shared bill proportionally between two earners | each person knows their fair share of household costs |

### 3.3 Tracking & Dashboards

| As a... | I want to... | So that... |
|---|---|---|
| User | see a monthly summary dashboard with income, expenses, and net balance | I can tell at a glance if I'm on track |
| User | view a full-year view of all budget categories month by month | I can spot seasonal patterns and plan ahead |
| User | see a chart of spending by category | I know where my money is actually going |
| User | track my savings balance growing over the year | I stay motivated toward my savings goals |

### 3.4 Sharing & Collaboration

| As a... | I want to... | So that... |
|---|---|---|
| Partner/spouse | share access to the same budget without needing a user account | we can manage our finances together without friction |
| User | export my budget to a CSV or PDF | I can share it with my partner or financial advisor |

### 3.5 Configuration

| As a... | I want to... | So that... |
|---|---|---|
| UK-based user | have GBP set as the default currency with UK-specific categories pre-loaded | I don't have to configure anything to get started |
| International user | change the currency and locale at any time | the tool works for my country |
| User | rename, hide, or add any expense category | the budget reflects my personal situation |

---

## 4. Feature Requirements

> **Priority key:** 🔴 P0 = must have at launch · 🟢 P1 = important for v1 · 🟣 P2 = future roadmap

### 4.1 Setup & Household Profile

| Feature | Description | Priority |
|---|---|:---:|
| Guided Setup Wizard | Step-by-step onboarding: household name, members, income sources, currency, budget year | 🔴 P0 |
| Household Members | Add up to 4 household earners with names/labels (e.g. Partner 1, Partner 2) | 🔴 P0 |
| Currency Selector | Choose from major currencies (GBP default). Symbol and formatting applied globally | 🔴 P0 |
| Category Templates | Pre-loaded UK category set; ability to add, rename, hide, or reorder categories | 🔴 P0 |
| Data Persistence | Budget data saved to browser localStorage. No account or server required | 🔴 P0 |
| Import from CSV | Upload a CSV to populate existing budget data | 🟣 P2 |

### 4.2 Budget Planning

| Feature | Description | Priority |
|---|---|:---:|
| Monthly Budget Grid | 12-month grid view showing all categories with planned spend per month | 🔴 P0 |
| Annual Budget Summary | Top-level summary: Total Income, Total Expenses, Net, Savings Balance per month | 🔴 P0 |
| Copy Previous Month | One-click to copy a previous month's budget to the next month | 🔴 P0 |
| Income Tracking | Support multiple income sources: salary, freelance, dividends, gifts, transfers | 🔴 P0 |
| Savings Goals | Dedicated savings section: emergency fund, retirement, investments, college, other | 🔴 P0 |
| Bill Split Calculator | Split any expense proportionally or equally between household members | 🟢 P1 |
| Childcare Calculator | Dedicated childcare cost estimator (days, rates, meals) feeding into monthly budget | 🟢 P1 |

### 4.3 Actual Tracking

| Feature | Description | Priority |
|---|---|:---:|
| Budget vs. Actual | Side-by-side view of planned vs. actual spend for each category and month | 🔴 P0 |
| Over/Under Indicators | Colour-coded signals when actuals exceed budget in any category | 🔴 P0 |
| Monthly Spend Entry | Simple input to log actual spend per category per month | 🔴 P0 |
| Running Balance | Real-time spending balance and savings balance updated as actuals are entered | 🔴 P0 |

### 4.4 Dashboards & Visualisation

| Feature | Description | Priority |
|---|---|:---:|
| Monthly Dashboard | Summary card: income, total expenses, net surplus/deficit, savings for selected month | 🔴 P0 |
| Category Breakdown Chart | Doughnut/pie chart showing expense distribution by category for selected month | 🔴 P0 |
| Year-at-a-Glance Chart | Bar/line chart showing monthly income vs. expenses across all 12 months | 🟢 P1 |
| Savings Progress Chart | Running line chart of savings balance across the year | 🟢 P1 |
| Category % of Total | Show each category as % of total expenses, highlight highest-spend areas | 🟢 P1 |

### 4.5 Export & Sharing

| Feature | Description | Priority |
|---|---|:---:|
| Export to CSV | Download full budget as a CSV file | 🟢 P1 |
| Export to PDF | Print-friendly PDF summary of monthly or annual budget | 🟢 P1 |
| Shareable Link | Generate a URL with budget data encoded (no server) for sharing with a partner | 🟣 P2 |
| Google Sheets Export | One-click export to a Google Sheet | 🟣 P2 |

---

## 5. Technical Approach

FamilyBudget is a **static web application** — no backend, no database, no server required. Zero cost. Zero maintenance burden. Non-technical families can use it or deploy their own copy in minutes.

### 5.1 Recommended Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI Framework | React (Vite) or Vanilla JS | Lightweight, widely understood, easy for contributors |
| Styling | Tailwind CSS | Fast to build, responsive by default, minimal custom CSS |
| Charts | Chart.js or Recharts | No dependencies on paid services, widely supported |
| Data Storage | Browser localStorage | Zero backend, private by default, no accounts needed |
| Hosting (default) | GitHub Pages | Free, built into GitHub, automatic deploy on push |
| Hosting (alt) | Netlify / Vercel | One-click deploy, free tier, beginner-friendly |
| Currency | `Intl.NumberFormat` API | Native browser support, no library needed |

### 5.2 Deployment Options for Non-Technical Users

**Option A — Use the hosted demo (zero effort)**  
Use the live demo hosted on GitHub Pages. No setup required.

**Option B — Deploy your own copy via Netlify (5 minutes)**  
Click the **Deploy to Netlify** button at the top of this README. It forks the repo and deploys your own private instance in one step. Your data stays in your browser.

**Option C — Run locally (no internet required)**  
Download the built app as a single HTML file. Open it in any browser. No installation, no terminal, no server.

### 5.3 Data Architecture

- All budget data stored in `localStorage` as a single JSON object
- Structure: `{ year, currency, household, categories[], months[] }`
- Export/import via JSON download — acts as a manual backup
- No personally identifiable data ever leaves the user's browser
- Budget data persists across browser sessions automatically

---

## 6. Default Budget Categories

All categories are fully configurable — rename, add, remove, or hide any item to fit your household.

| Category Group | Default Line Items |
|---|---|
| 💵 **Income** | Wages & Salary, Freelance / Side Income, Investment Returns, Benefits, Gifts Received, Other |
| 🏦 **Savings** | Emergency Fund, Retirement / Pension, Investment Account, Education Fund, Other Savings |
| 🏠 **Home** | Mortgage / Rent, Electricity & Gas, Council Tax / Local Tax, Water, Internet, Phone, Maintenance, Other |
| 🛒 **Daily Living** | Groceries, Clothing, Dining Out, Personal Care, Cleaning, Other |
| 👶 **Children** | Childcare / Nursery, School Fees, Baby Supplies, Children's Clothing, Medical, Toys & Activities, Other |
| 🚗 **Transport** | Fuel, Public Transport, Car Insurance, Road Tax, Servicing & Repairs, Other |
| 🏥 **Health** | Prescriptions & Medicines, GP / Dentist / Optician, Gym / Health Club, Vitamins & Supplements, Other |
| 🛡️ **Insurance** | Home Contents, Building, Life, Vehicle, Health, Other |
| 📚 **Education** | Tuition / Courses, Books & Materials, Professional Development, Other |
| 🎁 **Charity & Gifts** | Charitable Donations, Religious Giving, Gifts to Family, Other |
| 💳 **Obligations** | Credit Card Repayments, Loan Repayments, Finance Agreements, Legal Fees, Other |
| 📱 **Subscriptions** | Streaming Services, Software & Apps, Magazines, Club Memberships, Other |
| 🎭 **Entertainment** | Hobbies, Sports & Recreation, Cinema & Events, Books, Other |
| 🗂️ **Miscellaneous** | Holidays & Travel, TV Licence, Other |

---

## 7. Open Source & Contributor Guidelines

### 7.1 Licence

FamilyBudget is released under the **MIT Licence**. Anyone may use, fork, modify, and redistribute the code for any purpose, including commercially, with attribution.

### 7.2 Contribution Structure

- `CONTRIBUTING.md` — step-by-step guide for first-time contributors
- Issues labelled **`good first issue`** for easy entry points
- Pull request template with checklist (tests, accessibility, responsive check)
- Discussion board for feature proposals and community feedback

### 7.3 Coding Conventions

- Components kept small and single-purpose (easier to review)
- No third-party APIs — keeps the project dependency-light
- **Accessibility-first:** all interactive elements must be keyboard navigable and screen-reader friendly
- **Mobile-responsive:** all views must render cleanly on 320px–1440px screens
- **i18n ready:** all user-facing strings in a single locale file

### 7.4 Roadmap Governance

Roadmap is managed via GitHub Projects. The maintainer reviews and triages issues weekly. Community-voted features (via reactions) are prioritised for each quarterly release cycle.

---

## 8. Success Metrics

| Metric | Target (6 months) | How to Measure |
|---|---|---|
| GitHub Stars | 100+ stars | GitHub repo insights |
| Forks | 25+ forks | GitHub repo insights |
| Community Contributors | 5+ external PRs merged | GitHub pull requests |
| Setup completion rate | >80% of users complete setup wizard | In-app analytics (opt-in only) |
| Time to first budget | <10 minutes from landing page | User testing sessions |
| Accessibility score | 100 on Lighthouse accessibility | Automated CI check |

---

## 9. Release Plan

| Version | Target | Scope |
|---|---|---|
| **v0.1** | Month 1 | Project scaffold, GitHub repo, README, `CONTRIBUTING.md`, guided setup wizard, static category structure |
| **v0.2** | Month 2 | Monthly budget grid (12 months), income & expense entry, localStorage persistence, basic summary view |
| **v0.3** | Month 3 | Budget vs. actual tracking, over/under indicators, running balance, monthly dashboard cards |
| **v1.0** | Month 4 | Charts (category pie, annual bar), multi-currency, bill split calculator, CSV export, GitHub Pages deploy |
| **v1.1** | Month 5–6 | Nursery/childcare calculator, PDF export, copy-previous-month, accessibility audit, community feedback |

---

## 10. Design Principles

These principles guide all product and engineering decisions.

### Zero technical debt by design
No backend. No database. No paid services. If a feature requires a server, it belongs on the roadmap — not v1.

### Configurable, not prescriptive
The app ships with sensible defaults for UK families, but every category, label, currency, and household member is configurable. The tool should adapt to the user, not the other way around.

### Privacy by default
All data lives in the user's browser. Nothing is ever transmitted to a server without explicit user action (e.g. export). No telemetry without opt-in.

### Designed for real life
Families don't have identical financial structures. The app must handle irregular income, variable expenses, dual incomes, single incomes, childcare costs, and one-off items without breaking.

### Built for contribution
Clear code structure, well-documented components, and a welcoming contributor experience are first-class features — not afterthoughts.

---

<div align="center">
  <sub>Built with ❤️ for families everywhere · <a href="https://github.com/tadeniran121/familybudget">github.com/tadeniran121/familybudget</a></sub>
</div>
