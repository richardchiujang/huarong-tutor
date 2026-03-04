<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 華容道 導師 (Huarong Tutor)

這是一個基於 Next.js 開發的經典智力遊戲「華容道」教學與對戰平台。玩家需要透過滑動棋子，將曹操移出出口。

## 🎮 遊戲特色

- **經典玩法**：1x1、2x1 (水平/垂直) 與 2x2 等多種塊狀棋子邏輯。
- **混合操作**：支援滑鼠點擊與鍵盤 WASD 操作。
- **智能移動**：內建「滑動到底」與「單步微調」兩種移動模式。
- **精美介面**：使用 Tailwind CSS 與 Framer Motion (motion/react) 打造流暢的動畫效果。

## 🕹️ 操作方式

遊戲中提供以下操作方式：

### 選取棋子
- 使用**滑鼠左鍵**點擊棋子進行選取（選中後會有藍色外框提示）。

### 移動控制 (WASD)
- **滑動到底 (預設)**：直接按 `W` `A` `S` `D` 鍵，棋子會沿著該方向自動滑動到最底部。
- **精確移動 (單步)**：**按住滑鼠左鍵不放**的同時按 `W` `A` `S` `D`，棋子每次只會移動一格。
- **方向鍵註記**：為確保操作手感，目前已將方向鍵功能移除，統一使用 `WASD` 進行控制。

## 🛠️ 技術棧

- **框架**：[Next.js 15+](https://nextjs.org/)
- **語言**：TypeScript
- **樣式**：Tailwind CSS / Lucide React
- **動畫**：[Framer Motion (motion/react)](https://motion.dev/)
- **元件**：Shadcn UI

## 🚀 快速啟動

**前置條件：** Node.js (推薦 v18+)

1. 安裝依賴項目：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 在瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 即可開始遊戲。

## 🏗️ 專案結構

- `app/`：Next.js 頁面與路由
- `components/`：React 元件 (GameBoard, GamePiece 等)
- `lib/game/`：遊戲核心邏輯 (計算移動、判斷碰撞、勝負判斷)
- `hooks/`：自定義 React Hooks
