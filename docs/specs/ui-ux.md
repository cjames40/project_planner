# UI/UX Specification
# Architect Project Planner

| Field | Value |
|-------|-------|
| Version | 0.1 |
| Status | Draft |
| Last Revised | 2026-03-24 |

---

## 1. Design Principles

1. **Content over chrome.** Minimal UI decoration. The architect's content
   fills the screen.
2. **Chat is the primary input.** Forms exist for review and correction,
   not as the primary data entry path.
3. **Structured output is always visible.** As the chat populates elements,
   the plan view updates in real time. Users are never wondering "did that
   get saved?"
4. **Keyboard-first.** Power users can navigate the entire application
   without a mouse.
5. **Dark mode default.** Architects work in code editors and terminals;
   dark mode is the default with light mode available as a toggle.
6. **Opinionated about architecture.** UI labels, empty states, and agent
   prompts use architectural vocabulary (NFR, ADR, constraint) without
   explanation.

---

## 2. Layout Architecture

### 2.1 Top-Level Shell

```
┌─────────────────────────────────────────────────────────┐
│  App Shell (full viewport height, no scroll)            │
│                                                         │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   Sidebar    │  │       Main Area                  │ │
│  │  (240px)     │  │   (flex, fills remaining width)  │ │
│  │              │  │                                  │ │
│  │  App logo    │  │  [Project view]                  │ │
│  │              │  │  or                              │ │
│  │  + New       │  │  [Welcome / empty state]         │ │
│  │    Project   │  │                                  │ │
│  │              │  │                                  │ │
│  │  Project     │  │                                  │ │
│  │  list        │  │                                  │ │
│  └──────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

The sidebar is collapsible (toggle button at top-right of sidebar).
Keyboard: `Cmd/Ctrl + \`.

### 2.2 Project View: Split Panel Layout

When a project is selected, the Main Area splits into two panels:

```
┌──────────────────────────────────────────────────────────┐
│  Main Area                                               │
│                                                          │
│  ┌────────────────────┐ │ ┌──────────────────────────┐  │
│  │   Plan Panel       │ │ │     Chat Panel           │  │
│  │  (default 40%)     │ │ │    (default 60%)         │  │
│  │                    │ │ │                          │  │
│  │  [ Scope ]         │ │ │  Chat history            │  │
│  │  [ Approach ]      │ │ │  (scrollable, anchored   │  │
│  │  [ Risks ]         │ │ │   to bottom)             │  │
│  │  [ Opportunities ] │ │ │                          │  │
│  │  [ ADRs ]          │ │ │  Proposed element cards  │  │
│  │  [ TODOs ]         │ │ │  (when agent extracts)   │  │
│  │                    │ │ │                          │  │
│  │  [tab content]     │ │ │  ─────────────────────   │  │
│  │                    │ │ │  [message input]         │  │
│  └────────────────────┘ │ └──────────────────────────┘  │
│              draggable divider                           │
└──────────────────────────────────────────────────────────┘
```

Split ratio is adjustable by dragging the divider.
Keyboard: `Cmd/Ctrl + Shift + [` / `]` to adjust by 10%.

---

## 3. Sidebar Specification

### 3.1 New Project Button

- Positioned at the top of the sidebar, below the app logo.
- Label: `+ New Project`
- Keyboard shortcut: `Cmd/Ctrl + N`
- Action: Opens the New Project Modal.

### 3.2 Project List

- Projects displayed in reverse chronological order by `updatedAt`.
- Each entry shows:
  - Project name (truncated at 28 chars with ellipsis; full name in tooltip on hover).
  - Project type badge (small, muted label: "Greenfield", "Migration", etc.).
  - Completeness dot (gray = 0–39%, amber = 40–69%, blue = 70–89%, green = 90–100%).
- Active project is highlighted with a distinct background.
- Hover: reveals a three-dot menu for Archive and Delete actions.
- Right-click context menu: Archive, Duplicate (post-MVP), Delete.
- A filter input appears at the top of the list when there are more than
  5 projects. Filters by project name in real time (case-insensitive).

### 3.3 New Project Modal

Triggered by "+ New Project" button or `Cmd/Ctrl + N`.

Fields:
1. **Project Name** (required, text input, autofocused, max 120 chars)
2. **Project Type** (required, segmented control or select:
   Greenfield / Migration / Modernization / Integration / Platform / Other)
3. **Description** (optional, textarea, max 500 chars, character counter)
4. **Client / Organization** (optional, text input)

Actions:
- **Create Project** (primary, disabled until name + type are filled)
- **Cancel** (secondary)

On create:
1. Project and Plan are saved.
2. Modal closes.
3. New project is selected in the sidebar.
4. Plan panel shows Scope tab in empty state.
5. Chat panel opens and the agent sends an onboarding message automatically.

---

## 4. Chat Panel Specification

### 4.1 Chat History Area

- Scrollable list of messages, anchored to bottom (auto-scrolls on new messages).
- **User messages**: right-aligned, distinct background color.
- **Assistant messages**: left-aligned, default background.
- **System/status messages**: centered, muted style (e.g., "3 elements updated to plan.").
- Timestamps displayed on hover over a message.
- Messages longer than 10 lines are truncated with a "Show more" expand toggle.
- Code blocks within assistant messages are syntax-highlighted.

### 4.2 Proposed Element Cards

When the agent extracts structured data, it surfaces "proposed element cards"
inline in the chat, directly below the assistant message that generated them.

Card anatomy:
```
┌─────────────────────────────────────────────────────┐
│  [RISK]                                             │
│                                                     │
│  Title: Third-party API instability                 │
│  Category: integration                              │
│  Likelihood: high  |  Impact: major  |  Score: 12   │
│  Mitigation: Implement circuit breaker pattern      │
│                                                     │
│  [Edit]  [Accept]  [Reject]                         │
└─────────────────────────────────────────────────────┘
```

- Multiple cards can appear in a single message.
- Cards are rendered before the message's follow-up text (if any).
- **Accept**: immediately commits the element to the plan. Card shows a
  checkmark confirmation.
- **Edit**: expands the card into an inline form pre-populated with
  extracted values. User modifies fields, clicks "Save" to commit.
- **Reject**: dismisses the card. The agent is informed via system context
  on the next turn so it doesn't re-propose the same element.
- Pending cards (not yet resolved) have a highlighted border.
- After all cards in a message are resolved, a status line appears:
  "3 elements added to plan."

### 4.3 Message Input

- Multiline textarea that grows up to 5 lines, then scrolls internally.
- **Send**: `Enter` key or send icon button.
- **New line**: `Shift + Enter`.
- Character limit: 4000 (counter appears when > 3500 characters entered).
- Disabled with a loading indicator while the agent is streaming a response.
- Placeholder text is contextual and rotates based on plan completeness:
  - (on new project) "Tell me about the project you're planning..."
  - (scope started, no risks) "What are the key risks you're worried about?"
  - (risks logged, no approach) "What architectural approach are you considering?"
  - (approach defined, no ADRs) "What key decisions have you made or are you facing?"

### 4.4 Agent Behavior

**Onboarding (automatic on new project):**
The agent sends a first message immediately on project creation, without
waiting for the user to speak. The message acknowledges the project type
and asks for a high-level overview.

**Questioning strategy by project type:**

| Project Type | Opening focus |
|---|---|
| `greenfield` | Vision, team size, constraints, key NFRs |
| `migration` | Current state pain points, target state, what's staying vs. moving |
| `modernization` | What's being modernized and why, strangler fig vs. rewrite consideration |
| `integration` | Systems involved, data flows, ownership, SLA dependencies |
| `platform` | Internal consumers, golden path vision, self-service goals |

**Gap detection:**
After 5+ user messages, the agent periodically checks completeness. If key
sections are empty, it surfaces a prompt: "I notice you haven't captured any
NFRs yet — would you like to talk through performance and availability
requirements?"

**Confidence threshold:**
The agent only proposes elements it can extract with sufficient confidence.
If uncertain about a field, it asks a clarifying question rather than
guessing. Users should never have to reject a large proportion of proposals.

### 4.5 Chat Session Management

A project can have multiple chat sessions (e.g., an initial scoping session,
a later risk deep-dive, a follow-up after stakeholder feedback).

- **Session dropdown**: at the top of the chat panel, a dropdown shows all
  sessions for this project. Each entry displays:
  - Session label (auto-generated from the first user message, truncated to
    40 chars; editable by double-clicking).
  - Timestamp of last activity.
  - Count of elements extracted in that session.
- **Active session** is highlighted in the dropdown.
- **"+ New Session"** button at the bottom of the dropdown creates a fresh
  session. The agent sends a new onboarding message referencing the current
  plan state (not repeating the project-type intro).
- Switching sessions loads the full message history of the selected session.
  The plan panel does not change (it always reflects the full plan regardless
  of which session is active).
- Keyboard shortcut: `Cmd/Ctrl + Shift + S` to open the session dropdown.
- A new session is auto-created when a project is first opened.

### 4.6 Offline Chat Behavior

When the application detects loss of network connectivity:

- A yellow banner appears at the top of the chat panel:
  **"Chat unavailable — you're offline."**
- The message input is disabled with a tooltip: "Reconnect to use chat."
- The plan panel remains fully functional — all reading, editing, and
  saving of plan elements works offline (data is in local SQLite).
- When connectivity is restored, the banner auto-dismisses with a brief
  "Back online" confirmation that fades after 3 seconds.
- Messages are **not** queued while offline. If a user types a message and
  sends it during a brief network interruption, an inline error appears:
  "Message failed to send. [Retry]" with a retry button.
- Network detection uses the `navigator.onLine` API supplemented by a
  periodic ping to the configured LLM provider health endpoint.

---

## 5. Plan Panel Specification

### 5.1 Navigation Tabs

```
[ Overview ]  [ Scope ]  [ Approach ]  [ Risks (4) ]  [ Opportunities (2) ]  [ ADRs (3) ]  [ TODOs ]
```

- Active tab underlined/highlighted.
- List-type elements (Risks, Opportunities, ADRs, TODOs) show a count badge.
- Each tab shows a completeness dot matching the same color scale as the sidebar.
- Keyboard: `Cmd/Ctrl + 0` for Overview, `Cmd/Ctrl + 1` through `6` for remaining tabs.

### 5.2 Scope Tab

Sections displayed in order:

1. **Problem Statement** — editable inline paragraph (click to edit).
2. **Solution Summary** — editable inline paragraph.
3. **Assumptions** — editable bulleted list.
4. **In Scope** — card list, each card shows description + category badge.
5. **Out of Scope** — card list, each card shows description + rationale (italicized).
6. **Stakeholders** — table: name, role, type badge, influence, interest, primary concern. Expand row for full detail and communication needs.
7. **Integration Points** — table: system name, direction badge, criticality badge, status badge, protocol. Expand row for full detail.
8. **Constraints** — card list grouped by type (Technical / Business / Regulatory / Resource / Time). Each card shows title, source, negotiability badge.

All sections have a `+ Add` button. Cards/rows support inline editing (click
field to edit, `Enter` or click away to save).

### 5.3 Approach Tab

1. **Strategy Summary** — editable paragraph.
2. **Architectural Style** — editable select (from enum) + rationale paragraph.
3. **Principles** — list of cards (title + description).
4. **Architectural Patterns** — expandable cards. Collapsed: name + component tags. Expanded: description, tradeoffs, alternatives, linked ADRs.
5. **NFRs** — table grouped by category. Columns: title, target, priority badge. Expand row for full detail, rationale, verification approach, linked risks.
6. **Technology Choices** — table grouped by category. Columns: name, rationale (truncated). Expand row for alternatives considered.

### 5.4 Risks Tab

A risk register view:

- Sortable, filterable table.
- Columns: title, category badge, likelihood, impact, risk score (colored pill), status badge, owner.
- Risk score color: red ≥ 16, amber 8–15, green < 8 (on 1–25 scale).
- Filter controls: by status, by category, by score range. Filters are
  persistent within the session.
- Click a row to expand inline: full description, mitigation strategy,
  mitigation status, contingency plan, review date, linked elements.
- Bulk status update via checkbox selection (e.g., mark multiple as "accepted").

### 5.5 Opportunities Tab

Card grid layout (2 columns on wide screen, 1 column on narrow).

Each card shows: title, category badge, value statement (truncated to 2 lines),
effort estimate badge, status badge.

Click card to expand for full detail: description, prerequisites, linked risks,
status rationale.

### 5.6 ADRs Tab

Chronological list of ADR entries. Each row shows: sequence label (ADR-001),
title, driver type badge, status badge, decision date.

Click a row to open the **ADR Detail View** — a full-panel overlay:

```
┌─────────────────────────────────────────────────────────┐
│  ADR-001: Use PostgreSQL as primary data store          │
│  Status: Accepted  |  Date: 2026-03-20  |  [Edit]       │
├─────────────────────────────────────────────────────────┤
│  Context                                                │
│  [context text]                                         │
│                                                         │
│  Problem Statement                                      │
│  [problem statement text]                               │
│                                                         │
│  Options Considered                                     │
│  ✓ PostgreSQL  [pros/cons]                              │
│    MongoDB     [pros/cons]                              │
│    DynamoDB    [pros/cons]                              │
│                                                         │
│  Decision: PostgreSQL                                   │
│  Rationale: [rationale text]                            │
│                                                         │
│  Positive Consequences / Trade-offs Accepted            │
│  Review Triggers                                        │
│                                                         │
│  Linked: Constraints · NFRs · Risks                     │
└─────────────────────────────────────────────────────────┘
```

`+ New ADR` button opens the ADR structured form (can also be populated
from chat). The form enforces the 2-option minimum before allowing
`proposed` status.

### 5.7 Inline Editing Behavior

- All text fields: click to edit, `Enter` or click away to save.
- Edits are auto-saved 1 second after the user stops typing (debounced).
- A subtle "Saved ✓" indicator appears and fades after 2 seconds.
- Tabs with unsaved changes show a dot indicator.
- Navigating away with unsaved changes shows a confirmation dialog.

### 5.8 Plan Overview Tab

The Overview tab is the **default tab** when a project is opened. It provides
an at-a-glance view of plan health and completeness.

Layout:
```
┌─────────────────────────────────────────────────────────┐
│  Plan Overview                          Score: 62/100   │
│                                         [In Progress]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Scope           ████████░░░░  72%                      │
│    ✓ Problem statement    ✓ In-scope items (5)          │
│    ✓ Stakeholders (3)    ✗ No out-of-scope items        │
│    ✗ No integration points                              │
│                                                         │
│  Approach        ████░░░░░░░░  35%                      │
│    ✓ Strategy summary    ✗ No NFRs defined              │
│    ✗ No patterns         ✗ No technology choices        │
│                                                         │
│  Risks           ██████████░░  85%                      │
│    ✓ 4 risks logged      ✓ 3/4 have mitigations        │
│                                                         │
│  Opportunities   ██████░░░░░░  50%                      │
│    ✓ 2 opportunities     ✗ None accepted or deferred    │
│                                                         │
│  ADRs            ████████████ 100%                      │
│    ✓ 2 ADRs              ✓ All have ≥ 2 options         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Each section row is clickable — navigates to the corresponding tab.
- Incomplete items (✗) are styled as actionable links. Clicking one either
  navigates to the relevant tab section or opens an "+ Add" form.
