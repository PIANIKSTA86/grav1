# Design Guidelines for Gravi SaaS

## Design Approach

**Selected Approach:** Tabler.io-inspired Material Design for enterprise financial software
**Justification:** Gravi is a utility-focused, data-intensive enterprise application requiring a clean, modern interface similar to tabler.io with horizontal navigation and professional aesthetics.

## Core Design Principles

1. **Clean & Modern** - Flat design with subtle borders and minimal shadows
2. **Information Clarity** - Clear visual hierarchy for complex financial data
3. **Horizontal Navigation** - Top menu bar with dropdown modules
4. **Data-First Design** - Tables and forms optimized for rapid data entry and review

---

## Color Palette (Tabler-inspired)

### Primary Colors
- **Primary Blue:** #206bc4 (Main brand color)
- **Primary Hover:** #1a5ca8
- **Primary Light:** #ecf2f9

### Neutral Colors
- **Background:** #f4f6fa (Light gray background)
- **Card/Surface:** #ffffff
- **Border:** #e6e7e9 (Subtle borders)
- **Text Primary:** #1e293b
- **Text Secondary:** #64748b
- **Text Muted:** #94a3b8

### Status Colors
- **Success:** #2fb344
- **Warning:** #f59f00
- **Danger:** #d63939
- **Info:** #4299e1

---

## Typography

**Primary Font:** Inter (via Google Fonts)
**Secondary Font:** Roboto Mono (for financial figures, account codes)

**Scale:**
- Page Titles: text-2xl font-semibold (24px)
- Section Headers: text-lg font-semibold (18px)
- Subsection Headers: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Table Data: text-sm (14px)
- Labels/Metadata: text-xs font-medium (12px)
- Financial Figures: font-mono text-sm font-medium

---

## Layout System

**Spacing Units:** Consistently use Tailwind spacing: 2, 3, 4, 6, 8
- Component padding: p-4, p-6
- Section spacing: space-y-4, space-y-6
- Card padding: p-6
- Form fields: space-y-3
- Table cell padding: px-3 py-2

**Navigation:**
- Horizontal top navbar with logo left, menu center, user right
- Dropdown menus for module groups
- Breadcrumb navigation below header
- No sidebar - all navigation in horizontal header

**Grid System:**
- Container: container mx-auto px-4
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
- Form layouts: Two-column grid (grid-cols-1 lg:grid-cols-2 gap-4)
- Tables: Full-width with horizontal scroll on mobile

---

## Component Library

### Navigation
**Horizontal Top Bar:**
- Fixed top navigation bar
- Logo/brand on left
- Horizontal menu items in center with dropdown for submodules
- User profile, notifications, theme toggle on right
- White background with subtle bottom border

### Cards & Containers
**Dashboard Metric Cards:**
- Clean flat design
- Subtle border
- No shadow or minimal shadow
- Structure: Label + Large Value + Optional trend

**Data Tables:**
- Minimal borders
- Subtle row hover state
- Clean header styling
- Action buttons aligned right
- Pagination controls at bottom

### Forms
**Form Structure:**
- Clean section divisions
- Required field indicators (*)
- Inline validation messages
- Primary action buttons: right-aligned
- Cancel/secondary: left-aligned

**Input Components:**
- Standard height: h-9
- Border: border border-input
- Rounded: rounded-md
- Minimal styling, clean appearance

### Buttons
**Primary:** Solid background (#206bc4)
**Secondary:** Outlined with border
**Ghost:** No background, hover shows background
**Danger:** For delete operations (#d63939)
**Sizes:** h-9 px-4 (standard), h-8 px-3 (small)

---

## Module Organization

### Main Modules (Horizontal Menu)
1. **Dashboard** - Main overview
2. **Gestión** - Suscriptores, Unidades, Terceros
3. **Contabilidad** - Plan de Cuentas, Comprobantes, Períodos
4. **Operaciones** - Facturación, Tesorería, Nómina
5. **Administración** - Presupuestos, Activos Fijos, Exógena
6. **Copropiedad** - Zonas Comunes, Reservas, Comunicados

---

## Responsive Strategy

**Desktop-First Approach**
- Horizontal menu collapses to hamburger on mobile
- Tables scroll horizontally on mobile
- Dashboard cards stack vertically on mobile
- Forms maintain two-column on tablet, single-column on mobile