# Feature Specification: Tool Development Request System

**Feature Branch**: `001-tool-dev-requests`  
**Created**: 2026-01-16  
**Status**: Draft  
**Input**: User description provided in prompt.

## User Scenarios & Testing *(mandatory)*

## User Story 1 - Submit Development Request (Priority: P1)

使用者希望能透過標準化表單申請工具開發，以便清楚傳達需求內容。

**Why this priority**: 這是系統的核心功能，沒有表單就無法建立需求單。

**Independent Test**: 使用者透過 Google SSO 登入後進入申請頁面，確認申請人資訊已自動帶入，填寫並送出表單，系統產生紀錄。

**Acceptance Scenarios**:

1. **Given** 使用者首次進入系統, **When** 點擊登入, **Then** 透過 Google SSO 完成驗證，無需輸入額外帳密。
2. **Given** 使用者進入申請表單頁面, **When** 頁面載入完成, **Then** 系統自動抓取 Google User Profile (Name, Email, Photo) 填入申請人欄位。
3. **Given** 使用者填寫完所有必填欄位 (工具名稱、需求說明、驗收標準), **When** 點擊送出按鈕, **Then** 系統顯示成功訊息，並將資料儲存至資料庫。

---

### User Story 2 - Dashboard & Status Tracking (Priority: P1)

使用者希望能透過視覺化排程表追蹤開發進度，並能依狀態篩選。

**Why this priority**: 提供透明化的進度資訊，減少溝通成本。

**Independent Test**: 進入儀表板頁面，能看到需求列表，且能透過標籤篩選不同狀態的單據。

**Acceptance Scenarios**:

1. **Given** 系統中有多筆不同狀態的需求單, **When** 使用者進入 Dashboard, **Then** 列表應預設依「申請日期」降序排列。
2. **Given** 使用者點選「待開發」標籤, **When** 篩選執行, **Then** 列表僅顯示狀態為「待開發」的項目。
3. **Given** 使用者輸入關鍵字搜尋, **When** 輸入完畢, **Then** 列表僅顯示工具名稱或申請人符合關鍵字的項目。
4. **Given** 使用者點擊任一列表項目, **When** 點擊後, **Then** 彈出 Modal 顯示該單據完整內容。

---

### User Story 3 - Admin Management (Priority: P1)

管理者需要審核單據、更新狀態及維護系統配置。

**Why this priority**: 確保需求的正確處理與系統運作。

**Independent Test**: 管理者登入後，能編輯單據的預計完成日期與狀態，並能更換 LOGO。

**Acceptance Scenarios**:

1. **Given** 管理者檢視一筆單據, **When** 編輯「討論結果」與「預計完成日期」並儲存, **Then** 資料更新成功。
2. **Given** 管理者欲變更開發狀態, **When** 切換狀態 (如從待開發轉為開發中), **Then** 狀態燈號隨之改變。
3. **Given** 管理者進入配置頁面, **When** 上傳新的 LOGO 圖片, **Then** 全站頂端 LOGO 更新顯示。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須提供申請表單，包含：
    - **紀錄編號**: 格式為 `REQ-YYYYMMDD-###` (例如 REQ-20260116-001)，每日流水號重置。需使用 Firestore Transaction 確保唯一性與連續性。
    - **申請日期**: 自動帶入當前時間。
    - **申請人/部門**: 申請人自動帶入 `user.displayName`；部門採「手動輸入 + 自動記憶」，首次輸入後儲存於 User Profile，下次自動帶入。
    - **工具名稱** (必填)、**需求說明** (必填)、**驗收標準** (必填)。
- **FR-002**: 系統必須支援 Dashboard 列表顯示，包含狀態燈號：黑(已取消)、灰(待開發)、紅(討論中)、橙(開發中)、綠(已開發)。
- **FR-003**: 系統必須提供快速篩選標籤 (Quick Filters) 及關鍵字搜尋功能。
- **FR-004**: 系統必須支援點擊列表項目後以 Modal 顯示完整詳情。
- **FR-005**: **身份驗證 (Auth)**: 必須整合 Firebase Auth 的 Google Provider，支援 Google SSO (Workspace/Gmail) 登入，無需額外帳密。
- **FR-006**: **權限管理 (RBAC)**:
    - **User**: 任何通過驗證的帳戶，僅能新增表單、檢視公開排程。
    - **Admin**: UID 存在於 Firestore `admin_list` 集合中的使用者，擁有後台管理按鈕與編輯權限。
- **FR-007**: **Admin 功能**:
    - 編輯單據時，「討論結果」與「預計完成日期」由唯讀轉為可編輯。
    - 僅 Admin 可刪除無效單據。
    - 可透過設定頁面更換系統 LOGO (URL 存於 Firebase Storage)。
- **FR-008**: **自動帶入**: 申請人欄位直接讀取 `user.displayName` 與 `photoURL`；部門欄位可選填或連動 Workspace (若可行)。

### Clarifications

### Session 2026-01-16
- Q: Authentication Method? → A: **Option C - Google SSO** (recommended).
    - 整合 Firebase Auth Google Provider。
    - 自動帶入 user info (Name, Email, Photo)。
    - 定義 Admin 權限依據 Firestore `admin_list`。
    - 內嵌於 AI 工具站，需確保無縫登入體驗。
- Q: Ticket Number Format? → A: **Option A - Strict Sequential**.
    - Format: `REQ-YYYYMMDD-###`.
    - Implementation: Firestore requires a counter document/collection to handle atomic increments.
- Q: Department Data Source? → A: **Option A - Manual + Auto-Save**.
    - User manually inputs department on first use.
    - System saves it to `users/{uid}` in Firestore.
    - Next time, frontend fetches and auto-fills.

### Non-Functional Requirements / UI/UX

- **NFR-001**: 視覺風格必須採用 **Liquid Glass / iOS 26.1 Style** (高透明度、背景模糊、流體漸層)。
- **NFR-002**: **內嵌適配**: 系統將內嵌於主站中，背景模糊 (backdrop-filter) 需與主站背景產生深度視覺連動。
- **NFR-003**: 背景需使用動態流體漸層 (Mesh Gradient)，色調為藍、紫、青色系。
- **NFR-004**: 卡片樣式需符合規範 (`rgba(255, 255, 255, 0.15)`, blur 20px)。
- **NFR-005**: 應用程式必須使用 React.js 或 Next.js 搭配 Tailwind CSS 開發。
- **NFR-006**: 資料庫必須使用 Firebase Firestore。

### Key Entities

- **Request (需求單)**: ticketNo, applyDate, applicant, department, toolName, description, criteria, adminNote, estimatedArrival, status, createdAt.
- **Config (系統配置)**: logoUrl.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 申請表單提交後，資料需在 2 秒內同步至 Dashboard 列表。
- **SC-002**: 應用程式在一般網路環境下 (4G/Wi-Fi)，首頁載入時間 (FCP) 應小於 1.5 秒。
- **SC-003**: 搜尋與篩選操作的響應時間應小於 200 毫秒。
- **SC-004**: 設計風格符合 Liquid Glass 規範，所有 Card 元件均具備 Backdrop Blur 效果。
