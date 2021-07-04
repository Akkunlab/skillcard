import { starSvg, config } from "../config.js";
import { events } from "./events.js";

const objects = {
    
  createStar(skillItem) { // 星作成
    const starDiv = document.createElement('div');
    const crossMarkSpan = document.createElement('span');
      
    for (let i = 0; i < config.maxStarCounts; i++) starDiv.insertAdjacentHTML('beforeend', starSvg);

    crossMarkSpan.setAttribute('class', 'skill_item_delete');
    crossMarkSpan.textContent = '✖️';
    crossMarkSpan.addEventListener('click', () => events.deleteSkillItem(skillItem)); // スキル閉クリックイベント
    starDiv.setAttribute('class', 'skill_item_star');
    skillItem.insertBefore(crossMarkSpan, skillItem.firstElementChild);
    skillItem.appendChild(starDiv);
    skillItem.setAttribute('value', String(config.maxStarCounts));
  },

  deleteStar(skillItem) { // 星削除
    skillItem.removeChild(skillItem.firstElementChild);
    skillItem.removeChild(skillItem.lastElementChild);
  },

  createModal(type, data, item) { // モーダル作成
    const modal = document.getElementById('modal');
    const content = document.getElementById('modal_content');
    const button = document.createElement('button');

    const list = {

      star() { // スキルレベル変更モーダル
        let starItem, starLevel, list;
        const starDiv = document.createElement('div');
        const value = Number(item.getAttribute('value'));
        
        starDiv.setAttribute('class', 'modal_star');
        button.addEventListener('click', () => events.clickBlocker({ target: { tagName: 'DIV' } }));  // モーダルボタンクリックイベント
      
        for (let i = 1; i <= config.maxStarCounts; i++) {

          // starItem作成
          starItem = document.createElement('div');
          starItem.setAttribute('class', 'modal_star_item');
          starItem.setAttribute('value', String(i));
          starItem.addEventListener('click', e => events.changeSkillLevel(e, item)); // 星クリックイベント
          starLevel = document.createElement('p');
          starLevel.textContent = i;
          starLevel.setAttribute('class', 'modal_star_level');
          starItem.insertAdjacentHTML('beforeend', starSvg);
          starItem.appendChild(starLevel);
          
          // 星の色設定
          list = starItem.firstElementChild.classList;

          if (i <= value) { // 色つける
            if (list.contains('is-false')) list.remove('is-false');
          } else { // 色つけない
            if (!list.contains('is-false')) list.add('is-false');
          }

          starDiv.appendChild(starItem);
        }

        return starDiv;
      },

      code() { // コード生成モーダル
        const codePre = document.createElement('pre');
        const code = document.createElement('code');
        codePre.setAttribute('class', 'modal_code_block');
        code.setAttribute('class', 'modal_code');
        code.innerHTML = item;
        codePre.appendChild(code);
        button.addEventListener('click', events.copyHTML); // モーダルボタンクリックイベント

        return codePre;
      }

    };
      
    document.getElementById('modal_title').textContent = data.title;
    content.innerHTML = '';
    content.appendChild(list[type]());

    // ボタン追加
    modal.lastElementChild.remove();
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'modal_button');
    button.textContent = data.button;
    modal.appendChild(button);

    // モーダル表示
    events.clickBlocker({ target: { tagName: 'DIV' }})
  }

};

export { objects };
