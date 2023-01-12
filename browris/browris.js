/**
 * browris ブラウリス
 * host: (any)
 */
(function() {
  let BLOCK_SIZE  =  16; // ブロックサイズ(px)
  let SPEED       = 500; // 落下スピード(ms)
  let BLOCK_NUM   =   0; // ブロック連番
  let CLEAR_LINES =   0; // クリア行数
  let WALL        =   0; // 壁数
  let COLS_COUNT;        // 列ブロック数
  let ROWS_COUNT;        // 行ブロック数
  let EX_MODE   = false; // 拡張モード
  let RAND_MODE = false; // ランダム位置モード

  // 次ミノ表示座標
  let NEXT_COORDINATE = {
    'x': 0,
    'y': 0,
  };

  // ブロック色
  const BLOCK_COLORS = [
    '#9DCCE0', // I型
    '#FFFF00', // O型
    '#A757A8', // T型
    '#0000FF', // J型
    '#FFA500', // L型
    '#00FF00', // S型
    '#FF0000', // Z型
    // 拡張モード
    '#40E0D0', // U型
    '#FF33FF', // V型
    '#FF99CC', // .型
  ];

  /**
   * セットアップクラス
   */
  class Setup
  {
    /**
     * URLパラメタセット
     */
    static initParams()
    {
      // URLパラメタセット
      const pairs = location.search.substring(1).split('&');
      let args = [];
      pairs.forEach(element => {
        const kv = element.split('=');
        args[kv[0]] = kv[1];
      });

      if ('c' in args) {
        COLS_COUNT = parseInt(args['c']);
      }
      if ('r' in args) {
        ROWS_COUNT = parseInt(args['r']);
      }
      if ('s' in args) {
        SPEED = parseInt(args['s']);
      }
      if ('b' in args) {
        BLOCK_SIZE = parseInt(args['b']);
      }
      if ('w' in args) {
        WALL = parseInt(args['w']);
      }
      if ('e' in args) {
        EX_MODE = args['e'] === '1';
      }
      if ('a' in args) {
        RAND_MODE = args['a'] === '1';
      }

      // ブラウザ幅・高さ
      const width  = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;

      // ブロック数
      if (!COLS_COUNT) {
        COLS_COUNT = Math.floor(width  / BLOCK_SIZE);
      }
      if (!ROWS_COUNT) {
        ROWS_COUNT = Math.floor(height  / BLOCK_SIZE);
      }

      console.log('ブラウザ表示域(px)', width + 'x' + height);
      console.log('ブロック(列x行)', COLS_COUNT + 'x' + ROWS_COUNT);
      console.log('落下スピード(msec)', SPEED);
      console.log('ブロックサイズ(px)', BLOCK_SIZE);
      console.log('デフォルト壁(行)', WALL);
      console.log('拡張モード', EX_MODE ? 'ON' : 'OFF');
      console.log('ランダム位置モード', RAND_MODE ? 'ON' : 'OFF');

      // 次ミノ表示座標
      NEXT_COORDINATE['x'] = width - 4.5 * BLOCK_SIZE - 10;
      NEXT_COORDINATE['y'] = 5;
    }

    /**
     * 初期処理
     */
    static init()
    {
      // 情報モーダル
      let html = '<style type="text/css">'
                  + '.info-area-window {'
                  + '  position:fixed;'
                  + '  top:0;'
                  + '  left:0;'
                  + '  display:flex;'
                  + '  justify-content:flex-start;'
                  + '  align-items:start;'
                  + '  width:100vw;'
                  + '  height:100vh;'
                  + '  background-color:rgba(0, 0, 0, 0.7);'
                  + '  backdrop-filter:blur(5px);'
                  + '  z-index:10000;'
                  + '}'
                  + '.info-area-window .content {'
                  + '  border-radius: 4px;'
                  + '  position:relative;'
                  + '  box-sizing:border-box;'
                  + '  margin:5px;'
                  + '  padding:3px;'
                  + '  color:#090815;'
                  + '  background-color:#706D6D;'
                  + '  text-align:right;'
                  + '}'
                  + '</style>'
                  + '<div class="info-area-window" id="info-area" aria-hidden="true">'
                  + '  <div class="content">'
                  + '    ' + COLS_COUNT + 'x' + ROWS_COUNT + '<br />'
                  + '    CL:<span id="clear-lines">0</span>'
                  + '  </div>'
                  + '</div>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      html = '<style type="text/css">'
           + '.result-modal {'
           + '  width:100vw;'
           + '  height:100vh;'
           + '  position:fixed;'
           + '  inset:0;'
           + '  margin:auto;'
           + '  display:flex;'
           + '  visibility:hidden;'
           + '  align-items: center;'
           + '  justify-content:center;'
           + '  z-index:11000;'
           + '}'
           + '.result-modal .content {'
           + '  border-radius: 4px;'
           + '  position:relative;'
           + '  box-sizing:border-box;'
           + '  margin:5px;'
           + '  padding:5px;'
           + '  color:#000000;'
           + '  background-color:#FFFFFF;'
           + '  text-align:center;'
           + '}'
           + '.result-modal .content h4 {'
           + '  margin:5px;'
           + '}'
           + '.result-modal .content .ttl {'
           + '  text-align:left;'
           + '}'
           + '.result-modal .content .cntt {'
           + '  text-align:right;'
           + '}'
           + '</style>'
           + '<div class="result-modal" id="result-modal" aria-hidden="true">'
           + '  <div class="content">'
           + '    <h4>browris</h4>'
           + '    <table border="0">'
           + '      <tr>'
           + '        <td class="ttl">画面サイズ</td>'
           + '        <td class="cntt" id="bscreen">100x50</td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">ブロックサイズ</td>'
           + '        <td class="cntt" id="bsize"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">デフォルト壁</td>'
           + '        <td class="cntt" id="bwall"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">拡張モード</td>'
           + '        <td class="cntt" id="ex-mode"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">ランダムモード</td>'
           + '        <td class="cntt" id="rand-mode"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">スピード(ms)</td>'
           + '        <td class="cntt" id="bspeed"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">経過時間</td>'
           + '        <td class="cntt" id="belapsed"></td>'
           + '      </tr>'
           + '      <tr>'
           + '        <td class="ttl">クリアライン数</td>'
           + '        <td class="cntt" id="clines"></td>'
           + '      </tr>'
           + '    </table>'
           + '  </div>'
           + '</div>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      // ブロックSVG
      html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
           + ' style="display:none;">'
           + '<symbol id="orgblock" viewbox="0 0 16 16">'
           + '<g>'
           + '<rect x="0" y="0" width="15" height="15" />'
           + '</g>'
           + '</symbol>'
           + '</svg>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      // 次ブロック背景SVG
      html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
           + ' style="display:none;">'
           + '<symbol id="orgbg" viewbox="0 0 16 16">'
           + '<g>'
           + '<rect x="0" y="0" width="16" height="16" />'
           + '</g>'
           + '</symbol>'
           + '</svg>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);
    }
  }

  /**
   * ゲームクラス
   */
  class Game
  {
    constructor()
    {
      console.log('ゲームスタート');

      Setup.initParams();
      Setup.init();

      this.startTime = new Date();
    }

    /**
     * ゲームの開始処理
     */
    start()
    {
      // フィールドとミノの初期化
      this.field = new Field();

      // デフォルト壁
      if (WALL > 0) {
        this.setWall();
      }

      // 最初のミノを読み込み
      this.popMino();

      // 初回描画
      this.nextBg();
      this.nextMino.drawNext();
      this.mino.draw();

      // 落下処理
      clearInterval(this.timer);
      this.timer = setInterval(() => this.dropMino(), SPEED);

      // キーボードイベントの登録
      this.setKeyEvent();
    }

    /**
     * デフォルト壁
     */
    setWall()
    {
      // 最下部から1行ずつブロックを生成する
      for (let i = ROWS_COUNT - 1; i >= ROWS_COUNT - WALL; i--) {
        // ブロック生成
        let wblocks = [];

        // 非ブロック数(1-2個)
        const nCnt = 1 + Math.floor(Math.random() * 2);

        // 非ブロック位置
        let nBlocks = [];
        for (let j = 0; j < nCnt; j++) {
          nBlocks.push(Math.floor(Math.random() * COLS_COUNT));
        }

        for (let j = 0; j < COLS_COUNT; j++) {
          if (!nBlocks.includes(j)) {
            const block = new Block(j, i, Math.floor(Math.random() * 10));
            block.draw();
            wblocks.push(block);
          }
        }

        this.field.blocks = this.field.blocks.concat(wblocks);
      }
    }

    /**
     * 次ブロック背景
     */
    nextBg()
    {
      const nextSize = 4.5 * BLOCK_SIZE;

      document.querySelector('body').insertAdjacentHTML('beforeend',
          '<svg viewBox="0 0 ' + nextSize + ' ' + nextSize + '"'
        + ' style="top: ' + NEXT_COORDINATE['y'] + 'px; left: ' + NEXT_COORDINATE['x'] + 'px;'
        + ' width: ' + nextSize + 'px; height: ' + nextSize + 'px;'
        + ' opacity: 1; position: fixed; z-index: 10000; fill: #706D6D;'
        + ' display: inline-block;">'
        + '<use xlink:href="#orgbg"></use>'
        + '</svg>'
      );
    }

    /**
     * 新しいミノを読み込む
     */
    popMino()
    {
      // console.log('Game.popMino');

      this.mino = this.nextMino ?? new Mino();
      this.mino.spawn();
      this.nextMino = new Mino();

      // ゲームオーバー判定
      if (!this.valid(0, 1)) {
        this.gameOver();
      }
    }

    /**
     * 終了処理
     */
    gameOver()
    {
      clearInterval(this.timer);

      console.log('ゲームオーバー');

      // 経過時間
      const endTime = new Date();
      const datet   = parseInt((endTime.getTime() - this.startTime.getTime()) / 1000);
      const hour    = parseInt(datet / 3600);
      const min     = parseInt((datet / 60) % 60);
      const sec     = datet % 60;
      const elapsed = hour + ':' + ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2);

      const bscreen  = COLS_COUNT + 'x' + ROWS_COUNT;
      const exMode   = EX_MODE   ? 'ON' : 'OFF';
      const randMode = RAND_MODE ? 'ON' : 'OFF';

      document.getElementById('bscreen').textContent = bscreen;
      document.getElementById('bsize').textContent = BLOCK_SIZE;
      document.getElementById('bwall').textContent = WALL;
      document.getElementById('ex-mode').textContent = exMode;
      document.getElementById('rand-mode').textContent = randMode;
      document.getElementById('bspeed').textContent = SPEED;
      document.getElementById('belapsed').textContent = elapsed;
      document.getElementById('clines').textContent = CLEAR_LINES.toLocaleString();

      console.log('経過時間:' + elapsed);
      console.log('クリアライン数:' + CLEAR_LINES.toLocaleString());

      // 結果モーダル表示
      const resultModal = document.getElementById('result-modal');
      resultModal.style.visibility = 'visible';
    }

    /**
     * ミノの落下処理
     */
    dropMino()
    {
      if (this.valid(0, 1)) {
        this.mino.y++;
        this.mino.draw();
        this.nextMino.drawNext();

      } else {
        // Minoを固定する（座標変換してFieldに渡す）
        this.mino.blocks.forEach(e => {
          e.x += this.mino.x
          e.y += this.mino.y
        });

        this.field.blocks = this.field.blocks.concat(this.mino.blocks);
        this.field.checkLine();
        this.popMino();
      }
    }

    /**
     * 次の移動が可能かチェック
     */
    valid(moveX, moveY, rot = 0)
    {
      // 見えないブロック(svgタグ追加なし)を生成し、判定に使う
      let newBlocks = this.mino.getNewBlocks(moveX, moveY, rot);

      return newBlocks.every(block => {
        return (
          block.x >=  0 &&
          block.y >= -1 &&
          block.x < COLS_COUNT &&
          block.y < ROWS_COUNT &&
          !this.field.has(block.x, block.y)
        );
      });
    }

    /**
     * キーイベント
     */
    setKeyEvent()
    {
      document.onkeydown = function(e) {
        switch(e.keyCode)
        {
          case 37: // 左
            if(this.valid(-1, 0)) this.mino.x--;
            break;
          case 39: // 右
            if(this.valid(1, 0)) this.mino.x++;
            break;
          case 40: // 下
            if(this.valid(0, 1)) this.mino.y++;
            break;
          case 38: // 上
            if(this.valid(0, 0, 1)) this.mino.rotate();
            break;
          case 32: // スペース
            if(this.valid(0, 0, 1)) this.mino.rotate();
            break;
        };
        this.mino.draw();
      }.bind(this);
    }
  }

  /**
   * ブロッククラス
   */
  class Block
  {
    // 基準地点からの座標
    // 移動中 ⇒ Minoの左上
    // 配置後 ⇒ Fieldの左上
    constructor(x, y, type)
    {
      this.x = x;
      this.y = y;

      // ID(10桁連番)
      BLOCK_NUM++;
      BLOCK_NUM = BLOCK_NUM > 9999999999 ? 1 : BLOCK_NUM;
      this.id = ('0000000000' + BLOCK_NUM).slice(-10);

      // 描画しないときはタイプを指定しない
      if (type >= 0) {
        this.setType(type);
      }
    }

    /**
     * タイプセット＆SVGタグ生成
     */
    setType(type)
    {
      this.type = type;

      // SVGタグ生成(実際の描写前)
      document.querySelector('body').insertAdjacentHTML('beforeend',
          '<svg id="block-' + this.id + '" viewBox="0 0 16 16"'
        + ' style="width: ' + BLOCK_SIZE + 'px; height: ' + BLOCK_SIZE + 'px;'
        + ' opacity: 0.9; position: fixed; z-index: 10002; fill: ' + BLOCK_COLORS[this.type] + ';'
        + ' display: none;">'
        + '<use xlink:href="#orgblock"></use>'
        + '</svg>'
      );

      this.svg = document.getElementById('block-' + this.id);
    }

    /**
     * Minoの表示
     * Minoに属するときは、Minoの位置をオフセットに指定
     * Fieldに属するときは、(0,0)を起点とするので不要
     */
    draw(offsetX = 0, offsetY = 0)
    {
      let drawX = this.x + offsetX
      let drawY = this.y + offsetY

      if (drawX >= 0 && drawX < COLS_COUNT &&
          drawY >= 0 && drawY < ROWS_COUNT) {
        // 画面内
        this.svg.style.left    = Math.floor(drawX * BLOCK_SIZE) + 'px';
        this.svg.style.top     = Math.floor(drawY * BLOCK_SIZE) + 'px';

        if (this.svg.style.display == 'none') {
          this.svg.style.display = 'inline-block';
        }
      } else {
        // 画面外
        this.svg.style.display = 'none';
      }
    }

    /**
     * 次のミノを描画する
     */
    drawNext()
    {
      // タイプごとに余白を調整して、中央に表示
      let offsetX = 0
      let offsetY = 0

      switch(this.type){
        case 0: // I型
          offsetX =  0.25;
          offsetY = -0.2;
          break;
        case 1: // O型
          offsetX = 0.35;
          offsetY = 0.3;
          break;
        case 9: // .型
          offsetX = 0.9;
          offsetY = 0.7;
          break;
        default:
          offsetX = 0.9;
          offsetY = 0.3;
          break;
      }

      this.svg.style.left    = NEXT_COORDINATE['x'] + Math.floor((this.x + offsetX) * BLOCK_SIZE) + 'px';
      this.svg.style.top     = NEXT_COORDINATE['y'] + Math.floor((this.y + offsetY) * BLOCK_SIZE) + 'px';
      this.svg.style.display = 'inline-block';
    }

    /**
     * SVG削除(インスタンス削除前に実行)
     */
    remove()
    {
      this.svg.remove();
    }
  }

  /**
   * ミノクラス
   */
  class Mino
  {
    constructor()
    {
      // ミノ型決定
      if (EX_MODE) {
        // 拡張モード(拡張ミノは10%)
        if (Math.floor(Math.random() * 100) < 10) {
          // 拡張ミノ(各3.33%)
          this.type = 7 + Math.floor(Math.random() * 3);
        } else {
          // 通常ミノ(各12.86%)
          this.type = Math.floor(Math.random() * 7);
        }
      } else {
        // 通常モード(各14.29%)
        this.type = Math.floor(Math.random() * 7);
      }

      // ミノ生成
      this.initBlocks();
    }

    /**
     * ミノ生成
     */
    initBlocks()
    {
      const t = this.type;
      switch (t) {
        case 0: // I型
          this.blocks = [new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t), new Block(3, 2, t)];
          break;
        case 1: // O型
          this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(1, 2, t), new Block(2, 2, t)];
          break;
        case 2: // T型
          this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)];
          break;
        case 3: // J型
          this.blocks = [new Block(0, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)];
          break;
        case 4: // L型
          this.blocks = [new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)];
          break;
        case 5: // S型
          this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t)];
          break;
        case 6: // Z型
          this.blocks = [new Block(0, 1, t), new Block(1, 1, t), new Block(1, 2, t), new Block(2, 2, t)];
          break;
        case 7: // U型
          this.blocks = [new Block(0, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t), new Block(2, 1, t)];
          break;
        case 8: // V型
          this.blocks = [new Block(0, 1, t), new Block(1, 2, t), new Block(2, 1, t)];
          break;
        case 9: // .型
          this.blocks = [new Block(1, 1, t)];
          break;
      };
    }

    /**
     * フィールドに生成する
     */
    spawn()
    {
      if (RAND_MODE) {
        // ランダム位置モードはランダム
        this.x = Math.floor(Math.random() * (COLS_COUNT - 3));
      } else {
        // 中央
        this.x = Math.floor(COLS_COUNT / 2) - 2
      }

      this.y = -3
    }

    /**
     * フィールドに描画する
     */
    draw()
    {
      this.blocks.forEach(block => {
        block.draw(this.x, this.y)
      })
    }

    /**
     * 次のミノを描画する
     */
    drawNext()
    {
      this.blocks.forEach(block => {
        block.drawNext()
      })
    }

    /**
     * 回転させる
     */
    rotate()
    {
      this.blocks.forEach(block => {
        let oldX = block.x
        block.x = block.y
        block.y = 3 - oldX
      })
    }

    /**
     * 次に移動しようとしている位置の情報を持ったミノを生成
     */
    getNewBlocks(moveX, moveY, rot)
    {
      let newBlocks = this.blocks.map(block => {
        return new Block(block.x, block.y);
      });

      newBlocks.forEach(block => {
        // 移動させる場合
        if (moveX || moveY) {
          block.x += moveX;
          block.y += moveY;
        }

        // 回転させる場合
        if (rot) {
          let oldX = block.x;
          block.x  = block.y;
          block.y  = 3 - oldX;
        }

        // グローバル座標に変換
        block.x += this.x;
        block.y += this.y;
      });

      return newBlocks;
    }
  }

  /**
   * 描写フィールドクラス
   */
  class Field
  {
    constructor()
    {
      this.blocks = [];
    }

    /**
     * SVGタグの削除＆新座標セット
     */
    checkLine()
    {
      for (let r = 0; r < ROWS_COUNT; r++) {
        const c = this.blocks.filter(block => block.y === r).length;

        if (c === COLS_COUNT) {
          // SVG削除
          this.blocks.filter(block => {
            if (block.y == r) {
              block.remove();
            }
          });

          // クリア行数更新
          CLEAR_LINES++;
          this.updateInfo();

          // ブロックオブジェクト削除
          this.blocks = this.blocks.filter(block => block.y !== r);

          // 削除した行より上のブロックを1行下にずらす
          this.blocks.filter(block => block.y < r).forEach(upper => {
            upper.y++;
            upper.draw();
          });
        }
      }
    }

    /**
     * 情報モーダル更新
     */
    updateInfo()
    {
      const clearLines = document.getElementById('clear-lines');
      clearLines.textContent = CLEAR_LINES.toLocaleString();
    }

    /**
     * 固定ブロック存在チェック
     */
    has(x, y)
    {
      return this.blocks.some(block => block.x == x && block.y == y);
    }
  }

  // ゲーム開始
  const brGame = new Game();
  brGame.start();
}());
