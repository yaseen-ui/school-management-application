# 🏪 School Store Module — Design Document

## Overview
A complete store system for schools to manage and sell **individual products** and **kits (templates/groups of products)** to students and external customers. Admin places orders on behalf of customers. Supports pending fulfillment, dues tracking, and returns/exchanges.

---

## Core Entities

### 1. Store Categories
- User-created groupings (e.g., "Accessories", "Books", "Uniforms", "Stationery", "Lab Equipment")
- Fully dynamic — admin can create any category

### 2. Products (Individual Items)
- Each product belongs to a category
- Examples: Tie, Badge, Belt, ID Card, Physics Textbook, Chemistry Lab Manual
- Each product has a **base price**
- Products can be sold individually anytime (no annual restriction)
- Products can be marked as **General** (available to all sections) or assigned to **specific sections**
- Each product has a **stock quantity** for tracking

### 3. Kits (Templates / Groups of Products)
- A kit is **NOT a stock item** — it's a **template** or a **group of products**
- When a user adds a kit to the cart, it **expands into its individual products** (grouped by a `kitReferenceId`)
- Example: "Class 10 Annual Academic Kit" = Physics Textbook × 1 + Chemistry Textbook × 1 + Tie × 1 + Badge × 1
- **Kit price = auto-calculated** as sum of (item price × quantity) for all items in the kit
- **Snapshotted pricing** — when a kit is created, product details (name, price, category) are copied into the kit item. Changing the product's price later does NOT affect existing kits.
- Kits can be assigned to **specific sections**
- Full CRUD supported — items can be added/removed from a kit later

### 4. Orders
- Placed by admin on behalf of a student or external customer
- Can contain individual products AND/OR kit-expanded items
- When a kit is added to cart → it expands into individual products, each with a `kitReferenceId` to group them
- Tracks pricing breakdown: `actualTotalAmount`, `discountAmount`, `totalAmount`, `offeredAmount`
- Supports **student** and **external** customer types
- Order items are **snapshotted** at order time (product name, price)

### 5. Pending Items (Missing/Delayed Fulfillment)
- When submitting an order, if some products are out of stock, they become **pending items**
- System displays which products are unavailable and asks user to proceed
- User can choose to **still book the order** — pending items are tracked separately
- Each pending item has an `isPaid` flag — user can pay for pending items and collect later
- Status: `pending` → `collected`

### 6. Dues (Short Payments)
- When a customer pays less than the total bill amount (e.g., bill is ₹1,200 but paid ₹900)
- The remaining ₹300 is tracked as a **due**
- Supports partial payments against the due
- Status: `pending` → `partially_paid` → `settled` → `written_off`

### 7. Returns / Exchanges
- Individual products from an order can be **returned/exchanged**
- On return, the refund amount is tracked and stock is added back
- Each order item has `isReturned` and `returnedAt` fields

---

## Key Business Rules

| Rule | Implementation |
|---|---|
| **Kit is a template, not stock** | Kit expands into individual products when added to cart |
| **Kit grouping in cart** | All items from a kit share a `kitReferenceId` |
| **Kit item deselection** | User can unselect/remove individual items from a kit in the cart |
| **Kit price auto-calculation** | Sum of (item price × quantity) for all items in the kit |
| **Snapshotted pricing** | Kit items copy productName, categoryName, unitPrice at creation time |
| **Stock check on submit** | System checks all products for availability before order submission |
| **Pending items** | If products are unavailable, user can still book; pending items tracked with `isPaid` flag |
| **Dues tracking** | If user pays less than total, remaining amount tracked in `StoreDue` |
| **Returns/Exchanges** | Individual products can be returned; refund amount tracked; stock restored |
| **Individual item sales** | Products can be purchased standalone anytime |
| **Section-based applicability** | Products can be "General" or assigned to specific sections |
| **No annual restriction** | Items can be purchased multiple times in the same year |
| **External customers** | Products can be sold to non-students (external customers) |

---

## Admin Screens

