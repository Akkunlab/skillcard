import { socket, config, skillCardData } from "../config.js";
import { objects } from "./objects.js";

const events = {

  clickSkillItem(e) { // スキル要素クリック時
    const skillItem = e.currentTarget;
    const sectionName = skillItem.parentNode.className.replace('_list','');
    const mainList = document.getElementById('main_list');
    const subList = document.getElementById('sub_list');

    // スキルアイテムの移動
    if (e.target.className === 'skill_item_delete') return; // 閉ボタンは除外
    if (sectionName === 'skill' && mainList.childElementCount <= config.maxItemCounts) { // スキル一覧 -> スキルテーブル_メイン
      mainList.firstElementChild.style.display = 'none';
      objects.createStar(skillItem);
      mainList.appendChild(skillItem);
      skillItem.classList.toggle('is-hide');
      setTimeout(() => skillItem.classList.toggle('is-hide'), config.animationTime);
    } else if (sectionName === 'skill' && subList.childElementCount <= config.maxItemCounts) { // スキル一覧 -> スキルテーブル_サブ
      subList.firstElementChild.style.display = 'none';
      objects.createStar(skillItem);
      subList.appendChild(skillItem);
      skillItem.classList.toggle('is-hide');
      setTimeout(() => skillItem.classList.toggle('is-hide'), config.animationTime);
    } else if (sectionName === 'skill_table_main' || sectionName === 'skill_table_sub') {　 // スキルテーブル -> スキル一覧
      objects.createModal('star', {
        title: `${skillItem.getElementsByClassName('skill_item_name')[0].textContent} のスキルレベル`,
        button: 'OK'
      }, skillItem);
    }
  },

  deleteSkillItem(skillItem) { // スキルテーブルからスキル削除
    const skillList = document.getElementById('skill_list');
    const mainList = document.getElementById('main_list');
    const subList = document.getElementById('sub_list');

    // スキルテーブルが0アイテムの時
    if (!(mainList.childElementCount - 2) || !(subList.childElementCount - 2)) {  // '-2'は初期アイテムを除外
      let list = mainList.childElementCount - 2 ? subList : mainList;
      list.firstElementChild.style.display = 'unset';
      objects.deleteStar(skillItem);
      skillList.appendChild(skillItem);
      return;
    }

    // アニメーション
    skillItem.classList.toggle('is-hide');
    setTimeout(() => {
      objects.deleteStar(skillItem);
      skillList.appendChild(skillItem);
      skillItem.classList.toggle('is-hide');
    }, config.animationTime);
  },

  clickBlocker(e) { // ブロッカークリック時
    if (e.target.tagName === 'DIV' || e.target.tagName === 'SPAN') {
      document.getElementById('blocker').classList.toggle('is-show');
      document.getElementById('modal').classList.toggle('is-show');
      document.getElementsByTagName('main')[0].classList.toggle('is-blur');
      document.getElementsByTagName('header')[0].classList.toggle('is-blur');
    }
  },

  changeSkillLevel(e, item) { // スキルレベルクリック時
    let list;
    const modalItem = document.getElementsByClassName('modal_star_item');
    const skillItem = item.lastElementChild.children;
    const value = e.currentTarget.getAttribute('value');
    item.setAttribute('value', value);

    // 星の色設定
    for (let i = 1; i <= config.maxStarCounts; i++) {
      list = modalItem[i - 1].firstElementChild.classList;

      if (i <= Number(value)) { // 色つける
        if (list.contains('is-false')) {
          list.remove('is-false');
          skillItem[i - 1].classList.remove('is-false');
        }
      } else { // 色つけない
        if (!list.contains('is-false')) { 
          list.add('is-false');
          skillItem[i - 1].classList.add('is-false');
        }
      }
    }
  },

  getSkillCardData() { // スキルカードデータ取得
    let i;
    const mainArray = [];
    const subArray = [];
    const mainList = document.getElementById('main_list').children;
    const subList = document.getElementById('sub_list').children;

    // メインスキルリスト
    for (i = 1; i < mainList.length; i++) {
      mainArray.push({
        id: mainList[i].getAttribute('id'),                                                // itemのid
        displayName: mainList[i].getElementsByClassName('skill_item_name')[0].textContent, // itemの表示名
        value: mainList[i].getAttribute('value')                                           // itemのスキルレベル
      });
    }

    // サブスキルリスト
    for (i = 1; i < subList.length; i++) {
      subArray.push({
        id: subList[i].getAttribute('id'),                                                // itemのid
        displayName: subList[i].getElementsByClassName('skill_item_name')[0].textContent, // itemの表示名
        value: subList[i].getAttribute('value')                                           // itemのスキルレベル                                                            // itemのスキルレベル
      });
    }

    skillCardData.main = mainArray;
    skillCardData.sub = subArray;

    const json = JSON.stringify(skillCardData);
    const id = this.createId(config.randomId.length);
    const url = `${config.host}users?id=${id}`;
    const code = this.createHTML(url, mainArray, subArray);
    console.log(`Success! Your skill card url: ${url}`);

    // モーダル作成
    objects.createModal('code', {
      title: 'HTMLコードをコピー',
      button: 'コピー'
    }, code);
    
    // socket.io
    socket.emit("sendId", { parameter: id, skillcard: json });
  },

  createId(length) { // ランダムId生成
    const string = config.randomId.string;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += string[Math.floor(Math.random() * string.length)];
    }

    return result;
  },

  createHTML(url, mainArray, subArray) {// HTMLコードの作成
    const div = document.createElement('div');
    const iframe = document.createElement('iframe');

    iframe.setAttribute('src', url);
    iframe.setAttribute('width', '1000');
    iframe.style.width = '100%';
    iframe.style.height = '50vw';
    iframe.style.maxHeight = '400px';
    iframe.style.border = 'none';

    div.appendChild(iframe);
    this.createHTMLItem(div, mainArray);
    this.createHTMLItem(div, subArray);

    const code = div.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;');

    return code;
  },

  createHTMLItem(div, array) { // HTMLコード内のアイテムリストの作成
    let skillName, span, a, img, span_in;

    for (let i = 0; i < array.length; i++) {
      skillName = `skill:${array[i].id}`;
      span = document.createElement('span');
      span.style.padding = '0 10px';

      a = document.createElement('a');
      a.setAttribute('href', `https://sofuken.kibe.la/search?query=${skillName}`);

      img = document.createElement('img');
      img.setAttribute('width', '20');
      img.setAttribute('src', `${config.host}img/skill/${array[i].id}.svg`);

      span_in = document.createElement('span');
      span_in.textContent = skillName;
      span_in.style.display = 'none';

      a.appendChild(img);
      a.appendChild(span_in);
      span.appendChild(a);
      div.appendChild(span);
    }
  },

  copyHTML() { // HTMLコードのコピー
    const code = document.getElementsByClassName('modal_code')[0];
    const copied = document.getElementsByClassName('modal_alert')[0];
    const range = new Range();
    
    range.setStart(code, 0);
    range.setEnd(code, 1);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    document.execCommand('copy');

    // コピー完了のメッセージ
    copied.classList.toggle('is-show');
    setTimeout(() => copied.classList.toggle('is-show'), 1000);
  }

};

export { events };