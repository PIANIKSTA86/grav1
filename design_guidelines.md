# Design Guidelines for Gravi SaaS

## Design Approach

**Selected Approach:** Design System - Material Design adapted for enterprise financial software
**Justification:** Gravi is a utility-focused, data-intensive enterprise application requiring consistency, clarity, and professional credibility for handling financial and property management operations.

## Core Design Principles

1. **Professional Trustworthiness** - Clean, structured layouts that communicate reliability
2. **Information Clarity** - Clear visual hierarchy for complex financial data
3. **Efficient Workflows** - Streamlined navigation between accounting, billing, and property modules
4. **Data-First Design** - Tables and forms optimized for rapid data entry and review

---

## Typography

**Primary Font:** Inter (via Google Fonts)
**Secondary Font:** Roboto Mono (for financial figures, account codes)

**Scale:**
- Page Titles: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Subsection Headers: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Table Data: text-sm (14px)
- Labels/Metadata: text-xs font-medium uppercase tracking-wide (12px)
- Financial Figures: font-mono text-base font-semibold

---

## Layout System

**Spacing Units:** Consistently use Tailwind spacing: 2, 3, 4, 6, 8, 12, 16
- Component padding: p-4, p-6
- Section spacing: space-y-6, space-y-8
- Card padding: p-6
- Form fields: space-y-4
- Table cell padding: px-4 py-3

**Grid System:**
- Container: max-w-7xl mx-auto px-4
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
- Form layouts: Two-column grid (grid-cols-1 lg:grid-cols-2 gap-6)
- Tables: Full-width with horizontal scroll on mobile

---

## Component Library

### Navigation
**Sidebar Navigation (Desktop):**
- Fixed left sidebar (w-64)
- Grouped module sections with icons
- Active state with subtle background
- Collapsible sub-menus for nested modules (Contabilidad > Plan de Cuentas, Comprobantes)

**Top Bar:**
- Suscriptor selector (dropdown showing current copropiedad)
- User profile menu (top-right)
- Breadcrumb navigation below for context
- Period selector for accounting operations

### Cards & Containers
**Dashboard Metric Cards:**
- Shadow elevation: shadow-sm
- Rounded corners: rounded-lg
- Border: border border-gray-200
- Structure: Icon + Label + Large Value + Trend indicator

**Data Tables:**
- Striped rows for readability (even rows slightly darker)
- Sticky header on scroll
- Row hover state
- Action buttons (Edit/Delete) aligned right
- Pagination controls at bottom
- Search/filter bar above table

### Forms
**Form Structure:**
- Clear section divisions with headings
- Required field indicators (*)
- Field grouping with subtle borders or background
- Inline validation messages
- Primary action buttons: bottom-right
- Cancel/secondary: bottom-left

**Input Components:**
- Standard height: h-10
- Border: border border-gray-300 focus:ring-2
- Rounded: rounded-md
- Select dropdowns with search for long lists (terceros, cuentas)
- Date pickers for períodos contables
- Numeric inputs right-aligned for financial values

### Buttons
**Primary:** Solid background, medium weight
**Secondary:** Outlined with border
**Danger:** For delete operations
**Sizes:** px-4 py-2 (standard), px-3 py-1.5 (small for table actions)

### Modals & Dialogs
- Overlay backdrop: backdrop-blur-sm
- Modal width: max-w-2xl for forms, max-w-4xl for detailed views
- Header with title + close button
- Footer with action buttons (right-aligned)

### Data Visualization
**Dashboard Charts:**
- Bar charts for monthly comparisons (ingresos vs gastos)
- Line charts for trends
- Pie charts for budget distribution by partidas
- Use clear labels and legends

---

## Module-Specific Patterns

### Dashboard
- 4-column metric grid: Total Unidades, Saldo Tesorería, Cartera Vencida, Presupuesto Ejecutado
- Chart section below metrics
- Recent activity list (últimos comprobantes, facturas pendientes)

### Contabilidad (Accounting)
- Two-pane layout: Plan de Cuentas tree (left), Details/Transactions (right)
- Account code displayed prominently in monospace
- Debit/Credit columns clearly labeled
- Running balance column

### Facturación (Billing)
- Invoice list with status badges (Pagada, Pendiente, Vencida)
- Generate invoice form with unit/concept selection
- PDF preview pane

### Unidades & Terceros
- Master-detail layout
- Quick filters: By type, active status
- Bulk action toolbar when items selected

---

## Accessibility & States

- Focus states: ring-2 ring-offset-2
- Disabled states: opacity-50 cursor-not-allowed
- Error states: Red border + icon + message
- Success notifications: Toast in top-right
- Loading states: Spinner overlays for async operations

---

## Responsive Strategy

**Desktop-First Approach** (primary use case)
- Sidebar collapses to hamburger on tablet/mobile
- Tables scroll horizontally on mobile
- Dashboard cards stack vertically on mobile (grid-cols-1)
- Forms maintain two-column on tablet, single-column on mobile

---

## Images

**Dashboard Hero (Optional):**
- Small banner image showing modern condominium/building (1200x300px)
- Positioned at top of dashboard with overlay gradient
- Text overlay: "Bienvenido a [Nombre Copropiedad]"

**Empty States:**
- Illustration-based empty states for modules without data
- "No hay unidades registradas" with call-to-action button

**Login Page:**
- Split screen layout
- Left side: Brand illustration/photo of building management (50% width)
- Right side: Login form (centered, max-w-md)