| Screen | Purpose |
|---|---|
| **Categories** | List / Create / Edit / Delete categories |
| **Products** | List / Create / Edit / Delete products with pricing + section applicability |
| **Kits** | List / Create (bulk table UI) / Edit / Delete kits |
| **Orders** | Place order for a student/external (select products or kits) |
| **Pending Items** | View pending items across orders, mark as collected, track payment |
| **Dues** | View dues, record payments against dues |
| **Returns** | Process returns/exchanges, track refunds |
| **Student Purchase History** | View a student's purchases & kit breakup for their academic year |

---

## Data Model (Prisma)

### Models

```
StoreCategory
  - id, tenantId, name, description, sortOrder, isActive

StoreProduct
  - id, tenantId, categoryId, name, description, basePrice, isActive
  - isGeneral (boolean — true = available to all sections)
  - stockQuantity (int — available stock count)

StoreProductSection  (only when isGeneral = false)
  - id, tenantId, productId, sectionId

StoreKit  (template/group — NOT a stock item)
  - id, tenantId, name, description, totalPrice (pre-calculated), isActive

StoreKitItem  (snapshotted from products at kit creation)
  - id, tenantId, kitId, productId?, productName, categoryName, unitPrice, quantity, totalPrice

StoreKitSection
  - id, tenantId, kitId, sectionId

StoreOrder
  - id, tenantId, enrollmentId?, academicYearId?, orderDate
  - totalAmount, actualTotalAmount, discountAmount, offeredAmount?
  - customerName?, customerPhone?, customerType (student/external)
  - status (confirmed/partially_delivered/delivered/cancelled)

StoreOrderItem  (snapshotted at order time)
  - id, tenantId, orderId, productId?, kitId?, productName, unitPrice, quantity, totalPrice
  - kitReferenceId? (groups items from same kit expansion)
  - isReturned, returnedAt

StorePendingItem
  - id, tenantId, orderItemId, productId?, productName, quantity
  - status (pending/collected), collectedAt
  - isPaid, paidAt

StoreDue
  - id, tenantId, orderId, enrollmentId?
  - customerName, customerPhone, customerType
  - totalDueAmount, paidAmount, status (pending/partially_paid/settled/written_off)

StoreDuePayment
  - id, tenantId, dueId, amount, paymentDate, paymentMethod, transactionId

StoreReturn
  - id, tenantId, orderItemId, productId?, productName, quantity, refundAmount, reason, returnedAt
```

---

## API Endpoints

```
STORE CATEGORIES
  GET    /api/store/categories          — List all categories
  POST   /api/store/categories          — Create category
  GET    /api/store/categories/:id      — Get category
  PUT    /api/store/categories/:id      — Update category
  DELETE /api/store/categories/:id      — Delete category

STORE PRODUCTS
  GET    /api/store/products            — List all products
  POST   /api/store/products            — Create product
  GET    /api/store/products/:id        — Get product
  PUT    /api/store/products/:id        — Update product
  DELETE /api/store/products/:id        — Delete product

STORE KITS
  GET    /api/store/kits                — List all kits (with items & price breakup)
  POST   /api/store/kits                — Create kit (bulk: items array)
  GET    /api/store/kits/:id            — Get kit details with items
  PUT    /api/store/kits/:id            — Update kit info
  DELETE /api/store/kits/:id            — Delete kit
  POST   /api/store/kits/:id/items      — Add item to kit
  PUT    /api/store/kits/:id/items/:itemId — Update kit item
  DELETE /api/store/kits/:id/items/:itemId — Remove item from kit

ORDERS
  GET    /api/store/orders              — List all orders
  POST   /api/store/orders              — Place order (student + items/kits)
  GET    /api/store/orders/:id          — Get order details
  PUT    /api/store/orders/:id/status   — Update order status

PENDING ITEMS
  GET    /api/store/pending-items       — List all pending items
  PUT    /api/store/pending-items/:id/collect — Mark as collected

DUES
  GET    /api/store/dues                — List all dues
  POST   /api/store/dues                — Create due
  GET    /api/store/dues/:id            — Get due details
  POST   /api/store/dues/:id/payments   — Record payment against due

RETURNS
  POST   /api/store/returns             — Process a return/exchange
  GET    /api/store/returns             — List all returns

STUDENT PURCHASES
  GET    /api/store/students/:enrollmentId/purchases — Get student's purchase history
```
