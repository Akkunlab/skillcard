/* 基本設定 */
const canvasWidth = 1000;
const skillItemSize = 100;
const skillItemHeight = 50;
const titleHeight = 50;
const textHeight = 20;
const units = 200;
const starSize = 30;
const itemPadding = 15;
const starURL = '../img/star.svg';
const starFalseURL = '../img/star_false.svg';

/* 初期化 */
const init = () => {
  const object = getSkillCardData();
  if (object) create.skillCard(object);
}

/* スキルカードデータ取得 */
const getSkillCardData = () => {
  const string = document.getElementById('value').innerHTML;
  const object = (new Function(`return${string}`))();

  return object;
}

/* スキルカード生成 */
const create = {

  skillCard(object) {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    this.title(context, 'メインスキル', 0);
    this.title(context, 'サブスキル', 1);
    this.main(context, object.main);
    this.sub(context, object.sub);
  },

  title(context, text, number) {
    context.font = `normal ${titleHeight - 20}px "Roboto", "Noto Sans JP", sans-serif`;

    const textWidth = context.measureText(text).width;
    const x = (canvasWidth - textWidth) / 2;
    const y = number * (units + titleHeight) + titleHeight - 20;
    
    context.fillText(text, x, y);
  },

  textRow(context, text, dx) {
    const x = (skillItemSize - context.measureText(text).width) / 2 + dx;
    const y = titleHeight + itemPadding;

    context.fillText(text, x, y);
  },

  main(context, object) {
    const width = canvasWidth / object.length;
    const padding = (width - skillItemSize) / 2;

    context.font = `normal ${textHeight}px "Roboto", "Noto Sans JP", sans-serif`;

    for (let i = 0; i < object.length; i++) {
      let x = i * width + padding;
      let y = titleHeight + itemPadding * 2;
      let image = new Image();
      image.src = `../img/skill/${object[i].id}.svg`;
      image.onload = () => context.drawImage(image, x, y, skillItemSize, skillItemSize);

      this.textRow(context, object[i].displayName, x);
      this.starRow(context, object[i].value, x);
    }
  },

  sub(context, object) {
    const x = canvasWidth / 4;
    context.font = `normal ${textHeight}px "Roboto", "Noto Sans JP", sans-serif`;

    for (let i = 0; i < object.length; i++) {
      let y = i * skillItemHeight + (units + skillItemHeight * 2 + itemPadding);
      context.fillText(object[i].displayName, x, y);
      this.starColumn(context,object[i].value, y);
    }
  },

  starRow(context, value, dx) {
    const width = skillItemSize / 3;
    const padding = (width - starSize) / 2;

    for (let i = 0; i < 3; i++) {
      let x = i * width + padding + dx;
      let y = titleHeight + skillItemSize + itemPadding * 2.5;
      let image = new Image();
      image.src = i < value ? starURL : starFalseURL;
      image.onload = () => context.drawImage(image, x, y, starSize, starSize);
    }
  },

  starColumn(context, value, dy) {
    const width = skillItemSize / 3;

    for (let i = 0; i < 3; i++) {
      let x = i * width + (canvasWidth* (2.5 / 4));
      let y = dy - textHeight;
      let image = new Image();
      image.src = i < value ? starURL : starFalseURL;
      image.onload = () => context.drawImage(image, x, y, starSize, starSize);
    }
  }

};

init(); // 初期化
