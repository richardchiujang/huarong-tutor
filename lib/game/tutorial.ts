import { Piece } from './types';

export interface TutorialPhase {
  id: number;
  title: string;
  goal: string;
  keyIdea: string;
  observation: string; // "What to look at"
  trap: string;
  minStep: number;
  maxStep: number;
}

export const TUTORIAL_PHASES: TutorialPhase[] = [
  {
    id: 0,
    title: "序章：整軍待發",
    goal: "將兩個空格匯聚在一起。",
    keyIdea: "「空格」是調度兵馬的空間。將散落的空格合二為一，才能騰出足夠的空間移動大將。",
    observation: "觀察棋盤上散落的空格，它們限制了你的調度能力。",
    trap: "切勿隨意移動士兵，首要目標是讓兩個空格相鄰，形成可利用的「虛空」。",
    minStep: 0,
    maxStep: 10,
  },
  {
    id: 1,
    title: "第一章：五虎開道",
    goal: "為五虎上將騰出移動空間。",
    keyIdea: "小兵擋道，大將難行。需將中路的小兵移開，讓關羽、張飛等大將有迴旋餘地。",
    observation: "專注於中路，士兵們正堵塞著縱向的通道。",
    trap: "以為移動了幾步就沾沾自喜。若底部的士兵未清，曹操依然寸步難行。",
    minStep: 11,
    maxStep: 20,
  },
  {
    id: 5,
    title: "間章：微步調息",
    goal: "掌握 [Ctrl] 鍵的精細操作。",
    keyIdea: "有時「滑到底」會破壞佈局。按住 [Ctrl] 鍵再按方向鍵，可以精確地只走一步。",
    observation: "當你需要保留特定的空格位置時，使用微步操作。",
    trap: "習慣了滑動到底，可能會在需要保留空隙時不小心把路堵死。",
    minStep: 21,
    maxStep: 30,
  },
  {
    id: 2,
    title: "第二章：以退為進",
    goal: "調離底部的守軍。",
    keyIdea: "欲進先退，此乃兵法之詭道。有時必須將曹操暫時「上移」，才能騰出空間調動底層的關羽或士兵。",
    observation: "橫刀立馬的關羽或底部的士兵，是此刻最大的路障。",
    trap: "執著於讓曹操一直往下衝。這是最常見的迷思，不退這一步，便無法解開底部的死結。",
    minStep: 31,
    maxStep: 50,
  },
  {
    id: 3,
    title: "第三章：左右開弓",
    goal: "建立曹操的逃脫路徑。",
    keyIdea: "障礙已動，通道將成。利用兩側空間，為曹操開闢一條直通底部的坦途。",
    observation: "留意棋盤兩側是否已形成可供曹操通過的縱向通道。",
    trap: "在關鍵時刻又將士兵移回中央，再次堵住了曹操的生路。",
    minStep: 51,
    maxStep: 70,
  },
  {
    id: 4,
    title: "第四章：華容突圍",
    goal: "護送曹操抵達出口。",
    keyIdea: "最後的精確調度。每一步都至關重要，勝利就在眼前。",
    observation: "出口近在咫尺，只需最後幾個精準的滑塊移動。",
    trap: "因勝利在望而心浮氣躁，算錯了最後的步數。",
    minStep: 71,
    maxStep: 90,
  },
];

export function getCurrentPhase(stepCount: number): TutorialPhase {
  // Find the phase that matches the step count, or the last one if over
  const phase = TUTORIAL_PHASES.find(p => stepCount >= p.minStep && stepCount <= p.maxStep);
  if (phase) return phase;
  
  if (stepCount > 90) {
    return {
      ...TUTORIAL_PHASES[4],
      title: "終章：千鈞一髮",
      goal: "一鼓作氣，衝出重圍！",
      trap: "步數雖已超過兵法推演的八十一著，但只要能突圍，便是勝利！",
      maxStep: 999,
    };
  }
  
  return TUTORIAL_PHASES[0];
}

export function getFeedback(stepCount: number, pieces: Piece[]): string | null {
  return null;
}
