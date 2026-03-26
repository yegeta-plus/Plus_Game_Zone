# Software Design Document: Plus Game Zone

## 1. Introduction
This document provides a detailed technical design for the **Plus Game Zone** financial management application. It serves as a blueprint for the implementation, detailing the internal structure, data flows, and technical decisions.

## 2. System Architecture

### 2.1 High-Level Architecture
The application follows a **Single Page Application (SPA)** architecture, where all logic and rendering occur on the client side.

- **Presentation Layer**: React components styled with Tailwind CSS.
- **Business Logic Layer**: React hooks (`useState`, `useEffect`, `useMemo`) managing the application state and business rules.
- **Data Access Layer**: A thin wrapper around `localStorage` for persistence and `fetch` for external API calls (Gemini).
- **External Services**: Google Gemini API for financial analysis.

### 2.2 Component Hierarchy
```
App
├── Layout
│   ├── Sidebar (Navigation)
│   ├── Header (User Profile, Masking, Theme, Lock)
│   └── Main Content Area (Active Tab)
├── Dashboard (Charts & Summaries)
├── TransactionList (Income/Expense views)
├── WalletView (Balance management)
├── EqubTracker (ROSCA management)
├── LoanManager (Debt tracking)
├── GrowthManager (Goals & Planned payments)
├── ChatCenter (Internal messaging)
├── AccountingManager (Reporting & Approvals)
├── AssetsManager (Inventory)
├── UsersManager (Partner management)
└── Interaction Overlays
    ├── JoystickMenu (Quick Actions)
    ├── SecurityOverlay (Lock Screen)
    └── Modals (Transaction, Equb, Loan, Goal, Confirmation)
```

---

## 3. Data Design

### 3.1 Persistence Strategy
Data is persisted in the browser's `localStorage` using specific keys prefixed with `plus_`.

| Key | Data Type | Description |
|-----|-----------|-------------|
| `plus_users` | `User[]` | List of authorized partners. |
| `plus_transactions` | `Transaction[]` | Financial ledger records. |
| `plus_balances` | `WalletBalances` | Current totals per payment method. |
| `plus_equbs` | `EqubGroup[]` | ROSCA group data. |
| `plus_loans` | `Loan[]` | Active and past loans. |
| `plus_goals` | `Goal[]` | Financial targets. |
| `plus_theme` | `'light' \| 'dark'` | User interface preference. |

### 3.2 State Synchronization
A central `useEffect` in `App.tsx` monitors all primary data states and synchronizes them to `localStorage` on every change.
```typescript
useEffect(() => {
  localStorage.setItem('plus_transactions', JSON.stringify(transactions));
  // ... other states
}, [transactions, ...]);
```

---

## 4. Component Design

### 4.1 App.tsx (Main Controller)
- **Responsibility**: Manages global state, authentication, and routing (tab switching).
- **Key States**: `currentUser`, `activeTab`, `isLocked`, `isMasked`.
- **Handlers**: `handleTransactionSubmit`, `logAction`, `handleJoystickAction`.

### 4.2 Dashboard.tsx
- **Responsibility**: Aggregates ledger data into visual insights.
- **Logic**: Calculates "Burn Rate", "Runway", and "Net Growth" using `useMemo` for performance.
- **Visualization**: Uses `recharts` (AreaChart, BarChart) for trend analysis.

### 4.3 SecurityOverlay.tsx
- **Responsibility**: Prevents unauthorized access to the active session.
- **Logic**: Captures 4-digit PIN input and validates against `currentUser.pin`.
- **UI**: Full-screen backdrop with high z-index.

---

## 5. Interface Design

### 5.1 External API: Gemini Service
The application integrates with the Google Gemini API to provide financial advice.

- **Service**: `services/geminiService.ts`
- **Input**: A summarized version of the `Transaction[]` array.
- **Prompt Engineering**:
  ```text
  Analyze these transactions for a business called Plus Game Zone. 
  Identify trends, potential risks, and provide 3 actionable strategic tips.
  ```
- **Response**: Markdown-formatted text displayed in a confirmation modal.

### 5.3 Specialized Services

#### 5.3.1 Drive Service (`services/driveService.ts`)
- **Responsibility**: (Future) Integration with Google Drive for backup and restore of the `localStorage` data.
- **Status**: Currently a placeholder for future cloud sync capabilities.

#### 5.3.2 SMS Simulator (`components/SmsSimulator.tsx`)
- **Responsibility**: Simulates incoming financial SMS notifications (e.g., Telebirr, CBE) to test the automated transaction parsing logic.
- **Logic**: Uses regex to extract amount, vendor, and reference from simulated SMS text.

#### 5.3.3 Camera Scanner (`components/CameraScanner.tsx`)
- **Responsibility**: Provides a UI for capturing receipts or QR codes.
- **Implementation**: Uses `navigator.mediaDevices.getUserMedia` to access the device camera.
- **Status**: Integrated into the Joystick Menu for rapid sales/expense entry.

---

## 6. Security Design

### 6.1 Authentication
- **Initial Entry**: Users must match an email and PIN stored in the `users` state.
- **Session Locking**: The `isLocked` state can be triggered manually or by system events, requiring a PIN re-entry without clearing the application state.

### 6.2 Authorization (RBAC)
Components check `currentUser.role` to determine visibility and editability:
- `MEMBER` role hides "Delete" and "Edit" buttons in most managers.
- `SUPER_ADMIN` is required for the `UsersManager` and `AccountingManager`.

---

## 7. Implementation Details

### 7.1 Build Configuration
- **Vite**: Configured to handle TypeScript and React JSX.
- **Environment Variables**: `GEMINI_API_KEY` is injected at build time via `vite.config.ts`.

### 7.2 Styling
- **Tailwind CSS**: Uses custom theme extensions for `3xl` and `4xl` border radii.
- **Dark Mode**: Implemented using the `dark` class on the `html` element, toggled by the `theme` state.

### 7.3 Animations
- **Motion**: Used for tab transitions, modal entries, and notification slides to provide a high-end "app-like" feel.
