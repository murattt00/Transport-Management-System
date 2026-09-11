# 🚚 Transport & Fleet Management System (TMS)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg?logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, responsive, end-to-end web platform for logistics providers, fleet managers, and freight customers. It streamlines shipment tracking, cargo order creation, vehicle fleet operations, inventory control, and financial reporting.

---

## 📌 Platform Overview

The Transport Management System (TMS) solves operational logistics bottlenecks by separating administrative workflows from customer-facing operations:
- **For Dispatchers & Fleet Managers:** Full visibility over vehicle fleets, driver allocations, inventory hubs, and revenue/expense ledgers.
- **For Customers & Shippers:** Intuitive portal to quote and create new cargo shipments, print waybills, and track delivery status in real-time.

---

## ✨ Features & Modules

### 🏢 1. Administrator & Dispatcher Portal (`/admin`)
- **📊 Executive Dashboard (`admin.html`):** High-level KPIs, active shipment counts, on-time delivery percentages, and critical alerts.
- **🚛 Fleet Management (`fleets.html`):** Vehicle registry (trucks, vans, trailers), plate tracking, maintenance schedules, and driver assignments.
- **📦 Warehouse & Inventory (`inventory.html`):** Cargo storage management, shelf/hub allocations, and parcel categorization.
- **💰 Financial Ledger (`financial.html`):** Invoice generation, freight fee calculations, operational expense logs, and profit margins.
- **📈 Analytics & Reports (`reports.html`):** Exportable logistics performance metrics, fuel efficiency logs, and monthly delivery volume trends.

### 👤 2. Customer & Shipper Portal (`/customer`)
- **📦 Create Shipment (`create_shipment.html`):** Step-by-step form to calculate shipping fees based on origin, destination, cargo weight, and parcel dimensions.
- **🔍 Real-Time Package Tracking (`track_shipment.html`):** Enter a tracking ID to view the package journey (Ordered → Dispatched → In-Transit → Delivered).
- **📋 Order History (`customer.html`):** View past transactions, download invoices, and re-order frequent routes.

### 🌐 3. Public Web Pages
- Modern landing page with interactive service offerings (`index.html`).
- Company background & certifications (`about.html`).
- Direct customer support contact form (`contact.html`).
- Role-based login and authentication screen (`login.html`).

---

## 🏗️ Architecture & Navigation Flow

```
                     Public Landing Page (index.html)
                                   │
                                   ▼
                            Login Screen (login.html)
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
     [Administrator Portal]                   [Customer Portal]
     ├── Dashboard (admin.html)               ├── Dashboard (customer.html)
     ├── Fleet Tracker (fleets.html)          ├── New Shipment (create_shipment.html)
     ├── Inventory (inventory.html)           └── Track Cargo (track_shipment.html)
     ├── Financials (financial.html)
     └── Reports (reports.html)
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Markup & Structure** | Semantic HTML5 |
| **Styling & Responsive Layout** | Custom CSS3 (CSS Grid, Flexbox, Mobile-Responsive Media Queries) |
| **Client-Side Dynamics** | Vanilla JavaScript (ES6+, DOM Manipulation, Local Storage caching) |
| **Icons & Typography** | FontAwesome / Material Symbols, Modern sans-serif typography |

---

## 📂 Project Structure

```
Transport-Management-System/
├── index.html            # Public homepage and service catalog
├── about.html            # Company background & logistics network info
├── contact.html          # Support and contact form
├── login.html            # Authentication gateway
├── admin/                # Administrator & Dispatcher workspace
│   ├── admin.html        # Main admin operations dashboard
│   ├── fleets.html       # Fleet and driver roster
│   ├── inventory.html    # Warehouse storage and cargo registry
│   ├── financial.html    # Financial summaries and freight billing
│   └── reports.html      # Analytical charts and performance reports
├── customer/             # Customer-facing self-service portal
│   ├── customer.html     # Customer account overview
│   ├── create_shipment.html # Freight quoting & booking form
│   └── track_shipment.html  # Live shipment tracking interface
├── style/                # Global and portal-specific stylesheets
├── js/                   # Client-side validation, tracking, and calculator logic
└── README.md             # Project documentation
```

---

## 🚀 Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/murattt00/Transport-Management-System.git
   cd Transport-Management-System
   ```
2. **Launch the application:**
   - Double-click `index.html` to open it in any browser, or
   - Launch with VS Code **Live Server** extension for local hosting (`http://localhost:5500`).

---