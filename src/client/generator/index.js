import { config } from "../config.js";
import { events } from "./events.js";

/* 初期化 */
const init = (() => {
  const skillItem = document.getElementsByClassName('skill_item');
  const mainList = document.getElementById('main_list');
  const subList = document.getElementById('sub_list');
  
  // イベント
  for (let i = 0; i < skillItem.length; i++) skillItem[i].addEventListener('click', events.clickSkillItem); // スキルアイテムクリックイベント
  
  document.getElementById('create').addEventListener('click', () => events.getSkillCardData());             // 画像ダウンロードイベント
  document.getElementById('blocker').addEventListener('click', events.clickBlocker);                        // ブロッカークリックイベント
  document.getElementById('modal_close').addEventListener('click', events.clickBlocker);                    // モーダル閉クリックイベント

  // ソート設定
  Sortable.create(mainList, { animation: config.animationTime });
  Sortable.create(subList, { animation: config.animationTime });
})();