- The overall score and label ("Early Draft", "In Progress", "Substantial",
  "Complete") are shown prominently at the top right.
- The tab label in the navigation is `Overview` and sits before `Scope`:
  `[ Overview ] [ Scope ] [ Approach ] ...`
- Keyboard: `Cmd/Ctrl + 0` for Overview (tabs shift: 1=Scope, 2=Approach, etc.)

### 5.9 Completeness Score Detail

Clicking the completeness dot anywhere it appears (sidebar project list,
Overview tab header) opens a **popover** showing the weighted breakdown:

| Component | Weight | Status |
|-----------|--------|--------|
| Problem statement | 10/10 | ✓ Complete |
| In-scope items (≥ 3) | 5/5 | ✓ 5 items |
| Out-of-scope items (≥ 1) | 0/5 | ✗ None |
| Stakeholders (≥ 2) | 8/8 | ✓ 3 stakeholders |
| Integration points (≥ 1) | 0/5 | ✗ None |
| ... | ... | ... |

- Incomplete rows are highlighted and show what's needed.
- The popover has a "Show in plan" link on each row to jump to the
  relevant section.
- On the Overview tab, this breakdown is shown inline (no popover needed).

---

## 6. Interaction Flows

### 6.1 New Project Flow

```
User clicks "+ New Project"
  → Modal opens (autofocus on name field)
  → User enters name, selects type (e.g., "Migration"), adds description
  → Clicks "Create Project"
  → Project saved, modal closes
  → Project appears in sidebar (active)
  → Plan panel shows Scope tab (empty state with prompt)
  → Chat panel opens with agent onboarding message:
    "Welcome! I see you're working on a migration project. Let's build
     out your plan. Can you start by describing the current system and
     what's driving the migration?"
  → User begins typing
```

