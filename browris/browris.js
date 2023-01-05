/**
 * browris ブラウリス
 * host: (any)
 */
(function() {
  const BLOCK_SIZE = 16;
  let COLS_COUNT;
  let ROWS_COUNT;
  let blksn = 0; // ブロック連番
  const BLOCK_COLORS = [
    '#9DCCE0',
    '#FFFF00',
    '#A757A8',
    '#0000FF',
    '#FFA500',
    '#00FF00',
    '#FF0000',
  ];

  /**
   * セットアップ
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
                  + '      SP 回転<br />'
                  + '      ←↓→ 移動<br />'
                  + '      </p>'
                  + '    </div>'
                  + '  </div>'
                  + '</div>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      // ブロックsvg
      html = '<svg version="1.1" id="orgblock" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"'
           + ' style="display:none;" viewBox="0 0 16 16" width="16px" height="16px">'
           + '<defs>'
           + '<rect width="16" height="16"/>'
           + '</defs>'
           + '<g>'
           + '<rect x="0" y="0" width="16" height="16" transform="matrix(1,0,0,1,0,0)" fill="rgb(235,235,235)"/>'
           + '</g>'
           + '</svg>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);
    }
  }

  // TODO: 1つのsvgを色分けして使う
  // 素材を管理するクラス
  // ゲーム開始前に初期化する
  class Asset
  {
    // ブロック用Imageの配列
    static blockImages = []

    // 初期化処理
    // callback には、init完了後に行う処理を渡す
    static init(callback)
    {
      let loadCnt = 0
      for (let i = 0; i <= 6; i++) {
        let img = new Image();
        img.src = BLOCK_SOURCES[i];
        img.onload = function() {
          loadCnt++
          Asset.blockImages.push(img)

          // 全ての画像読み込みが終われば、callback実行
          if(loadCnt >= BLOCK_SOURCES.length && callback){
            callback()
          }
        }
      }
    }
  }



  class Game
  {
    #blocksize = 16; // ブロックサイズ(px)
    #speed = 1000;
    #cols; // 横ブロック数
    #rows; // 縦ブロック数

    #width; // ブラウザ幅
    #height // ブラウザ高さ
    #info;  // 情報モーダル

    #field; // 描写フィールド
    #mino; // 落下中mino
    #nextMino; // 次のmino

    #timer; // タイマーID

    constructor()
    {
      // ブラウザ幅・高さ
      this.#width  = document.documentElement.clientWidth;
      this.#height = document.documentElement.clientHeight;
      console.log('w, h', this.#width, this.#height);

      // ブロック数
      this.#cols = Math.floor(this.#width  / this.#blocksize);
      this.#rows = Math.floor(this.#height / this.#blocksize);
      console.log('cols, rows', this.#cols, this.#rows);

      // 情報モーダル
      this.#info = document.getElementById('info-modal');
      console.log('info', this.#info);
    }


    // ゲームの開始処理（STARTボタンクリック時）
    start()
    {
      // フィールドとミノの初期化
      this.#field = new Field(this.#cols, this.#rows);

      // 最初のミノを読み込み
      this.popMino();

      // 初回描画
      this.drawAll();

      // 落下処理
      clearInterval(this.#timer);
      this.#timer = setInterval(() => this.dropMino(), this.#speed);

      // キーボードイベントの登録
      this.setKeyEvent();
    }

    // 新しいミノを読み込む
    popMino()
    {
      this.#mino = this.#nextMino ?? new Mino()
      this.#mino.spawn()
      this.#nextMino = new Mino()

      // ゲームオーバー判定
      if (!this.valid(0, 1)) {
        this.drawAll();
        clearInterval(this.timer);
        alert('ゲームオーバー');
      }
    }

    // 画面の描画
    drawAll()
    {
      // TODO SVGとして物理タグを生成するのでクリアしない
      // 表示クリア
      // this.mainCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      // this.nextCtx.clearRect(0, 0, NEXT_AREA_SIZE, NEXT_AREA_SIZE)

      // 落下済みのミノを描画
      // this.#field.drawFixedBlocks(this.mainCtx)

      // 再描画
      this.#nextMino.drawNext()
      this.#mino.draw()
    }

    // ミノの落下処理
    dropMino()
    {
      if (this.valid(0, 1)) {
        this.#mino.y++;
      } else {
        // Minoを固定する（座標変換してFieldに渡す）
        this.#mino.blocks.forEach(e => {
          e.x += this.#mino.x
          e.y += this.#mino.y
        })
        this.#field.blocks = this.#field.blocks.concat(this.#mino.blocks)
        this.#field.checkLine()
        this.popMino()
      }
      this.drawAll();
    }

    // 次の移動が可能かチェック
    valid(moveX, moveY, rot = 0)
    {
      let newBlocks = this.#mino.getNewBlocks(moveX, moveY, rot)
      return newBlocks.every(block => {
        return (
          block.x >= 0 &&
          block.y >= -1 &&
          block.x < this.#cols &&
          block.y < this.#rows &&
          !this.#field.has(block.x, block.y)
        )
      })
    }

    // キーボードイベント
    setKeyEvent()
    {
      document.onkeydown = function(e){
        switch(e.keyCode)
        {
          case 37: // 左
            if( this.valid(-1, 0)) this.#mino.x--;
            break;
          case 39: // 右
            if( this.valid(1, 0)) this.#mino.x++;
            break;
          case 40: // 下
            if( this.valid(0, 1) ) this.#mino.y++;
            break;
          case 32: // スペース
            if( this.valid(0, 0, 1)) this.#mino.rotate();
            break;
        }
        this.drawAll()
      }.bind(this)
    }
  }


  /**
   * ブロッククラス
   */
  class Block
  {
    x;
    y;
    type;
    id;

    // 基準地点からの座標
    // 移動中 ⇒ Minoの左上
    // 配置後 ⇒ Fieldの左上
    constructor(x, y, type)
    {
      this.x = x
      this.y = y

      // ID(10桁連番)
      blksn++;
      this.id = ('0000000000' + blksn).slice(-10);

      // 描画しないときはタイプを指定しない
      if (type >= 0) {
        this.setType(type);
      }
    }

    setType(type)
    {
      this.type = type

      // SVGタグ生成(描写前)
      document.querySelector('body').insertAdjacentHTML('beforeend',
          '<svg id="block-' + this.id + '" viewBox="0 0 16 16"'
        + ' style="width: ' + BLOCK_SIZE + 'px; height: ' + BLOCK_SIZE + 'px;'
        + ' opacity: 0; position: fixed; z-index: 10001; fill: ' + BLOCK_COLORS[this.type] + ';'
        + ' left: ' + this.x + 'px; top: ' + this.y + 'px; display: none;">'
        + '<use xlink:href="#orgblock"></use>'
        + '</svg>'
      );

    }

    // Minoに属するときは、Minoの位置をオフセットに指定
    // Fieldに属するときは、(0,0)を起点とするので不要
    draw(offsetX = 0, offsetY = 0)
    {
      let drawX = this.x + offsetX
      let drawY = this.y + offsetY

      // 画面外は描画しない
      if (drawX >= 0 && drawX < COLS_COUNT &&
          drawY >= 0 && drawY < ROWS_COUNT) {
        const svg = document.getElementById('block-' + this.id);
        svg.style.left    = Math.floor(drawX * BLOCK_SIZE) + 'px';
        svg.style.top     = Math.floor(drawY * BLOCK_SIZE) + 'px';
        // svg.style.display = 'inline-block';
      }
    }

    // 次のミノを描画する
    // タイプごとに余白を調整して、中央に表示
    drawNext()
    {
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

      // TODO: svgに切り替え
      // ctx.drawImage(
      //   this.image,
      //   (this.x + offsetX) * BLOCK_SIZE,
      //   (this.y + offsetY) * BLOCK_SIZE,
      //   BLOCK_SIZE,
      //   BLOCK_SIZE
      // );

      const svg = document.getElementById('block-' + this.id);
      svg.style.left    = Math.floor(this.x + offsetX) + 'px';
      svg.style.top     = Math.floor(this.y + offsetY) + 'px';
      svg.style.display = 'inline-block';
    }
  }

  class Mino
  {
    constructor()
    {
        this.type = Math.floor(Math.random() * 7);
        this.initBlocks()
    }

    initBlocks()
    {
      let t = this.type
      switch (t) {
        case 0: // I型
          this.blocks = [new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t), new Block(3, 2, t)]
          break;
        case 1: // O型
          this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(1, 2, t), new Block(2, 2, t)]
          break;
        case 2: // T型
          this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]
          break;
        case 3: // J型
          this.blocks = [new Block(1, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]
          break;
        case 4: // L型
          this.blocks = [new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t), new Block(2, 2, t)]
          break;
        case 5: // S型
          this.blocks = [new Block(1, 1, t), new Block(2, 1, t), new Block(0, 2, t), new Block(1, 2, t)]
          break;
        case 6: // Z型
          this.blocks = [new Block(0, 1, t), new Block(1, 1, t), new Block(1, 2, t), new Block(2, 2, t)]
          break;
      }
    }

    // フィールドに生成する
    spawn()
    {
      // TODO: 横位置ランダムに
      this.x = COLS_COUNT / 2 - 2
      this.y = -3
    }

    // フィールドに描画する
    draw()
    {
      this.blocks.forEach(block => {
        block.draw(this.x, this.y, ctx)
      })
    }

    // 次のミノを描画する
    drawNext()
    {
      this.blocks.forEach(block => {
        block.drawNext()
      })
    }

    // 回転させる
    rotate()
    {
      this.blocks.forEach(block=>{
        let oldX = block.x
        block.x = block.y
        block.y = 3 - oldX
      })
    }

    // 次に移動しようとしている位置の情報を持ったミノを生成
    // 描画はせず、移動が可能かどうかの判定に使用する
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
   * 描写フィールド
   */
  class Field
  {
    #cols; // 横ブロック数
    #rows; // 縦ブロック数

    constructor(cols, rows)
    {
      this.#cols = cols;
      this.#rows = rows;

      this.blocks = [];
    }

    // TODO: svgタグの削除＆新座標セット
    drawFixedBlocks(ctx)
    {
      this.blocks.forEach(block => block.draw(0, 0, ctx));
    }

    checkLine()
    {
      for (let r = 0; r < this.#rows; r++) {
        const c = this.blocks.filter(block => block.y === r).length;

        if (c === this.#cols) {
          this.blocks = this.blocks.filter(block => block.y !== r);
          this.blocks.filter(block => block.y < r).forEach(upper => upper.y++);
        }
      }
    }

    has(x, y)
    {
      return this.blocks.some(block => block.x == x && block.y == y);
    }
  }




  // 初期化
  Setup.init();

  // ゲーム開始
  const bgame = new Game();

}());
