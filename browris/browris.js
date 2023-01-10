/**
 * browris ブラウリス
 * host: (any)
 */
(function() {
  let BLOCK_SIZE =  16; // ブロックサイズ(px)
  let SPPED      = 500; // 落下スピード(ms)
  let BLOCK_NUM  =   0; // ブロック連番
  let COLS_COUNT;       // 列ブロック数
  let ROWS_COUNT;       // 行ブロック数

  // ブロック色
  const BLOCK_COLORS = [
    '#9DCCE0', // I型
    '#FFFF00', // O型
    '#A757A8', // T型
    '#0000FF', // J型
    '#FFA500', // L型
    '#00FF00', // S型
    '#FF0000', // Z型
  ];

  /**
   * セットアップクラス
   */
  class Setup
  {
    static init()
    {
      // 左モーダル
      let html = '<style type="text/css">'
                  + '.info-modal-window {'
                  + '  position:fixed;'
                  + '  top:0;'
                  + '  left:0;'
                  + '  display:flex;'
                  + '  justify-content:left;'
                  + '  align-items:start;'
                  + '  width:100vw;'
                  + '  height:100vh;'
                  + '  background-color:rgba(0, 0, 0, 0.7);'
                  + '  backdrop-filter:blur(5px);'
                  + '  z-index:10000;'
                  + '}'
                  + '.info-modal-window .content {'
                  + '  position:relative;'
                  + '  box-sizing:border-box;'
                  + '  margin:5px;'
                  + '  padding:5px;'
                  + '  max-width:600px;'
                  + '  color:#000000;'
                  + '  background-color:#C7C7C7;'
                  + '  text-align: center;'
                  + '}'
                  + '.info-modal-window .content .goaway {'
                  + '  font-size:1.3rem;'
                  + '  font-weight:bold;'
                  + '}'
                  + '.info-modal-window .content .good {'
                  + '  margin-top:5px;'
                  + '  font-size:1.3rem;'
                  + '  font-weight:bold;'
                  + '}'
                  + '.info-modal-window .content .footer {'
                  + '  display:flex;'
                  + '  justify-content:space-between;'
                  + '  margin-top:20px;'
                  + '  justify-content:center;'
                  + '}'
                  + '.info-modal-window .content .footer .controls button {'
                  + '  padding:calc(0.8rem + 0.12em) 1.2rem 0.8rem;'
                  + '  background-color:#FEF8F8;'
                  + '  font-size:1.2rem;'
                  + '  color:#000000;'
                  + '  border-radius:5px;'
                  + '  transition:background-color 0.2s;'
                  + '}'
                  + '.info-modal-window .content .footer .controls button:nth-child(n+2) {'
                  + '  margin-left:10px;'
                  + '}'
                  + '.info-modal-window .content .footer .controls button:hover,'
                  + '.info-modal-window .content .footer .controls button:focus {'
                  + '  background-color:#DCDCDC;'
                  + '}'
                  + '.info-modal-window .content .close {'
                  + '  position:absolute;'
                  + '  top:-10px;'
                  + '  right:-10px;'
                  + '  border-radius:50%;'
                  + '  width:40px;'
                  + '  height:40px;'
                  + '  background:linear-gradient(#fff, #fff) 50% 50% / 3px 66% no-repeat, #333 linear-gradient(#fff, #fff) 50% 50% / 66% 3px no-repeat;'
                  + '  font-size:0;'
                  + '  transform:rotate(45deg);'
                  + '  transition:background-color 0.2s;'
                  + '}'
                  + '.info-modal-window .content .close:hover,'
                  + '.info-modal-window .content .close:focus {'
                  + '  background-color:#444;'
                  + '}'
                  + '</style>'
                  + '<div class="info-modal-window" id="info-modal" aria-labelledby="info-modal-title" aria-hidden="true">'
                  + '  <div class="content" tabindex="-1">'
                  + '    <div class="body">'
                  + '      <p>'
                  + '      ↑ 回転<br />'
                  + '      ←↓→ 移動<br />'
                  + '      </p>'
                  + '    </div>'
                  + '  </div>'
                  + '</div>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      // ブロックsvg
      html = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
           + ' style="display:none;" width="16px" height="16px">'
           + '<symbol id="orgblock" viewbox="0 0 16 16">'
           + '<g>'
           + '<rect x="0" y="0" width="16" height="16" />'
           + '</g>'
           + '</symbol>'
           + '</svg>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);
    }

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
        SPPED = parseInt(args['s']);
      }
      if ('b' in args) {
        BLOCK_SIZE = parseInt(args['b']);
      }
    }
  }

  /**
   * ゲームクラス
   */
  class Game
  {
    constructor()
    {
      // 初期化
      Setup.init();
      Setup.initParams();

      // ブラウザ幅・高さ
      const width  = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight;
      console.log('w, h', width, height);

      // ブロック数
      if (!COLS_COUNT) {
        COLS_COUNT = Math.floor(width  / BLOCK_SIZE);
      }
      if (!ROWS_COUNT) {
        ROWS_COUNT = Math.floor(height  / BLOCK_SIZE);
      }
      console.log('COLS_COUNT, ROWS_COUNT', COLS_COUNT, ROWS_COUNT);

      // 情報モーダル
      this.info = document.getElementById('info-modal');
    }

    /**
     * ゲームの開始処理
     */
    start()
    {
      // フィールドとミノの初期化
      this.field = new Field();

      // 最初のミノを読み込み
      this.popMino();

      // 初回描画
      this.mino.draw();

      // 落下処理
      clearInterval(this.timer);
      this.timer = setInterval(() => this.dropMino(), SPPED);

      // キーボードイベントの登録
      this.setKeyEvent();
    }

    // 新しいミノを読み込む
    popMino()
    {
      console.log('Game.popMino');

      this.mino = this.nextMino ?? new Mino();
      console.log('this.mino', this.mino);
      this.mino.spawn();
      this.nextMino = new Mino();
      console.log('this.nextMino', this.nextMino);

      // ゲームオーバー判定
      if (!this.valid(0, 1)) {
        clearInterval(this.timer);
        console.log('ゲームオーバー', this.timer);
      }
    }

    // ミノの落下処理
    dropMino()
    {
      console.log('Game.dropMino', this.mino);

      if (this.valid(0, 1)) {
        this.mino.y++;

        this.mino.draw();

      } else {
        // Minoを固定する（座標変換してFieldに渡す）
        console.log('Minoを固定', this.mino.blocks);
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
          block.x >= 0 &&
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

      // 描画しないとき(ゲームオーバー判定時)はタイプを指定しない
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
        + ' opacity: 0.9; position: fixed; z-index: 10001; fill: ' + BLOCK_COLORS[this.type] + ';'
        + ' display: none;">'
        + '<use xlink:href="#orgblock"></use>'
        + '</svg>'
      );

      this.svg = document.getElementById('block-' + this.id);
    }

    /**
     * 落下中Minoの描写
     * Minoに属するときは、Minoの位置をオフセットに指定
     * Fieldに属するときは、(0,0)を起点とするので不要
     */
    draw(offsetX = 0, offsetY = 0)
    {
      let drawX = this.x + offsetX
      let drawY = this.y + offsetY

      // 画面外は描画しない
      if (drawX >= 0 && drawX < COLS_COUNT &&
          drawY >= 0 && drawY < ROWS_COUNT) {
        this.svg.style.left    = Math.floor(drawX * BLOCK_SIZE) + 'px';
        this.svg.style.top     = Math.floor(drawY * BLOCK_SIZE) + 'px';

        if (this.svg.style.display == 'none') {
          this.svg.style.display = 'inline-block';
        }
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
        case 0:
          offsetX = 0.5
          offsetY = 0
          break;
        case 1:
          offsetX = 0.5
          offsetY = 0.5
          break;
        default:
          offsetX = 1
          offsetY = 0.5
          break;
      }

      this.svg.style.left    = Math.floor((this.x + offsetX) * BLOCK_SIZE) + 'px';
      this.svg.style.top     = Math.floor((this.y + offsetY) * BLOCK_SIZE) + 'px';
      this.svg.style.display = 'inline-block';
    }

    /**
     * SVG削除(インスタンスを削除する前に実行する)
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
      console.log('Mino.constructor()');

      this.type = Math.floor(Math.random() * 7);
      this.initBlocks();
    }

    /**
     * ミノ生成
     */
    initBlocks()
    {
      let t = this.type
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
          this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)];
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
      };
    }

    /**
     * フィールドに生成する
     */
    spawn()
    {
      // TODO: 横位置ランダムに
      this.x = COLS_COUNT / 2 - 2
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
     * svgタグの削除＆新座標セット
     */
    checkLine()
    {
      for (let r = 0; r < ROWS_COUNT; r++) {
        const c = this.blocks.filter(block => block.y === r).length;

        if (c === COLS_COUNT) {
          this.blocks.filter(block => {
            if (block.y == r) {
              // SVG削除
              block.remove();
            }
          });

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
     * 固定ブロック存在チェック
     */
    has(x, y)
    {
      return this.blocks.some(block => block.x == x && block.y == y);
    }
  }

  // ゲーム開始
  const brwgame = new Game();
  brwgame.start();
}());