### 6.2 Chat-to-Element Flow

```
User: "We're worried about the legacy payment gateway — it has no SLA
       and has gone down twice this year."
  → Message appears (right-aligned)
  → Agent streams response
  → Stream completes; 2 proposed element cards appear:

    [RISK] Third-party payment gateway unreliability
    Category: vendor  |  Likelihood: high  |  Impact: major
    Mitigation: Add circuit breaker; evaluate alternative providers
    [Edit] [Accept] [Reject]

    [INTEGRATION POINT] Legacy Payment Gateway
    Direction: outbound  |  Criticality: critical  |  Status: confirmed
    Description: Processes all payment transactions
    [Edit] [Accept] [Reject]

  → User clicks "Accept" on Risk → Risk added, Risks(1) badge appears
  → User clicks "Edit" on Integration Point
    → Inline form opens pre-populated
    → User sets protocol: "SOAP" and owner: "Payments Team"
    → Clicks "Save"
    → Integration point added, Scope tab updates
  → Status: "2 elements added to plan."
```

### 6.3 ADR Creation via Chat

```
User: "We need to decide whether to use PostgreSQL or MongoDB for our
       customer data store."
  → Agent asks clarifying questions about access patterns, scale, team expertise
  → After 2–3 exchanges, agent proposes an ADR draft card:

    [ADR DRAFT]
    Title: Choose primary customer data store
    Driver: nfr-driven
    Options:
      PostgreSQL — relational, ACID, strong ecosystem (pros/cons)
      MongoDB — flexible schema, horizontal scaling (pros/cons)
    [Edit] [Accept] [Reject]

  → User clicks "Edit", fills in decision outcome and rationale
  → ADR created as ADR-001, status: draft
  → User opens ADR detail view to add review triggers and link NFRs
```

