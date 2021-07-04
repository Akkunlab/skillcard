const socket = io.connect();
const starSvg = '<svg class="star_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>';
const config = {
  maxStarCounts: 3,         // 最大の星数
  maxItemCounts: 5,         // 最大スキル数
  animationTime: 100,       // アニメーション時間
  randomId: {
    length: 50,                                                              // ランダムコード生成文字数
    string: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' // ランダムコード生成文字列
  },
  host: 'https://nitfc-skillcard.herokuapp.com/'
};
const skillCardData = {
  main: [],
  sub: []
};

export { socket, starSvg, config, skillCardData };