### 6.4 Export Flow

```
User opens project menu (three-dot on sidebar entry or plan panel header)
  → Selects "Export as Markdown"
  → Export service generates Markdown document
  → Browser download dialog opens
    Filename: "payment-platform-migration-plan-2026-03-24.md"
```

---

## 7. Empty States

| Tab | Empty State Message | Primary Action |
|-----|---------------------|----------------|
| Overview | "Your plan is empty. Start a conversation in the chat to begin." | — |
| Scope | "Start by telling the agent about your project in the chat." | — |
| Approach | "Describe your architectural strategy in the chat, or add elements manually." | `+ Add Approach` |
| Risks | "No risks logged yet. Tell the agent what keeps you up at night about this project." | `+ Add Risk` |
| Opportunities | "No opportunities captured. What could be improved beyond the core scope?" | `+ Add Opportunity` |
| ADRs | "No architecture decisions recorded. Every decision worth making is worth documenting." | `+ New ADR` |
| TODOs | "No open items." | `+ Add TODO` |

---

## 8. Keyboard Shortcuts Reference

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + N` | New Project |
| `Cmd/Ctrl + \` | Toggle sidebar |
| `Cmd/Ctrl + 0` | Switch to Overview tab |
| `Cmd/Ctrl + 1` | Switch to Scope tab |
| `Cmd/Ctrl + 2` | Switch to Approach tab |
| `Cmd/Ctrl + 3` | Switch to Risks tab |
| `Cmd/Ctrl + 4` | Switch to Opportunities tab |
| `Cmd/Ctrl + 5` | Switch to ADRs tab |
| `Cmd/Ctrl + 6` | Switch to TODOs tab |
| `Cmd/Ctrl + ,` | Open Settings |
| `Cmd/Ctrl + Shift + S` | Open chat session dropdown |
| `Cmd/Ctrl + Shift + E` | Export current project |
| `Enter` | Send chat message |
| `Shift + Enter` | New line in chat input |
| `Cmd/Ctrl + Shift + [` | Narrow plan panel by 10% |
| `Cmd/Ctrl + Shift + ]` | Widen plan panel by 10% |
| `Escape` | Close modal / cancel inline edit |

---

## 9. Settings Panel

Accessible via the gear icon at the bottom of the sidebar, or `Cmd/Ctrl + ,`.
Opens as a modal overlay.

### 9.1 LLM Provider Configuration

```
┌─────────────────────────────────────────────────────────┐
│  Settings                                        [×]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LLM Provider                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Anthropic ▾]                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  API Key                                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  sk-ant-•••••••••••••••••••••••••  [Show] [Test]│    │
│  └─────────────────────────────────────────────────┘    │
│  ⚠ API key is stored in your browser's local storage.   │
│    It is not encrypted and is accessible to scripts     │
│    running on this origin. Do not use on shared devices. │
│                                                         │
│  Model                                                  │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [Claude Sonnet 4.6 (Recommended) ▾]           │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Status: ✓ Connected (tested 2 seconds ago)             │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Appearance                                             │
│  Theme: [Dark ▾]                                        │
│                                                         │
│                                  [Cancel]  [Save]       │
└─────────────────────────────────────────────────────────┘
```

**Provider dropdown**: Anthropic, OpenAI, Google AI, Mistral, Groq, Custom
(shows a base URL field when selected).

**API Key field**:
- Masked by default (bullet characters). "Show" toggles visibility.
- "Test" sends a minimal API request to validate the key. Shows a spinner
  while testing, then ✓ "Connected" or ✗ "Failed: [error message]".
- Key is saved to `localStorage` (not to SQLite plan database).

**Model dropdown**: Populated based on the selected provider. Shows commonly
used models. Default: the provider's recommended general-purpose model.

**Validation**:
- "Save" is disabled until both provider and API key are filled.
- If the test fails, a warning appears but the user can still save (they
  may be offline or the provider may have temporary issues).

### 9.2 First-Run Experience

On first launch (no API key configured):
1. The app opens with a welcome screen instead of the normal layout.
2. Welcome screen explains the app and has a prominent "Configure LLM" button.
3. Clicking it opens the Settings modal focused on the LLM section.
4. After saving a valid API key, the welcome screen transitions to the
   normal layout with the sidebar and an empty project list.
