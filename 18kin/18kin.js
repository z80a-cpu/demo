/**
 * 18kin 年齢確認
 * host:jp.quora.com
 */
(function() {
  // 年齢確認するURL
  const CNF_HOST     = 'jp.quora.com';
  const CNF_PATHNAME = '/';

  // 未成年の場合に遷移するURL
  const CHILD_URL = 'https://www.anpanman.jp/';

  /**
   * 初期設定クラス
   */
  class Setup
  {
    static init()
    {
      // モーダル追加
      const html = '<style type="text/css">'
                  + '.adult-modal-window {'
                  + '  position:fixed;'
                  + '  top:0;'
                  + '  left:0;'
                  + '  display:flex;'
                  + '  justify-content:center;'
                  + '  align-items:center;'
                  + '  width:100vw;'
                  + '  height:100vh;'
                  + '  background-color:rgba(0, 0, 0, 0.7);'
                  + '  backdrop-filter:blur(5px);'
                  + '  z-index:99999;'
                  + '}'
                  + '.adult-modal-window[aria-hidden="true"] {'
                  + '  display:none;'
                  + '}'
                  + '.adult-modal-window .content {'
                  + '  position:relative;'
                  + '  box-sizing:border-box;'
                  + '  margin:20px;'
                  + '  padding:20px;'
                  + '  max-width:600px;'
                  + '  color:#000000;'
                  + '  background-color:#FEF8F8;'
                  + '  text-align: center;'
                  + '}'
                  + '.adult-modal-window .content .header {'
                  + '  font-size:1.5rem;'
                  + '  font-weight:bold;'
                  + '}'
                  + '.adult-modal-window .content .body {'
                  + '  margin-top:20px;'
                  + '}'
                  + '.adult-modal-window .content .nosvg {'
                  + '  margin-top:10px;'
                  + '}'
                  + '.adult-modal-window .content .goaway {'
                  + '  font-size:1.3rem;'
                  + '  font-weight:bold;'
                  + '}'
                  + '.adult-modal-window .content .good {'
                  + '  margin-top:5px;'
                  + '  font-size:1.3rem;'
                  + '  font-weight:bold;'
                  + '}'
                  + '.adult-modal-window .content .body .annotation {'
                  + '  margin-top:10px;'
                  + '  color:#808080;'
                  + '}'
                  + '.adult-modal-window .content .footer {'
                  + '  display:flex;'
                  + '  justify-content:space-between;'
                  + '  margin-top:20px;'
                  + '  justify-content:center;'
                  + '}'
                  + '.adult-modal-window .content .footer .controls button {'
                  + '  padding:calc(0.8rem + 0.12em) 1.2rem 0.8rem;'
                  + '  background-color:#FEF8F8;'
                  + '  font-size:1.2rem;'
                  + '  color:#000000;'
                  + '  border-radius:5px;'
                  + '  transition:background-color 0.2s;'
                  + '}'
                  + '.adult-modal-window .content .footer .controls button:nth-child(n+2) {'
                  + '  margin-left:10px;'
                  + '}'
                  + '.adult-modal-window .content .footer .controls button:hover,'
                  + '.adult-modal-window .content .footer .controls button:focus {'
                  + '  background-color:#DCDCDC;'
                  + '}'
                  + '.adult-modal-window .content .close {'
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
                  + '.adult-modal-window .content .close:hover,'
                  + '.adult-modal-window .content .close:focus {'
                  + '  background-color:#444;'
                  + '}'
                  + '</style>'
                  + '<div class="adult-modal-window" id="adult-modal" aria-labelledby="adult-modal-title" aria-hidden="true">'
                  + '  <div class="content" tabindex="-1">'
                  + '    <div class="header" id="adult-modal-title">年齢確認</div>'
                  + '    <div class="body">'
                  + '      <p>あなたは18歳以上ですか？</p>'
                  + '      <p class="nosvg">'
                  + '        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" style="width: 64px; height: 64px; opacity: 1;" xml:space="preserve">'
                  + '          <g>'
                  + '          <path d="M437.023,74.977c-99.984-99.969-262.063-99.969-362.047,0c-99.969,99.984-99.969,262.063,0,362.047'
                  + '           c99.969,99.969,262.078,99.969,362.047,0S536.992,174.945,437.023,74.977z M137.211,137.211'
                  + '           c54.391-54.391,137.016-63.453,201.016-27.531L109.68,338.227C73.758,274.227,82.82,191.602,137.211,137.211z M374.805,374.789'
                  + '           c-54.391,54.391-137.031,63.469-201.031,27.547l228.563-228.563C438.258,237.773,429.18,320.414,374.805,374.789z" style="fill: rgb(255, 0, 0);"></path>'
                  + '          </g>'
                  + '        </svg>'
                  + '      </p>'
                  + '      <p class="annotation">ここから先はアダルトサイトになります。<br />18歳未満のアクセスは固くお断りします。</p>'
                  + '    </div>'
                  + '    <div class="footer">'
                  + '      <div class="controls">'
                  + '        <button type="button" class="cancel">いいえ</button>'
                  + '        <button type="button" class="ok">&nbsp;&nbsp;はい&nbsp;&nbsp;</button>'
                  + '      </div>'
                  + '    </div>'
                  + '  </div>'
                  + '</div>';
      document.querySelector('body').insertAdjacentHTML('beforeend', html);

      // リスナー(ok,cencel)追加
      const modalElem = document.querySelector('#adult-modal');
      modalElem.querySelector('.ok').addEventListener('click', function() {
        modalElem.querySelector('.header').innerHTML = '';
        modalElem.querySelector('.body').innerHTML = '<p>'
          + '<?xml version="1.0" encoding="UTF-8" standalone="no"?>'
          + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
          + '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="248px" height="270px"'
          + ' viewBox="0 0 248 270">'
          + '<image id="image0" width="248" height="270" x="0" y="0" href="data:image/png;base64,'
          + 'iVBORw0KGgoAAAANSUhEUgAAAPgAAAEOCAYAAACkbdq7AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAA'
          + 'CXBIWXMAABJ0AAASdAHeZh94AABilUlEQVR42u2dd3QUVRuHn9mabPqmEpJAQgk99KoioDQLqIgoggUVwQIqFqwIihUVu2BB+FCsSBORJihIN3SClAApBNJ7ts33xzrDLkkgZUvKPufksLvslDs7v7n3'
          + 'vvctgiiKIh48eGiQKNx9Ah48eHAeHoF78NCA8Qjcg4cGjEfgHjw0YDwC9+ChAeMRuAcPDRiVu0+gIXLkyBE+/fRTzGYzH3zwgbtPx0MjRvCsgzuODRs2MHLkSAoKCuw+P3LkCPHx8e4+PQ+NEI/AHUSH'
          + 'Dh04ePCg/L5du3YcO3YMg8EAQH5+Pn5+fu4+TQ+NDM8cvJasXbsWQRBkcffp04c//viD1atXs3fvXhQK6yXu1KmTu0/VQyPEI/Ba8NJLLzF48GD5/XfffcfixYvx9fUlLS2N0tJSli5dCkBycjKJiYnu'
          + 'PmUPjQyPwGvIzTffzMyZMwHr8PzYsWO0bt2ajIwMDAYDRqOR4uJievfuTefOnQF49tln3X3aHhoZnjl4Dbjqqqv4888/AavQ586dS1paGmazGaPRiF6vJzY2Fh8fHwDWrFnD0KFDAfBcbg+uxCPwamIr'
          + '7qlTp/LYY4+Rnp6O2WxGqVTSsWNHdDpdue0EQQBg+/bt9OzZ093N8NBI8KyDV4O7775bFveTTz7JpEmTZHFrtVq6detW6bbx8fEkJSXx22+/VSrw5ORkkpKS+Pfff0lOTiY1NZXMzEyys7MpKCigoKCA'
          + '0tJSFAoFarUajUaDTqfDx8eH0NBQwsLCCA0NJSQkhIiICEJCQoiKiiIuLo6AgACnX5+CggKWLl3K+vXrOXnyJIWFhfTo0YPPPvvMPT+YB4/Aq8pXX33F119/DcDkyZOZPHkyZ8+eRRRFFArFJcUNMGLE'
          + 'CN5880127NgBwLJly9iyZQvbtm1jx44dlJWVuaQdrVq1olOnTvTu3ZtBgwbRpUuXWu/zmWee4b333quwDf/88w+RkZG89NJLLmmfB3s8Q/QqkJWVRUhICAADBw5kwYIFpKWlIYoiRqORHj164OXlVen2'
          + 'ycnJTJs2jZ9++qkKR9PQIlZNs2gzkREKIsJEQoJVeGuLCA1WEhggoNUYKShSkZMrkpMrYjD5cO5cKRmZkJevIDXNSHauhjNpRixmBWC45BETEhK4/fbbue+++wgODq7ydRk1alS5NqlUKvr06UOXLl3Y'
          + 'vXs3W7ZsATy2B3fhEXgV8Pf3p6CgAJ1Ox5EjR0hLSwPAbDYTEhJC69at7b5fUFDAggULWLRoETt37qxkr1p6dVPSu7tI3x7QowvEdhBAUwL895OYAct/f+J/f5b/Nhf++5PWQRQ2fwI2XwIKvTh5VOTw'
          + 'v3DkX0jcr2DLDjMnkg0XjvUfwcHBzJo1i0mTJlV6Pd555x2eeOIJ+b1KpeLBBx/k1ltvJSYmhqKiIjQaDa1atZJtD7Nnz2b69Onu/ikbHR6BX4Z58+YxceJEwOqKGhAQgNFolHvvPn36oFJZZzqff/45'
          + 'L730kvwAuICC5s18GX6NmSEDBAZeKeIbUwqYwYS1gzVife2MX0MBKLFOyKQ/JWD24u+1Aj8sF1nwrUhOrv0Qe9q0abz11lvy+9LSUpo2bUp2drb82dtvv82tt95KQUEBJSUllJSUEBkZSYsWLQB47rnn'
          + 'mD17Nr6+vuVceD04H4/AL4PUA40ePZpXXnlFvrlFUSQsLIy4uDief/55Xn31VbvtgoJ8GT9aYNxo6DbQCJReELMB62t3IwDa//7UkH1Mx8y3Lcz9zGR3gq+//jojRoygbdu28mfjxo1j5syZ5OfnU1JS'
          + 'giiKGAwGmjdvTkxMjPy9wsJC2UW3sLBQXjr04Bo8Ar8EH3zwAY8++igAhw8fJj8/H4vFgpeXF/7+/rz11lt8+umnNluomDLRnxlPGQiMK7RqpARwjf2s9qgBX0Cp5P3XNUyZLg0rLqDX6/nuu+9o1qyZ'
          + '3cPOaDTSrFkzO3FLKJVKLBYLixYt4s4773R3KxsVHk+2SyCJ+4477pA/i4iI4ODBg7Ro0cJG3Grefz0Q0aLivY+yCdQXQiaQS/0RN1inCTlAlplHH7f2yq8864vtbdK5c2datmxJcXGx/JnZbCYiIqJC'
          + 'cQOyO+/WrVvd3cJGh0fglfDbb7/Jr6dNm4bZbMbf35+xY8fa9EIK3p4ZiCiaeWRqLmSXWgVSF4bftUEE8oEsM8+9XIhYpmToNb6A1Q4RGxvL0aNH0ev1iKKIUqmkVatWle6ua9eugHXJzINr8Qi8El5/'
          + '/XUA+vXrR1xcHH///Tdt27aVe6Gr+voiFnrzxPRcyLRAAc4xkLkTEesopNDI6rWFrP05EKt1zmqTeOONNwgLC6NNmzaX3E1CQgIA+/btc3eLGh2eOXglSMa1n3/+mZ9++onFixf/9z9aNvziw4AR2dbe'
          + '2uzuM3UhvoBCSZsOGpL+LQGgadOmpKSkXHKz/fv3y+GyntvNtXgEXgEpKSlER0cD0LFjR/bv3w/AFb2D+PPvUigpgSJ3n6WbUAJBAi8/48uMNy4se2VmZlbqJJOTk4Nerwc8Anc1niF6BSQlJcmvJXG/'
          + '80oYf/6dA9mNWNxgHbFkirz0egF7N/sgDdlDQkLYsGFDhZsEBQXJr7OystzdgkaFR+AVEBUVZfNOzd+/6XnsuXNWy7ilpnttYGRCp+5FiDkqvL00AAwaNEi2XVTGuXPn3H3mjQqPwCvgQuCIgrOHlPQe'
          + 'mG0Vtwd7igChjOISM727ewMwffp0Ro8eXe6r3t7W/3dVUI0HKx6BX0SHDh0oKioCVKQe0BAeWwp57j6rOowRyDbz985SJt1r9Vj74Ycf6Nixo93XSkqsRjm1Wu3uM25UeARuw8svvywnT9y80p/I1qVQ'
          + '6O6zqgdYgEyRj78o4LN3rK6oBw4coGnTpuW+6oq4dA8X8FjR/8PWZ/qpKaG88d55z7C8JoTAym+DuOGOHAB8fHwoLCyUlx0tFov82oPz8Qj8P3r16sWOHTvw8/MhP7/E6rzioWbo4fA2L9r1K+Ni7x/P'
          + '7eZaPEN04MyZM3KmlU3LgUKPuGtFNrTtUcqxXf7YJg3y9/d395k1OjwCx5qCCaBlrDddri6CUnefUQMgD1p0zOPkP35It5lUBMKD6/BccWDlypUAvDdbBcW13JmHC+RD83Y5HNxitZzn5ubSv39/d59V'
          + 'o6LRC/y7777775WG68YYPAJ3NPnQrncZPy6wDs83b97Mxx9/7O6zajQ0eoHPmzcPgJuu8wbR44ThFLLhlrvyuet2q8gfeugheV3cg3Np9FZ0aclm5bc+XHdDkTUDiwfHIwDBSry9FZSWGklISPDUanMB'
          + 'jboHP3z4sPz6upGWupN9RQFobP4agvOXCBSa2f671ddg7969nDhxwt1n1eBp1AKXKn9GN9WBV0ndCCRRwK4cBfEbvGm70ZuW6725c7e2YYi8FDpdmU1c80AAnnrqKXefUYOnUQt8/fr1AAwdpKg7iRtU'
          + 'MGiXF0cLFSQVKThRomBxspqt5xUN49cqgdeeNwJUsRCEh9rQEG6ZGiPVGbuqj+lyxT9chwi9Ay0ggFZh/UMlcqZEsCloUI8pAdtgs+PHj7v7jBo0jVrgRqO1J7m6n9r9AhewDsPV0DvAbO/hqYD9RQrw'
          + '+u879bminAXwK0Kvt4aPrlixwt1n1KBptAK/UFJISVTHUvdmQhWgxAQDtnpx9SYvFqapUNn8MmolfHRaTe/1XgzZ5sVD+zT1uze3wNCB1qfUpk2b3H02DZr63BfUir/++guAqKZeQJF7M6JqoPcWb/bl'
          + 'WefZKgE7gSsFKDILbM+zpkf63aii2CLwVeey+pmi2QBX9jbxzY8XfgcPzqHRCnzz5s0AXNEL91vPy2DfeSVanUhlkZRKAZRWfVOKSJGJ+tuLG6FvD+tFz8z0xOQ6k0Y7RJcKGwy6Uun+9W8NNA00U2aE'
          + 'UhOUVmDRt4hgEq3/YoFidz+UaoMROnXQyG9tq6R4cCyN0pOtpKQEnU4HQMZhHWFNiq2ph9yJAE8e0eClENlXqGD5ORVe//XYFhF0ShERyCtWoNdZ2Nm7hDgfsf4WWwhWICgUgIkDBw7Qvn17d59Rg6RR'
          + 'DtGlzJ8KpTdhbcrqRuYWEd5qbwAlrEpRsjxdJWUkxmCBfkEWNgwotT6ILFj/ra/iBhBEFEoBi9m6VOYRuHNolEP0mTNnAvDiNA0Y6oqHC1aDmQkKKjCcFZqwTiVKsS7p1WdxAyDSKs7qnnfs2DF3n0yD'
          + 'pdEJfMaMGf+9UvLSc9TJpIqqi4xnKgXszFXWX6NaRYjQKs7aII/AnUejEvjmzZt5+eWXAZg5XQe6PPdb0C/GAgODzWAQKP3P6GYqEXikmbHuuNM6AjPENLUaPk6ePOnus2mwNBqBz5w5U84mEhMdwAuz'
          + 'i6zFA+saIui1kDa0kBdbGRjf1MTy3iW8n2Con2velWGGmCirN5un2onzaPBGtvnz5/PAAw/I75tG+nPqdCFk17Wu2wYLNPGGl9sY5fdud6V1NCLovPIByMvzVJZwFg22B3/rrbcQBMFG3AqemRpCSmo+'
          + 'ZJvr3tD8YkRko1udP9eaYIHIJlrAmqvNg3NocD34o48+ygcffGDXxJnTdbwwuxR5PUyPVTRmmz+TzWcenI8F9IHWpQBPxVHn0eAcXS6umqEP8sPfrxiLqMZLq0CjNhEUKNK0iYamESaaxwi0jFPSuoVA'
          + '82gzilAFdvWBLZR/GEjvRRrAcpWbUEN6io7IDlYvtgZ2G9YZGrzAa4Yv+iADLZqriW5qomkTaBGrISyklNhmGmKjBcJDTRBkAaUF2folcuEBYKJhD7EdQYg3gmBNgrd//346dOjg7jNqcDS4Ifrq1atZ'
          + 'uXIlMTExJCQkMHnyZE6cOEF8fDyTJk0iJyeHlJQUCgoKSEtLIyUlhdTUVDk23Eoh2TmQnWNg5z/SZ5LDuu33lIAFPz8fmoQZiWuuJbqpiebRAq1bQpuW0KGdACElgOXCVMBE+ZFAo6SEsBAfzmUW8ccf'
          + 'f3gE7gQaXA9uy/3338/nn38OwN13380LL7xAYWEhSqUSQRBQKpXyn9lsJisri+zsbDIyMkhPTyczM5OUlBTOnTvH+fPnSU1NraFBSEt8KzXdO1tIaC/StrWKFs0tREaYCWimAUUh5bp58aI/uDBdkEYK'
          + '4kWf1beRQhCMu8OX/31fyBVXXCFn2PHgOBqswG2Xx8aNG8crr7xCenr6JbdRKBTyn1KprPQ1QFpaGoWFhYiiyI033ojBYAAUPDixH/Pm/43FUp1FawVqjR/+viVERXrh62NG511KUKAGL60FH52ASmUg'
          + 'PFRNsF6Fv6+B6KZe+PqUEhGmRB+kQOtTAgFeVJj3Wazkjwr+pZL3Vfm/io5hofwxJbxg43odA0d65uHOokEKPDc3l6CgIACuvfZavvzyS1JTUx16DIVCQVBQEB9++CFz584FIOnIU7SOj0IQHq1wm9at'
          + 'm2IylXLihLOsxtaHT2CgDl+dkQB/E2GhOnTeIiplMUGBKgID1Oi8QaUqRaU0o9Go0KiVqDVKVEoFCoWIIIgoBGtsuvReEET5tVIhoFCIKBTI3wULWi0EBmjw9RHw9gaNuoywUC+8A5SgKQWNNMSwHWoo'
          + 'EAQlYGThwoWMGzfOSdemcdIgBd6qVSuOHTuGTqfj8OHDl+25a4JSqcRisdCrVy8Apk8fyuzZV7NyxWFuuPHrCreZOXM4L7wwVH4ATJkyhbvvvpsjR45QWFhIeno6paWlFBcXc/78eQRBQBRFkpOTadOm'
          + 'DUePHsVsNnP8+HGKi4spKChw96WuJhrAQpNwLXq9SMvmRkJDfPh1HaSl59KkSRPS0tLcfZINigZnZNu+fbscvPDdd985bY01MDCQu+66CwCt1pvZs68FitiwsXK/auuwvYTZrw7l2ed+Y+7cuTz22GPE'
          + 'x8cjCAIKhQJBEBAEAYvFQrNmzQgICLjsuRQXF5OcnMw///xDcXExZWVlFBQUcP78eUwmEyUlJZjNZr766isAYmKC6dWrCSXFBvb8c5a0tHy7/en1wYSF+SMIBpRKE2azClHUkJaWQ35+LgqFgubNm2My'
          + 'mVCprLdQUVERubm5lJVdKnuG1R0vPcNEegYcPAyQK/9veno6giCQk5NDYGCgU363xkaDE/iYMWMA6Ny5M+3btycjI8NBS2cXUCqVZGVlsXXrVgBW/3onZlM+SpWGPXsqHy34+CiAUqY/O4Bnn7NmlFmw'
          + 'YAE33XRTuVpd9lb9S6PT6WjXrh16vZ6UlBRUKpVsMwDQaDSkpaXJAj+w/1H8/NWAD127vl1O4C+9OIhHp/Tg4hWDvYmpdO7yPhaLhcTERDIyMuT/lR5M0rU2m80YjUYsFgtlZWVkZWXJD53s7Gyys7PJ'
          + 'ysqitLRU3s+GDRsACAoK4vjx48TFxTn0d2uMNCiBp6SkkJycDFiDS3JychwubgBvb2/ZW87Hx4cBA+MpLMjG10/L8ePnK90uJlqPxWxBoTRw34Q+fP7F33zxxReMGzeunMAtFgt+fn5VOh+LxYJCoSA4'
          + 'OJijR4+i0Wjs2q1QKJg/fz4AsbER+PlrKSoswMdX4J9/zlSwv0IQiyksvOAALwiQ0LmJ/H7dunU0a9as3INIFEW7Y0uiDwoKIjg4mLi4OHmkYvuvWq3m3LlzXHHFFVgsFlq0aEFWVhZ6vd7hv19jokH5'
          + 'oj/00EMANG3alE6dOlWrF6wOOp2Ob7/9FoBp067gguebipSU/Eq3axKhw2wWMZQZmDatDwBnzpyhoKBA7m3hgjXZ9rOqoFar8fX1tbNGi6KIl5cXa9euBeDBid2BMrRaJWvXVhyHHRWlx2KxX3OTdhkY'
          + 'ZH3oHDx4UB6e23LxA1UURSwWi9yjl5WVUVJSQnFxMYWFhRQUFJCXl0dmZiZeXl4cOHBA3jY4ONgpv19jokEJfPny5QBMmzbNaQEMCoWCs2fPkp9vFfJDk7tTWmLEmo1ByqdUMW3ahGEyWTAYzMS3aYJ0'
          + '+VetWoVWq7X7bkXiudQ5SaKOjIy0E6dCoaC0tJTz560jixtuaIWhzIRKrWLjhortBf7+KiwVNsNC1y7WXvzYsWPykqGjMBgMlJSUsH37dvmzO++806HHaGw0GIG/99578uuRI0dSWlrqlOOo1Wq7ogmh'
          + 'YQGYTBYEQUS0+Fxy29DwYMxmC9aHQRkjR1o9t7Zs2YJabV9dsDoChwu9fkREBGazWX6vVCrtqni2bReNwWAGFOzcmVLhvuLipPO8GAutWoYAVoOYowUOVtuDr68vr7zyCgCLFy+msLAOpt2pJzQYgUup'
          + 'mMaOHevUNLwqlUq20nfuHIm117bOM0tKiirdrnXrJljdXf8bwoomBg5sAcCuXbvQaC6kERZFsdrDc9uhcVBQkJ3AU1JS/jt3b5tzUPJPYkaF+2rZKgSTqSKBi+j11vPMy8tzin0DoKCggPHjx8srCI7s'
          + 'xUtKSigqKmo0TjUNQuApKSly0oD77rvPqQJXKBTycDcuTo+te5ZCqNx77cYb2mCbksVotNC1SwRgzWhysViq2ztKa+aAnfHLVuDNmvnanW9WVmXr6IpKBWARredZ3RFGdcnJyeHFF18EYNmyZdXe/ujR'
          + 'o7z44ot069bNzsKv0+nw9fW1W5Ls3LkzU6ZMkVdFGhINQuBz5swBICwsjNjYWEwm1+Q28vZWIAlGFEHrVfnlHDGyLUbDhfMym0Vioi8M6UtLS+1EXhMBSaL09/dHr9djMpn+G1mU/Hd9JIFbgEAqshd0'
          + '6hSF9UFUUe8scC7DOkq52JjnaEpLS7n++uvl9ytXrrzsNmazmWnTpiEIAvHx8cyaNYs9e/Zcdru9e/fy/vvv069fPwRB4PHHH3dau1xNg1gmk+bfd955JwUFBU4bOsIFqzRAdtaFIbcogqCovNe94opm'
          + 'FBZcsLBbLBaiYi44sdg+lGoyRAfr6EJaMuvQoQP//PMPFotFdtNt1SoAq8CtNoCKuOqq5lSe9ULJP4nWdX7J0cWZ1xmgb9++bN26lYULF9oJ3pb9+/czadIktmzZYvd506ZNGTBgAD169CAuLg5/f38i'
          + 'IqyjpoyMDPLy8jhx4gT79u1j27ZtHDx4EIB3332Xd999l/vvv5958+Y5rY2uoN4L/N9//5Vfjx49utx6sqOxWCzy8s3evRmAH75+IkaDdS6u1/uRnW0/9L3xxo5cXDpFEARysi+c68VDcukhUl2kobog'
          + 'CHTp0oUzZ87I16TYrt5RxUnehg9vhdlormC/AAoSE63r5n379nXaMqREWVkZAwYMYOvWraxZs6bc///999/cdtttnDlzYS1fq9UyefJkxo4di16vp6SkBKPRiMlkQhRFcnKsmTa9vb3R6XRER0czaNAg'
          + 'vLy8KC4uZuHChcyZMwdRFJk/fz7z58/n559/5qabbnJqW51FvR+if/LJJwBERUURFhaG2ezcnEtGo5GuXbsCkJaehSBM4Y47lrJvXy7gz13jE8ptM+XR3piMkqCsQRreOg0FBWK5fZtMJsrKyggNDS23'
          + 'n6q43UqjF6kHjI6OZsiQIQD8+ONBwAeFQgDMeHt7l9t+2LB4SsvK98w+Pmo++3SH/P7KK6/8L4LOudc6IcF6PaVlSbDaXOLi4ujbt68s7rZt2/LVV19x9OhR7r33XiwWC+fOnaOgoIDS0lJMJpPdvWE2'
          + 'mzGZTJSWllJYWEhmZialpaXcddddJCcny+m1AW6++WYGDx7s1LY6i3ov8P/973+A9UcoKiqq0fBco9Hg7++Pr68v3t7eaLXaSo1cRqOR7t27M3ToUPmzb7/dQ/ce7yMIj7D171y77/v4+DJwUFdUai98'
          + '/Xzw9QtA5+PLsl/+pW8/68PpiiuuoH379sTFxdG8eXN69uyJv7+/3X6WLl1KSEhIlW60i0U+efJkWrRoAZjp0mUOOp9AQJCt+BIDB7QBzFQ4tRb8mDTZ6mcwZswYpy1D2mIymWjVqpXdZ+PHjyc6OlrO'
          + 'pd61a1dWr17NqlWrSEhIID09naKionKOOlXBYrFQVFREeno6N998M0lJSQwcOBCAtWvX0qRJk2rv093U+2gy6WZevnw5kZGR1Z4XajQadu3axdKlS2natClRUVE0adKEuLg4YmJiUKlUcs9qMBgwGo2I'
          + 'oigHQyxdupSvv/6aI0eOVLh/tVpDWFgIfn5GCgtFzp4twGS6MP8NDg6uUgndv/76iyuvvBKwrhTMmjVLnk9WhvTTCoLAqlWr5DmsIKg5mjQFg8FM+w7vXjjGn5Pp1SuE0ovKm/r6efPeezt47DGrwHfv'
          + '3o3ZbK5QRLYx9bbuqJJHm8FgqLJxThRFmjZtSkxMTLn/i4yMZN68ebRr147s7Gyn2AMEQSA8PJwlS5bwzDPPABASEiKvotQH6rXAV6xYwY033ghYq2PYBj9UleDg4HK9hC1+fn60a9eOTp060aNHD/r1'
          + '64eXlxelpaUYDAYUCgU+Pj4UFBSwevVqNm7cyJ9//lmlHu7mm2/mp59+qvK5jhkzhu+++05+7+/vf9mc4pLRDazTmcmTJ1/Y321d2LQ5nfT0s8TGhnHixHRKirNkJxdBEPDx1bJ/Xw6dEqwPgrFjx/LS'
          + 'Sy9RVFSEWq1GpVLZZcaRlixTU1MpKSkhNzeXvLw8goKC8PPz48orr5QfklUhNDSUDh062NlWXn31Ve68804yMzOdbgcAa+Tgjh07GD9+PGBdhpRiHuo69VrgjzzyCB9++CHdunXjm2++kQ0o1UGj0bBv'
          + '3z7+97//kZWVRVZWFqdPn77kNuHh4QwYMIChQ4dyxRVXYDab5TBJtVqNVqulqKiIf//9lxMnTqDRaDCbzej1egICAoiPj6dNmzY1avOiRYuYMmUKOTk5tGnThsOHD1/y+7a9OFgtzjfccAOnTp2y+97g'
          + 'wR159JHu9OsXRWCQZG238Nvqowwb/gVgtZwfPnyYxMREduzYwd69ezl69CinT58mNTW1SvYPrVbLgQMHqhzGGxISQq9evcjKyqJp06asXLkStVrtcu+2gIAANm/ezMSJEwHo1asX27Ztc+k51IR6LfCE'
          + 'hAT27dvHfffdx9SpU2v8o2s0Gry8vOTUTEqlkpKSEo4ePUpSUhJ79+5l37598jLKxfTp04eRI0dy/fXXo9VqKS4upqioCI1GIxvk3MnFIgfYsWMHixYtYvv27Taut5emV69edn7ilyMwMBBvb2+ioqJI'
          + 'T08nJSWFa6+9lrlz59oZzS6FXq/nhhtuICkpiVmzZnHzzTe7LdFFQEAAGzdulEdBY8eOlW1AdZV6LXDphp07dy5XXXXVZZINVH/fSqUSlUqFWq2W/w4cOMCGDRtYt24d+/fvL7ddixYtuPXWW3niiScI'
          + 'CQlx9yWSqUjktqxbt46FCxeyaNGiKu+za9euxMfHExsbS0xMDJGRkURERBAUFIRKpZJ94qVpgkqloqSkpMriBqvb7ejRo9m7dy9PPfUUd955p1M9FS+FyWSiV69ezJkzR56Tf/rpp3KvXhdpEAL/7bff'
          + 'CAkJcYkHm0qlQqvVytFf69atY/ny5fz222/lvvvggw/y9ttv4+PjU93DOI2LQ0ltkzSANfvs11+XTzkVHh7OwIED6dWrF3379iU8PNxu+Un6s1gsWCyWcnHhtserDkFBQdx6663s27eP6dOnc/vtt7tN'
          + '4FKMfocOHRg9ejQ//PADAIcPH67xlMvZ1FuBnzp1iubNmwPW0MWqWKIdjSAI8vDe29ubZcuW8dNPP7F582a7711//fWsWLHC3ZesQiTR3XLLLfz88892/5eQkMCoUaO44YYb8Pf3l51GDAZDjZahaoJe'
          + 'r+e6667j33//5bnnnuO2225zm8BFUUSpVNKjRw/A6mMg+fnXVRnV23Vw2xBIpVLplgssiiJlZWXk5eVx6tQp7rjjDjZt2oQoitxzzz3y91auXIkgCBfVTKsbCIJAUVGRLG6VSsWHH36IKIp8++233HDD'
          + 'DRgMBjunEVeJG6zLbtLDW61Wu11Itqsjth50l1uydBf1VuDSxQ0MDMRsNjvV//xSSCJv2bKl3Zz7yy+/JCMjgy+//FL+7NFHH+Waa65x74WrAB8fHz755BMWLlyI0WiUM+NERUWRm5vrdO/ASyEIgrwU'
          + '1qRJE5c+XCo6F8mmICF1NBkZGUyYMMFt51YZ9VbgkrNBRESE2350URQxGo3ExcURGRkJIM8/wRrdds899yCKIs8++ywA7du3r/VxBw8eTMeOHR3algcffLBcTnI/Pz8iIyPdJnBpSCytjuh0Orf34NJ5'
          + 'ScTGxsrBTl9++SWrVq1y9+nZUW8FLqVk8vb2dtuPbjKZiIiIICoqCrCK+2KjlcSrr76KKIpykYSasmbNGtauXcuBAwcq9Z6rLSdPnpQdaiQnIHdc44uvozsfNtI1kFZXbJkyZYrsZXj99ddf1vnIldRb'
          + 'gUtPdS8vL7fcfGazGV9fX1kA0lKQs6cK77//vvzakYa7PXv2MHXqVMB6w0rppwE6duxIWVmZy6+zUqmUfc7B6nXoziG6KIqVZrrdvHmzHMNv61p77tw5tm/fzqZNm9i5cydnz5516TnXW4FLxo7AwECX'
          + '33jSPKxz587AhZ67MubNm0eXLl0ccuxff/1Vfv3xxx87rE3dunVj7ty5CIIgPzjefvttwOoS27ZtW5c8wGxRqVR24cDu+K1tMZvNhIWFVfr/0rQxPz+fpk2byr7svXv35uqrr6Znz540adJEHuV1796d'
          + 'N954w6nnXG8FXlRkzSzijnmZwWCgXbt2QMVryRfz+OOPk5iYyIcfflir41681p6cnOywqK41a9aUC1F98sknEQSBkSNH8vvvv5OWlkZAQAChoaH4+/vj7e3t1NRNKpVKTqMcHx/v9PDUS2GxWFCr1bKt'
          + 'pSICAwP5448/AMqVYKqoUsvu3bt55plnEARBHj05mnorcMlrTaVSuVTgFouFgIAAOSF/VZw3pB9v2rRptTr2Sy+9BMD91w0moUUsgMNcYQcPHsxbb70lv5ceYGDNiTZu3Dhuuukm2rRpQ58+fXjyySdZ'
          + 'unQpZ8+eJSQkhJCQEPz9/dHpdGi1WlQqVbmw1eqiVqvllEsdO3Z0qCOT5KVYlRGJKIqYTCY6dep02e/279+fo0ePMm3aNPbu3YsoinKiCel1RkYGf/zxB08//bS8nTR6cvT8vd46uowdO5ZvvvmGW265'
          + 'hVmzZlXL/bGmiKKIwWCgR48e5ZIlFBQUsGTJErZt28bevXtJS0sjPT2dQYMGsW7dOvlGevTRR2tkaEtPT5d7j4NzZ6OwWGj72PMATJw4kU8//bRWbVu7dq0ca/78888za9YsSkpKWLx4MStWrJBzzldG'
          + 'TEwMCQkJxMfH07JlS6Kjo4mJicHb2xtBEOSAHGnkVRVCQ0Pp1q0bubm5zJw5kxEjRtQqY49Wq8XHxwdRFDl58iSlpaU0b94cPz8/ioqKyuUTEEVRdrft2rUrOp2uVte4Mj799FMmTZokv9+zZ4/DpnT1'
          + 'VuATJkzgyy+/ZPjw4cyZM8cllktbV0WwetO9//77fPDBB5cMWxRF0S5Uc/fu3dXueaUbLy6qKcc/fBWMJl7+6VdmLLE6qNQm8GHJkiXcfvvtwKWjpNLS0vjmm29YunQpW7duRa1WVylcMyAggICAAIYM'
          + 'GcKjjz5aJZELgiDP/cFqewgLC6tRL65SqQgLC2P58uV89tln5WIIgoKCeOihh5g8ebKcMEIURdRqNSEhIcTFxTklB7wtJpMJnU4nX89//vlHtvHUhnor8KlTpzJ37lx69uzJwoULnVbJREKtVuPv709O'
          + 'Tg7ff/89n3/+ebljRkREcN1115GQkECbNm1o1qwZrVu3lv+/Z8+ecuRWdS57YGCg/ADL/up9tAKYzGb8Q4K5/+MFfL5mg3z86pZKlkZCAK1btyYpKalK250/f578/HxMJhO7du0iMTGRffv28e+//9pZ'
          + 'vi/m+PHjVUqYoNFoOHz4MGPHjgWsufdqUinW19eXrKwsRo0addnjdunShccee8ytNcr9/f3laLnTp08THR1dq/3V26SLUvqc/Pz8GmUgrSoKhQK9Xk9SUhIPPvhgudDKXr168dhjj3Hbbbdddl87duyQ'
          + 'e2LbPOaVkZeXZ2ec2fnWDAI0KgrLDCAI5GdmMX/SeLo0i+KheQs5e/YsgiDwxBNPyBbwynjllVd44YUX5PcjRozgl19+uWwbJJtDaGgoSUlJqNVqOSGGbQKIsrIyzp07R2pqKidOnCA3N5cBAwZUOWbf'
          + 'toJMTExMjaz3gYGBbNq0yS7aa/jw4bz00kv07NkTgNTUVN59913mzJnDP//8w/jx41myZInbHFby8/PRarUYDAZiYmJqbV+qtz34Dz/8wOjRo9HpdOzfv98paXSkAIvHHnvMLoBEr9fz8MMPM27cOFq2'
          + 'bFmtfZaWltrN3ysbrj/99NO8+eabF743ZxZdI0PIL7koJFYU8ff14VD6OTo8/hKi5YIjSLdu3RgwYAAxMTGcP3+exMRENm/eXG46s2LFikpTEl+MbdhpamoqycnJlRYhlFI3ScYsg8FQ5SF2YGAgEyZM'
          + 'YMuWLYwaNYqZM2dWy84SEBDA+vXrefjhhwHrgzo1NfWSPuM33XST/JALCwurUYYgRyE90KKjoy+bgOSS+6mvAj906JDs9pmcnOxwB4ImTZrwzjvv2BnEgoOD+frrr7nuuutqte+LRd63b19effVVBEFg'
          + '2bJlvPvuhTxpIfogjr07Cz+lgsJLLBNpVUq0gQG8/8saHvt6CZbLeHxptVreeustHnnkkWqfv+3KwV9//VVla3R19i/lxbNYLLz++usMHTq0ykuC3t7eHDx4kDvuuAOwupPaBiddioULF3LXXXcB1odM'
          + 'TbIEOYKTJ0/K9dFfffVV2dW5utRbgcOFp9yKFSto0qSJw5ZRgoKCGDZsmHxTqNVqPvjgA2699Vb0er283FHbqcGAAQPkddOKaNM8hsMLP6DkxCmMVfTg8vPSIuh0bD1whNWJB9hz8jQ5BhOBGhVNgvV8'
          + '+ftGwLqWf3HBw6pi24snJSWRlZXlUCOU5FAjhWX+8ccf+Pj4VMlNValUyk4kYH1QX7wmfTm2bt1Kv379AOjQoUOFiT1cwfTp03n99deBmi811tt1cEDuBbdt22ZXvK+2qFQqWdz33Xcfx48fp2fPnvIo'
          + '4XKOLVVl48aN/Pvvv9xyyy0olUq0Wi2jRo2Si+4dST7NI29+jLdP1ZdnCkrLyM/OoVtMU2bdch2rnn6YrS9O5deXn6RVqLVgQ0hISI3FLbVfuuH0er3D3UdVKpWdqOLi4qrsgx4eHs7w4cPl99UVN1hH'
          + 'VOvXrwfgwIEDPPnkk5w7d87pXmcX89prr8mv77333hrto14L/JZbbgHg999/r3ElkIrIzs7mjz/+4LfffmPatGmkpaWVGx46akjasmVLfvzxRzkJ/w8//EBubq5sAPtw5RqOpJ1DU80essxkIr+klPzC'
          + 'IvILisBs5qWfrPW9nnvuOYddK2fUKLN1cGnVqlWVh+YBAQG89tprnDt3DqBcYsnqMHDgQGbPng1YXXbDw8N55pln2LBhg0PbejmkFFpfffVVjbav1wKX5ko7d+50WK8KVp9jnU5HcHCw3VKYdCNfHBPs'
          + 'DGbOnCkvsT385Td46bxrvC+NUsnh5BQM/wnFEW6R0rV2RrCPSqWSs8UmJCRUaeqlVCrJycmRK928++67FeZTrw7Tp08v570mFUJwFbalk7///vtqb1+vBW6bPOG7775zaC9usVjKDQttfaFdEXSxcOFC'
          + 'ANbvPQAiKGp4TC+thk/WWlcBbNfla8PlkjjWBrVazd69ewHrHLgqzjShoaHcd9998vslS5Y45Fyk8wB45513HN7WqjB69GgA5s+fX+1t67XAwZokEGD27NkVOvQ7CtvMIlVZw3YEvXr1kl9/svYPdJoa'
          + 'zJtFEby9WLDxL4AaWc1djUajkdM0derU6bI9uFarZf369Rw6dEj+bPv27Xa9X02xTcv02GOPueV6SKG769atq/a29V7gUnlXqTKkr6+v045lOxd0VdjklClTAHhrxVoUOh1U88GiVio5lZZBwX/uodK6'
          + 'cF1FpVLZCbVVq1aXFXhwcLDcrmuuuUYOmlm8eHGV6oNfCinxhTtTYEsrAjWh3gtcrVbLvfgLL7wgO1g4GmmO78jc61XhxRdfBODk2QyycvJQVdPY5qVRs/hPa7GCiiqW1uZ6gOMzvajVanbv3g1Ye2Zf'
          + 'X99L2ju0Wi2//fabHIQya9Ys7rjjDuLj4wGrs09tkEJ0JYOuO7B1V61OsA64SeBZWVls2bKFr776ihkzZnDPPfdwzTXX0LFjR2JiYggPDycyMpJ27doxfPhwXn75Zf75559K92drYRw5cqTTqkAKguCS'
          + 'qDVb9Ho9QUFBAHy0ZiM6bfWWAwWtlgWbrcEj999/v8POSxK20Wh06GjG1kW1d+/elJWVXXL/AQEBvPrqq4A1VDMkJIS0tDS+/fZb+TvTp0+v8flI952UksndVFfgTnF0SUpK4siRIyQnJ/Pvv/9y+PBh'
          + 'Dh065BBvsxdffNGudrPE7t275aHMAw88wFNPPeXwXOlms5nw8HBatGhRoyT+NeXll19mxowZ+Oh0FC75lPzM7CptpxCsGVMVo63CPnHiBLGxsQ45JylFVU5ODgcPHqzVurotYWFhdOvWjZycHJ5++mnG'
          + 'jh1baR50pVJJfn4+gwYNAqzpqZs0aYLRaMTf35+PPvqIjz76CKi5Y49UoWXjxo1cffXVDmljTZDutZKSkmoZkx0i8C1btvDuu++yYsWKamXdaNKkCbGxscTFxREaGkqzZs3w9vYmNDSUoqIicnNzSUpK'
          + 'Yv369eWK7P3+++9ce+21dp9JEWYAH330EQMGDHBoj2uxWNBqtbLvuG3lTmcj/cBbX51O1+imlFVh6UinUfPzngPc9o516ciRz3Kp7SkpKZw6dcohmV2kaykFgqxdu5agoKBK5+A+Pj7MmTOHBQsWEBAQ'
          + 'wN69e+06kcjISGJjYzGbzXTv3r3KNdhs8fX1paioqFr++o4mMTFRjg+v7m9Yq1/FYDAQFRVVYaCHWq2mRYsWxMfHExcXR9u2bWndujWtWrW6ZNqbS2EbATV48OBy5Xffe+89/vjjD/bu3ctDDz3Et99+'
          + 'S6dOnRxWrE4qEmD73lX079+fTZs2cfcnX5P08euUnc+CyxxfpdGwZMsOwBpI4Shs3XRzc3Md9pDTarVyAQalUknLli0vGfBhMpno2rUrCxYsYNq0aeWCaLKysvjqq68YP348u3btYtu2bfTu3bta5xQV'
          + 'FUVSUhJJSUluE/iPP/4IWOveVZca9+BFRUV2Fut+/foxceJEBg4cSNOmTZ3a4EGDBskeRT4+PuWqiur1ejlIYMmSJXTs2NFhIjcYDHTt2hUfHx+X9uBpaWnydd044ymubNmcokuMlgTALzAA4WZrhZUN'
          + 'GzYwYMAAh5yLs4JN9Ho948aNY/v27YwYMYLXXnvtsiMwrVYrZ2SpKNtLREQEI0eOJDExscJ75XKMHDmSZcuW8cADD/DZZ5855PpVF6VSicViYfbs2dW2J9T47rS17J0/f56//vqLcePGOV3cAOvXr5cL'
          + '5ElpdmyHZtnZ2XLww5gxY9i1a5fD1sgVCoXs3ebKHjwyMpKhQ4cCMGDGmyi9vVAqKj++j1bLwj+2yu8dJW5b8vPzHWaLkFYppPLEw4YNq9KKRVlZGZmZmZWmcjp//rxcMkoaalcHKehE8k13NevXr5dX'
          + 'EWpiLKyRwDMyMuQesqioyC1rhOPHj7cbvjVp0oRjx47J76UUOGB1af3555+JiIio9c2oUCjIzr5g5HJlMN7q1avl160eeRYffVCFIlcIAgo/X+750Fo2yRnWc7DeB46KIvPy8rJzxRwyZIhDliTNZjMR'
          + 'ERGyvUZyb64qQ4YMAayZaNzBsGHDgJpPsWokcNvUOc5KRFcVwsLC5NxZYHWKsI3fLSoqkuf7zz77LJMmTSIsLKxWkWe2mS/dUQ8tMTERgGNpZ4m7fxo+/v74/VfKGFFEq1LiGxZKwmMvYfkv+YPkDOQI'
          + 'bHvszMxMh01R9Ho9c+bMAeDGG290WDposNoJpACbnJwcduzYUeVtbX3RXV0h9sUXX5S9J2vihw41FLhtSl3b1+7CYDDIN5qUzlgiNTVVzha6evVqWrVqxalTpwgNDa3RzSm5qVZ3LucoEhIS5KwjJzPO'
          + 'Idx8Dz/s2Y9/WAj+4aGczi0g+u5H2Xf8hNxmRyKJu6CgAJPJ5JCHnJeXF6tWrZJHRk888YRDr6/ZbCY6OpqEhAQAOfllVZGcXJ5//nmHndPlSEtLY9asWQDMmDGjxqsUNTaybdy40S6y5scff3Srt4/Z'
          + 'bJYvQnx8fLm6XV988YVdMMI111zD22+/jVarleeSVcVkMhETE0N0dLRL18Nt2bdvn3zDVsb333/Prbfe6rBj2gaYHD16lMzMzFoP0aXqHy1atMBsNjNo0CA+/fTTGiVYvBQajYakpCQ5e2xhYSE+Pj5V'
          + '2vbo0aOyZ1xKSopL7EzSPVWTRJq21Hh8NWDAAH7//Xf5/ahRoxAEgSuvvJIPPvhArkjhKpRKJQcPHgSsjjYXp/6dMGECpaWlci2xdevW0blzZ2bOnImfnx/+/v5VFqrtPFwQBLfUy+rUqROiKMppiWxp'
          + '06YNaWlpDhW3hHSNMjIyHDI8j4iIYMKECXLk3htvvOGUNEkGg4G+ffvKtcWqY7Bq3bq17CDUt2/fcv//3XffccUVVzjsXG0dWWojbnCQo8vo0aP54YcfLvmdxMTEy/Y4juDqq69m06ZNtG/fvtKHzI8/'
          + '/lju5r/77rt58sknUSgUl+3RpQIIV111lfzeXfXJJRITEykuLq7wBnQEtr332bNnOXbsWK2910JDQ5k3b56cKeW1117jhhtucNr0R6fTsWjRIjkYpTq3/pkzZ+T48nnz5tkZLiVvt+HDh9c6G2t0dDQp'
          + 'KSnyMaXKtTXFIRaS77//HlEUWb16Nffcc0+FQQ2OSOJeFaT6X1JvXhGjRo1CFEW7Sp0LFiygffv2zJo1Cz8/P/z8/CoVrbSkU12/YGfSuXNnp4nbtt2AQzzXwsPDWbRokSzu6667jjFjxjjVtlFSUsL4'
          + '8ePl9xs3bqzyttHR0bKoH3jgAf7880/5/6SCkL/++mutykNrtVpZ3Dt37qy1uMHBwSZDhw7lyy+/5Ny5c4iiyNmzZ+Wc1JeqyuhIpKojgF2q44p45JFHEEVRtt4CfPPNN7Rr144PP/yQ0NDQSudptuvh'
          + 'DR3bEcq5c+dqFWCiVCqJjIzkueeeY8aMGYC17tgnn3zi9DTFoiii1WrlZI6Xyx1/MfPmzZNXZa666irZ627w4MFyzPbUqVOrXYNOykgkuXnv2LGjViGitjjVDSs8PFx+Ikvrea5AevLt27evSt9//PHH'
          + 'y/Xon3zyCXFxcSxevJiIiIhyy4EKhUJ20XXXPNxV2A5ljx07VuPe29/fH6VSSc+ePeVqKn369GHlypW1nmtWleLiYtnQZluKuaqkpqbKSTFvueUW+vbtS3p6Ot9++y2jRo0CYM6cOcTExFRphHfTTTfJ'
          + 'vvdgtZ5LDyBH4HQ/Syl4v02bNs4+lIw0HXjkkUeqNSeSenSpiifA66+/TvPmzfn5558JDw+XhS6FjjozdVFdQTKmnTlz5rK10CvCy8uLiIgIPvroI7p27Sp7HU6ZMoXvv/+e9PR0lzkMlZWV2fmU//XX'
          + 'X9XeR25uruw48/fffxMZGUl4eDhXX321bG0/c+YMvr6+3HHHHeVWdE6fPs2jjz6KIAjykmf37t3lfPCOxOl50UNCQsjKymLJkiVVKu/jCGJjY0lOTpbft2zZkg0bNlS7ztMjjzxSrqb3jBkzuOuuuygo'
          + 'KCA/P58WLVoQERFRJwxtzqA2fucqlYqQkBDWrFnDgw8+KItYrVazdOlSWrZs6ZZpTnBwMCNGjODQoUO1qsy6a9cubrnllipXHomKipLn2LYsX76cG264wSltdXoPLq1numLtUEIStzT0OXbsGDExMVx1'
          + '1VUVXuDK+OCDDxBFkQkTJsifzZgxg9jYWH7++WeioqLs/NIb8jD9zJkzVc5cKwgCer2evLw8rrnmGiZOnCiLe/LkyRw7dozIyEi32TBKS0tlF9TLrf5ciu7du3Pq1ClOnz7Nyy+/zNVXX014eDhNmjRh'
          + 'xowZrF271i7Jpe29FxMTw4IFCxBF0WniBhf04NINcezYsRqFu9XmmKIokpyczPXXX29nVY+NjeXll1+udhVJqWSxLVUp9Fdfse29t2zZIlcNuRS+vr4IgsD06dPtaor379+f9957T3YscicqlYq0tDRu'
          + 'vPFGuZ3OZufOnaSkpBAUFOTSxBEuE7gjs4nUhJ07d3L33XfbJfQDq0fbhAkTuO2226o89IyIiLCz+Pbv35/7779fLnXbUJAEnp2dzaFDhy657u3l5YVer2fevHm88sor8ufh4eHMmzePDh06kJWVVWdG'
          + 'OaGhoXKH8+effzrUUaUu4bKcbJWl3XEVPXr04ODBg2RkZPDAAw/In69bt47bb78dhUKBRqNhyJAhvPDCC3z//ffs2bOHEydOsGfPHhYtWsSUKVOIjIyUxS35NG/atIk777wTQRDsDHT1Gdvn/tmzZyv1'
          + 'WvPy8qJp06b89ddftGrVyk7cb731Fjt27CAqKopz587VGXFL7ZMcV7Zu3VrLvdVdnN6De3t7U1paynfffScncHcHpaWl8pzPz88PhULBzz//zLZt28oZ0qrCddddx7x58ygsLGT+/PnlhumzZs1yaXCC'
          + 'o7FNZnGxcU2pVOLt7Y2vry8rV67kmWeesXNQGTt2LDNnzqSoqMjtD/bK8Pf356mnnmLlypVcf/31Lo8UcxVOF/g111zD+vXruffee/niiy9c3sCSkhIOHz5MYWGhXWCEQqFAq9Wi1WrR6XScPHmSrVu3'
          + 'kpiYyNGjRzl16pTdXDEgIIBWrVrRvXt3RowYQYsWLcjOzkYQBHQ6HT4+Pnz22WflCtS98MILzJw50+Xtrg22S3+ZmZkcOXIELy8vtFotPj4+ZGRksHDhQubPn29X/WXIkCG88sor+Pn5kZeX59JY+eqi'
          + '0+lYsmQJs2fPRq/XOzy4pa7gdIF/+umnTJo0CYVCUeUKkY6iqKiIXbt2odFoLmsBViqVaDQa1Go1SqVS7rHKysrQarWIoojJZMJgMFBWVlZhIkAfHx90Oh0ffvihXY1vsIbVTpgwgeHDh7vUJ6C6XJyG'
          + '6vDhw/j4+HDq1ClWrlzJDz/8wMmTJ+22ufbaa5k1axZ6vZ7c3Nw6NRSvDLVazZEjR2S7SV1+GNUGl9QHt7XEOttf2pbt27e7NG+ahK+vLzqdjs8++4z33nvvkplJNBoNSqVSNmhJhRukGtlwYb4YGBiI'
          + 'Wq2mZcuWaLVaWrRogZ+fH1FRUYSEhKDX64mOjnZIhlOAhx56iB07drBr164K23jXXXdx//334+3tTX5+vssf4LVBEAQ0Go2crfT8+fNurV7itHa6QuDXXnst69atIzIyktTUVJc0LDs7m4MHDzq0bnh1'
          + '0el0+Pn5sXfvXn766Sc2b95cq5K2NcXf3x8/Pz+5BnmzZs3Q6XQIgoDZbCYvL49Tp06Rl5dHXl4eN954o90Sl217br75Zm6//XbatWtHYWEhJSUl9aLHroiwsDDi4uIA5zqbuBOXCDwzM1OOMHv22Wfl'
          + 'ShTO5MCBAxQUFLi8964ItVqNl5eXPFXIyMggLS2NoqIiLBaL7P4p9dxSj24wGCgtLSU/P5+ioiLKyso4f/48xcXFZGdnk5mZSUFBAWfPnqW4uNjhw8zWrVvTvXt3unfvTu/evYmMjJSzl1alpG9dR6/X'
          + 'c/3113P06NF6bxStDMeM5S5DSEgITz75JG+99RazZ8/GYDDIMbnOIicnx2HVNmqL0Wi0K4GrVquJi4ursleYbb01aeguPQxsh/MKhQKTycT58+cpKCjAYDCQmZlJYWEhJpOJkpISiouLKSkpwWw2Y7FY'
          + '5KlBcHCwPMRv2bIlPj4+GAwG+dwNBgPp6ekNyh3XbDbTsmVLjh49WuXApPqGS3pwiSFDhshZYKKiotixY0eNneuzsrJo3rw5FoulXNROfn4+e/fudevw3J1IgpdEb2tglF5fLFRpJGE2m2XxNyQxV4S0'
          + '8vHhhx9eMkFIfcYlPbjEmjVrePrpp3nzzTdJSUkhMjKSuLg47rrrLgYNGkSrVq0qjBuXYsu3bt3KX3/9xTfffMO5c+cqPU5dGZpXB5VKhSiKDjFUOWJO3NDFDdYevHnz5oA1zVdDxKU9uMTp06fp37+/'
          + 'XcRXTQkNDWXdunV26W0dWS/LFfj6+nL8+HHUajVhYWH1fn4r3VK2t1ZVA1VciVqt5tixY3KUY0NcKnNLNxcTE8PJkyc5ceIEjz32mGzJrAr9+/fnnXfekbNpnD9/noSEBLvkg15eXvXmxwoKCmLjxo2M'
          + 'GDGC4cOH4+/v7+5TqjEWiwWTySTbGyQHIK1Wi9lsxmAw1CmLu8ViISIiQn5fX+6Z6uCWHvxS5Ofnk5mZidFoRBRFvL29CQsLw9vbu9x3zWYzHTt2tKs8KkWtObJmljMQRZHg4GB+/fVXpk6dClhDajdu'
          + '3GhXOaWuI4qi7AQkJXYICwtDKxVjsKGoqIjjx4+Tl5eHWq2uE79NeHi4HAR19OhROetuQ6HOTVT9/f2Ji4sjPj6eNm3ayCWFK0KpVHLo0CG7EM6WLVvy0EMP0adPH9RqdZ19KoeHh/PNN9/I4o6NjWXL'
          + 'li1OSRnsDERRxGKxYDAY8PX1pVOnTvTo0YPo6OgKxQ1Wo1anTp1o1qyZ/AB3N6Ioyi7M//77r7tPx+HUOYHXhHvuuQeLxSI/fT/++GNUKhV5eXmEhITUiZ5CQhAEmjZtyltvvSUnHezWrRt//vknGRkZ'
          + 'deKmvxySsHU6Hd27d6djx45ynrKqEBMTQ1hYWJ3wfDObzfJKzokTJ9x9Og6nQQgcLlTb+Oijj+TPBg0axKRJk/D3969yFQtn4uXlRXh4OGPGjOGTTz6RPz9y5Agmk6lOi1vqsSXf/M6dO5OQkFDj2nTx'
          + '8fEoFAq3t9lisciZUj0CrwdMnjwZURRp27YtYI33btu2Lb/88guRkZGVDh+dhSAIeHt7ExkZybZt22jevDlbtmwBkFNBFRUVsWfPnjrjmGOLtHRnMBjw9vamc+fOdO3a1SHGwJYtW7p9xUCqWwaUC6Jp'
          + 'CDQ4gUscOnSIH3/8UX7/wgsv0LFjR9m5prJ5vSNQKpXodDqCg4Px9fVl2bJldO/enQcffFD+zg8//MDnn38uryB88803Tj2nqiCJWbKEl5WVYTAYCAwMpEuXLnTu3NmhVv7Q0FC320nMZnOD7sHrnBXd'
          + 'Gdx1110sXLhQfh8UFMT06dMZPXp0jX2rJRdPlUqFSqVCrVbLPudJSUmsW7eOX3/9lf3799ttN3jwYNasWSO//+yzz2ThJycnyymFXYWtFVxKlujv7y9PaxxV/7syzpw5w+nTp93ms+Dt7c2yZct48cUX'
          + 'CQwMrDdGzqrSKAQOVu+2kSNHsmHDBrvP77zzTm677TY6deokx3lf7Kdt6/IpBYOoVCqMRiOnTp1i3759/PPPP+zZs8duyc6WcePGMXfuXIKCgsr9n2QE/OWXX4iOjrbzW3cGkqgl11TJB706hjJHYTKZ'
          + '2Lp1qxyI42o0Gg179uyRK882NDk0GoFL5OTkMHHixArT5Xbs2JG2bdsSERFBSEgIGo1GDqfMzs6mpKSEtLQ0MjIyOHXq1CUrV3h5eTF27Fjuvffey8bAR0ZGkp6ezuTJk5k0aZJTa55ZLBaMRiN+fn6E'
          + 'hIQQHh7udp/9vXv3Ulxc7Bb3YrVazdGjR+VqJw1NDo1O4La8++67vP7665f0a68qffv2pX///gwaNIhBgwZVa9upU6cyd+5cunTpwpIlS5wyTJSG4T4+PrRp08bt831bUlNTSU5OdsswXalUUlxcTP/+'
          + '/eXr1JBo1AKXEEWRFStWsGXLFhITE0lNTSU3Nxej0YhGo8HHx4fAwEBCQkKIiIigefPmtGrVik6dOsnW+tqwevVqhg8fDlgrdzqyTpdkODMajcTFxcmZROsSRqORv//+2y3DdGmprlevXoA1OaerV1qc'
          + 'iUfgdYCysjK56Puff/6Jl5eXw6LKjEYjzZo1IyYmpk45/FzMtm3bANdHsUmG0m7dugHW5CTBwcHuvhwOo8Euk9UnbHuMAwcOOGSoKgV19OvXj2bNmtVpcYM1os4dfY0oinbOOs6sT+4OPAKvI0iZVg8f'
          + 'PlxrgUvD8j59+jh9mctR+Pj4uG3+a2tk9Ajcg1OQ4tlPnjxZK1GKokhZWRkdOnRwd5OqhU6nc1sPbnu9PQL34BQk41dhYWGthtOSMS0wMNDdTaoW3t7ebhH4xVVhnblE6Q48Aq8j+Pr6AtZ1+pquB5vN'
          + 'ZgICAqpdB70u4C6Bg7UXl1xwPQL34BSkm7umGU+kde6OHTu6uyk1wp0+6aIoyobOupRxxhF4BF5HKCkpASAwMLBGN7rFYqlzse/VRRAEt4ncNutsQ8Ij8DqCFGRSU2OTlAKqPuOugBNBEOQHbF0M2a0N'
          + 'HoHXERITEwFo1qxZjZxczGazPI+vr7hrSU8QBAoKCgCPwD04CamyRtu2basdTWaxWPD29q4TWWtqgzsyvFy8TFbfH5IX4xF4HUAaHoI1P1t1Y9MtFotc+60+445oMkEQ7K53fVtevBwegdcBVq9eLb+O'
          + 'iYmp9hDdYrHU+/k3uMfAJQgCeXl58vuKKuvUZ+pH6Y86zPHjx0lOTiYjI4O8vDyMRiNmsxmtVoufnx9NmjQhPj7+kmvTUhGHPn362PXmVUEa0vr5+bn7UtQadwhcoVCQn58vv9fr9e6+DA7FI/BqsGHD'
          + 'BpYvX87vv/9eaeaWS9GiRQvGjRvHww8/bNfjLl68GLBmgS0rK6vWPqXiEA0BdwhcqVQ6pIRWXcUj8Etw+vRpPvnkExYtWkRqauolvytlgAkPD0ehUJCeno7JZLJLJnH8+HFmzJjBjBkzaNasGatWrbIz'
          + '6txwww01Enh9Lndki7sEfurUKaDh9d7gEXiFzJw5k9dee43S0tJy/9euXTuuvPJKEhISaNOmjZyhVcprLnlCSTncVCoV+fn5HDp0iN9++41ffvmF3NxcTp06RYcOHWSBx8fHExISwrlz56p1o3t68Nqh'
          + 'VCo5c+YMcCGiryHhEbgN9957L1999ZXdZ+Hh4dx0000MGjSInj17yqmEjUYjJpOJ/Px8cnNzL3lzCoJAq1at6NChAy+//DL79+/nqaee4tChQ3L00hNPPEF+fn6D86SqDu5ou0qlkksHJyQkuPsSOL59'
          + '7j6BusDvv//OkCFD7D6bOHEiY8eOJTo6mqKiIsrKyipNpXS5G1MURYxGI0ajkYKCApo0acKGDRu49dZb+fPPPwkMDGTw4ME1SpksiqKcDaa+4w4/cJVKxaFDhwDo3r27uy+Bw2n0y2QPPvignbhnzZpF'
          + 'cnIyjzzyCN7e3mRkZFBYWOiwVMaCIGA0Gjl9+jRz5sxh2LBhfPvtt2RmZtZ4n/UlqcPlcIfA1Wo1WVlZAHJetoZEo+7Br7/+elatWgVA165dWbJkCWVlZS4pPmCxWFAoFLz99ts1KrzQEHG1wFUqlexB'
          + 'CNC+fXt3XwKH02h78HvvvVcW94QJE1i2bBk5OTkujQe2WCwUFBTUWtwNJcTRYrG4dB6uVqvZs2cPQIMxVF5Mo+zB16xZIxvTHnzwQZ555pnLLoPVVURRbDD+064exajVanbu3AlQ7Vz29YVG2YMPHToU'
          + 'sBpVnn/+eZfXA3MUoiiiUCgajJHN2SWbLsbLy0uu9Dp48GB3N98pNDqBS15jAF999RVpaWnuPqUaI4pivY8gu7g9rhqiKxQK8vLy5CoyI0aMcHfzndNOd5+Aq3nrrbcAq4FNo9HU+/lrQ7GgS7gqXFSt'
          + 'VrN582b5fV2s+OIIGp3A9+7dC8CoUaMaXIK9+o4rDV1arZb169cDDXf+DY1M4FLWFLAWC3T1nM/DpXFVbnTJvfePP/4A4JZbbnF3051GoxK4ZDENDg5GqVQ2iEqSDaENEq6afyuVSs6ePSuHiY4cOdLd'
          + 'TXcajUrg0lJYdHR0g3Esacy+6zVFo9HIvTdAkyZN3H1KTqNRCVzK3BEREVHvjWseao5Wq5UNbNdff727T8epNCqBSxZng8HQYHo+R5QZriu4yiai0Wjk6ZrkE9FQaVQCDwoKAiAtLc0tCf4cjSAIFcas'
          + '11dcES4rCAIGg0EO7vEIvAERGRkJQHZ2doMQOLjevdNZSL23swWuVqvZunWr/L5FixbubrpTaRh3eRWJj48HqHbWlLqKVOrHYDC4+1RqTV5enkt+E41Gw/bt2wFrDvqGTqMSeJ8+feTXKSkpDcILTBAE'
          + 'u6yg9ZWMjAyX/B5qtZrdu3cDcN1117m72U6nUQnctofYtWtXgyhTo1AoOH/+vLtPo9ZkZWW5pAe3FXhDCdK5FI1K4AD9+/cHYMuWLWg0GnefTq2RBF6fl/1OnTqFUql0usBVKhVHjx6V37/yyivubrrT'
          + 'aXQCv/nmmwFrHjadTufu06k1giDYpf6tb5hMJlngzkaj0bBx40a7zyZOnOjuS+BUGp3Ax44dC0BhYaHLbixnI6X+rY+9+O7du1Gr1S4zsEkOLlIlmHnz5tUqH15dp9EJPDg4WB6af/fddw1iHiYIAmq1'
          + 'Wo6Uqy+kpKRgNBpdtmTp5eXF33//DcD8+fNlF9WoqCh3Xwqn0egEDvD0008D1h/ZndUkNRoNOp3OIYXvFQoFRUVFnDhxwm3tqQ5Go5ETJ044pO1VQaVScfDgQfl9ly5d+O677wAoKyujQ4cO7r4kTqFR'
          + 'Cvz5558HrDfZpk2b3GJs8/f3JzExkS+++IKMjAyH5FVTqVSkpqZy8uRJl7enurhyaA72ASahoaGoVCr0ej1z584F4ODBgw0y6UOjFLhGo6Fnz56A1ZIqubC6Cq1Wy8aNG7n33nuZO3cu1113HevXrycy'
          + 'MrJWPZo0VD9z5kydFnliYqKcNtpVaLVa/vzzTwCuvvpqSktLKSwsZNiwYbz++usAnDlzBkEQyM3NdfclchiNUuCAnFX1yJEj7Nu3z2Vr4qIoEhAQwHPPPWf3+ZQpU7jmmmvIzc0lNDS0xucjCAJarZYz'
          + 'Z86QkZHhkjZVhyNHjlBYWOhy46aXlxfbtm0DrAKXvP+ys7MZOXIkixYtkr8bFBTE119/7e5L5RAarcDbtWtHy5YtAau4QkJCXHJcKdmf1EucP3+e4cOHA3D06FGuueYa7rjjDk6dOkVERAR+fn41mkJo'
          + 'NBqOHDlSp5xgEhMTyczMdLmDkVqtlt1TAQYOHGjn3pubm0tCQgLbtm2Tja533313g8i02mgFDsg5uZKTk1mxYoVLcoKpVCr+/fdf+X1ISAirVq0iMTFRrhm+fft2br75Ztq2bcvrr7/OoUOHiIiIICgo'
          + 'CB8fnyoN46We/PDhw27P+V5UVMSWLVsoLi52i/egVqtlzZo1AMTFxaFWq8tlwikuLkalUnHkyBEGDhwIwNq1a1EoFBQUFLj1+tWGRi3wmJgY2R/54YcfxtfX1+lGH9sSw7YkJCSQmZnJ+vXrad26NQAl'
          + 'JSUsWrSIO++8k+bNmzNmzBi++OILUlNTCQ0NRa/X4+vri0ajkQNPbBEEAY1Gw4kTJ9i/f7/Lr29RURGHDh1i9+7dKJVKt/kc6HQ6fv31VwCGDBlCSUlJhd8zmUycPXuWL7/8Us6+K9VfX7t2rVvOvbYI'
          + 'YkNK6lXTi/CfqEeOHMnbb7/tNMcHURRRq9UEBATQqlUr+bOKKC4u5t133+Xrr7+26/FtadOmDVdeeSX9+vWjd+/eqFQqubyxwWCw27fZbEYURdq0aSOPFJyFxWJh7969FBQUoFKp5Frp7kChUCCKolxY'
          + 'cOXKlURERFw2zNbPz4/s7GwGDRokD+eff/55Zs2a5ZZ21BSPwIGvv/6au+++G4Cff/6Z2NhYysrKHHoMKayzW7duKBQK2U22qKioSi6za9as4ccff+Tnn38mOzu7wu80a9aMq666in79+nHFFVeg0+ko'
          + 'LS21q2duNBrR6XRER0cTFhbm0DYaDAZOnDjBuXPnUKvVdSLmXqfTsXjxYt544w2USiXHjh2rsvFRehjfcMMNHD58GIBrr72W33//3d3NqjIegf9HfHy8HIiQlJREbm6uQzOWms1m9Ho9bdq0AS6MGp58'
          + '8knefPPNau9vw4YNrF69mmXLllXaw+v1evr06cOVV15Jr169iI2NpbS0lLKyMkpKSjAajQQFBeHv7y8b87y8vORzu1yvW1xcTH5+PoWFheTm5srzWHf22BcTFhZG//79OXPmDLfffjvPP/98tebUgiAQ'
          + 'FRXF1KlT+eGHHwBrksb6UhHHI3AbpJuyU6dOrFq1ymHGKVEUMZvN9O3bVz7Ge++9x2OPPQZYHW5q69G1a9cufvnlF1auXHlJl9XevXvTt29frrzySjp16oTRaKS0tJTS0lKMRiOiKMoPNkEQUCgUaLVa'
          + 'u/mzyWSSU0VJYpa+W5dQKpWUlZVxxRVXAFUfnldEeHg4//vf/3jhhRfkz+qDdDwCt2HdunVce+21AEydOpXJkydXOhyuKtLQvH379uXmvra93PHjx4mLi3NYW44fP86qVatYtWrVJYeUnTp1on///gwc'
          + 'OJCuXbvKQ3ppWC/dHra3SVV7eHfj6+vLu+++yxdffIGfnx8HDhwgPT29xvsLDAxk9+7dcsASWEd7klG0LuIR+EXcf//9fP755wAsWLCArl27UlRUVKObWRJ3s2bNaNasWbn/LykpsZt/X3PNNcyfP5/m'
          + 'zZs7vF2lpaWsWLGCX3/9leXLl1f64OrcuTP9+/dnwIABdOzYEbPZTFlZGUajEaPR6PIa3rUhMjJSdj99/PHHueeee2pdrsrHx4dz587ZlTv6/PPPmTBhgrubWyEegVdAy5YtOX78OAB79uxBqVRSWFhY'
          + 'rbmlxWLBaDTSsmVLOdljVY4H1hpdkyZN4qGHHnJor34xa9euZenSpfz444+VOsQkJCRwxRVX0Lt3b7p3745Go8FgMGAymTCbzZjNZiwWCxaLpU4NWbVaLXv27JGFl5iYiMFgcEhIrTRlufbaa2WD3aRJ'
          + 'k/j444/d3exyeAReCbZCFkWRM2fOyNFPtvNOW6Q1bpPJJC+FVTWpxKZNm5g0aZJsrZUICAjgyy+/lBNVOJNff/2VX375hZ9++qnSHl6v19O5c2fatm1LixYtaNq0KUFBQYSFhREUFCTnaRcEgbKyMrf5'
          + 'dYeEhHDrrbfyzz//0LNnTxYvXkxWVpbD9q9UKmnSpAmjR4+Ws7QOGTKE3377zS3trQyPwC+BrYBzcnIIDAzk5MmTZGVlUVxcbCdyi8WCRqMhKCiI6OjoGmeLEUWRuXPn8uGHH9r16sHBwZw5c8alFThX'
          + 'r17NypUrWblyJadPn67ydgqFAovFQu/evfnhhx9c7kmnVCoxm8307t0bsC4xRkdHOyU5ZVRUFM8995zsu96+fXsOHDjg0vZeCo/AL4HRaLTzAz9x4gSxsbGAVYjFxcWUlZWhVqvx9vZ2eGxzSUkJEydO'
          + 'tAuEyMrKQq/Xu+V6HDx4kI0bN7Jt2zYSExPt4qsr49FHH2XSpEly2ShX4O/vz+zZs/nf//4HWEU4bdo0Ro4cyblz5xye+SYsLIwFCxYwc+ZMoG4to3kEXgVse/IlS5Zw2223ufT4OTk5dqKuiz9Zfn4+'
          + 'aWlpshtoTEyMHMCzYMECOnXq5JL87YIgEBISUmFBgxYtWrB8+XJ5adCRBAcHs2LFCh5//HHAGpFW2xUYR1C3Fi7rKKIoyjfrmDFjuOeee1x6/KCgIDtRP/vss+6+JOXw9/enTZs2dOnShS5duhAcHEyX'
          + 'Ll0A2Lhxo8uSauh0Oj755BP5fVFRESNGjACsS4ft27fn9OnTBAQEOPS4WVlZDBs2jMWLFwPWh3JdWG3wCLyKnD9/nmHDhgHWHulylnFnMGfOHABee+01d1+OKnHNNdcAuDTe3tfXl7fffhuwLo3pdDp+'
          + '+eUX9uzZI3/nxhtvZOnSpQ531c3Ly6Nz5858//338mfuFrlH4NXg119/5d133wUgPT0dQRC48847XZbsUBr+AbLbZF2mc+fOABw7dswludd8fX3tlqqkByJYc7CJoig7Gz377LM8//zzNG3a1KEiLCgo'
          + 'oF27dixfvlz+zJ0i9wi8mkydOpVjx47JP9rixYvlG9kVSMtlCxYscPeluCxS7S8pqsyZCIKAt7e3HOY5bdq0Cr+XmZkpx3t/88033HLLLYSHhzs0lLWwsJDY2Fg7kfv4+Di1/ZXhEXgNaNGiBRaLhVdf'
          + 'fVX+LCkpySXHHjVqFGBdwqrr2Lpwnj9/3qm+6rZDc0AWekWsX79ejgPYsWMH3bp1Q6PROHQJsqioiNjYWH766SfAGpjjjhTdHoHXAtu8atHR0S455lVXXQXUTUv6xdj2Wunp6U4TuOSPIBnXXn755ctu'
          + '884778ijoKysLBISEjhw4IBDY+WLioqIj4/n22+/BazpmV09XPcIvIbYGmhEUXRZGaSmTZvKr+vKWmtVSElJcZrAAwMDmT59uvz+xRdfrNJ2d911l12tsrFjxzJz5kwiIyMdJsTCwkI6duzIL7/8In8m'
          + 'CILLqql4BF4Dnn76adl3252FBhy9lusMpAdhs2bNnFJaSalUkpeXx7JlywCqnQ21VatWiKJIu3btAFi0aBGDBw8mODjYYfNyaU6+ZcsW+bPQ0FB27Njh8OtxMR6BV5PCwkI5QcOrr74qe7a5g/pQPFEa'
          + '8u7fv9/hhjYpBfXUqVMBaxDI+PHja7SvgwcPygUxjhw5Qrdu3QgMDHSYyIuLi9FqtZw9exatVgtAr1695MILzsIj8Gpy6623AlZxucPhxNafOiIiwt2X47JIHnhFRUVyfjRHII0GBEGQgz2kxIo1Zdas'
          + 'WXKwiLSm7e/v75AHkyAIGAwGzp07R2lpKfHx8YB1VaZfv34OuSYV4RF4NZFuAMk66mp27tzp7ktQLaTab35+foSHh8vRZjVFFEWMRiNqtZrevXtzyy23AFbbhLT8VRuGDBnC7t27AetDqWvXrmi1Woc4'
          + '6giCQE5ODmazmSNHjnDfffcBsHXrVgRBcErmW4/Aq4FUDQVg6NChbjkH6QEjuYHWdaSaawcPHiQsLAxBEGokcknYFouFuLg4unfvzvHjx9m3bx/g2GXDrl27yoE0RUVFdOzYEZVKVWt3WymtleSjPn/+'
          + 'fDk3P1iz67z00ksOawd4BF4tFi5cCFDjeZ4j+PDDDwEYPXq0uy9HlfD39wesc1CAPn36oNVq5eQLlQ3ZpdxwZrMZg8GAQqEgLi6Ovn37ym7CUirkrl270rFjR4eed7t27ezCdRMSEuSQ4NogCIKdcXTg'
          + 'wIGIoiin0Z45c6Zc6cYReAReDaTqlK5IvlARhw8flm+Ohx56yN2Xo0pIAjYajYD1Bu/WrRvx8fGo1Wo599vFf1LkWUhICAkJCfTs2dPO/3/Tpk1yAgdnpTGOi4vjzJkz8vvu3btjNBqd4rBy9OhRHnnk'
          + 'EcA6GnGUyF1TnLmBMWDAALccd9y4cYB1KOfn5+fuy1AlpOH4xYaqsLAwwsLCMJvNFBUVUVZWhiiKcsklb2/vS857hwwZAsDw4cOdWsghKiqKrKws+Ri9evVi9erVREdHU1hYWO39iaJYqcfc+++/T7t2'
          + '7Zg0aRKrV6/mhRdeqHWhBU8PXkWOHTsmv5aGna5k3759svFHKlxfH+jWrRtQuc1AqVTi7+9PaGgoYWFhhIaG4u/vf0lxv/POO3JhipUrVzq9DXq93i5Z47Bhw9i5c2e1E29IKb0utd2DDz7Iww8/DFhL'
          + 'W9e2DLRH4FWkJk9rR5KQkABAz5495eIJdZ1HHnlEvlmlHtcRPPHEEwBMnz7dZa6fOp0OURTldfF77rmHL774olpeb2azmYiIiMt69H3wwQdyFl4p7VRN8WR0qSJJSUmysFx9yR544AHmz5/vlmPXBKk8'
          + 'km2BASmnXW0ZP368nMLKXdciNjaW5ORkwDov//bbbykoKKC0tNQuT59tTnmTyYROp5NHNJcjKytLTjLy559/ysUbqounB68izshVXhX27Nkji7supuW9mJSUFDQajSzujz76CFEUHSLunJwcWdxSAIc7'
          + 'OHnypGwP2bVrF61atSI3N5f4+HjZ6m9bANLX15fWrVtXWdxg9QCUbD133nlnzU9W9FBlABEQ//77b5cfs1OnTu5u/mXJz8+XzxcQ8/PzHbr/Fi1aiIAYGhrq7qaKoiiKq1atsmvv/fffL/9fSUlJrfd/'
          + '6tSpWl9LTw9eDdq3bw/U3iWyqtjO7VyVNaY2SMZHqVa5Iy398+bNk9elt2/f7u6mAlYLvmizhj1//ny8vb05e/asQ5bSYmJiZGPjZ599VqN9eAReDSS3SKm0kTOxtdTn5OS4u+mXxdYDS3JqcRQDBw5k'
          + '4sSJANx+++1uDfCpiKNHj/LRRx8B1gi/Jk2a8PTTTztk3/fffz9QixRd7h7m1CdSU1PlIVNhYaHTjuPn5ycfJykpyd3NrhLS+c6cOdPh+54wYYK8f7PZ7O6mVkpJSYkYHh4un2tERESt9/nbb7/J+6sJ'
          + 'HoFXE71eLwLi7bff7vB9Z2Vl2c3p9u/f7+7mVonff/+9VjdhVZD2f91117m7uZdl5syZdr/jqVOnarwvi8Ui7ycvL6/a23sEXk1++OEH+YKXlZU5bL/r16+3uynOnj3r7qZWmUmTJomAeNVVVzntGLY9'
          + 'WWZmprubfFlOnjxp93tu2LChxvuS9rFmzZpqb+uZg1eTUaNGyYkWHBWP/dRTT8nlaDUaDaIoEh4e7u6mVhkpzNGZcc1DhgyRfdHdFQtQHZo3b25naBw4cCBr166t0b6kKi2HDh2q9rYegdcAKU1TTk5O'
          + 'rQw++fn5hISEyBlAO3XqJLtg1iek3HAVlQtyJFJes82bN1da7riukZ+fL+fRGzx4MImJidXeh5RO6uzZs9Xe1iPwGhAeHi7HHycnJ+Pj40NBQUG19jFlyhQCAgLkiKhXXnmlXiyFVYT4n8eWM9MiA/To'
          + '0YOoqCjAmiCxvpCSkiLnpuvSpUu1c+lJTkM1yWnnEXgNGTp0KGvWrAGsy0L+/v6MHTv2kmV2z5w5w7333osgCLz//vuAdTns7NmzdimY6xtSpFV6errTjyVVDF27dq3Dl+OcSUZGhvy6uvnXpQd/jVJz'
          + 'u9sYUd85d+6c3bIWIKpUKvHKK68Ux40bJ44fP14cNmyYqNPp7L4DiJ999pm7T98h3HbbbSIg3n333S45nq+vrwiIY8aMcXfTq0VRUZH823fu3LnK20nb7Nmzp9rH9AjcQfz4449iVFRUORFf/BcTEyMu'
          + 'XLjQ3afrUGbPni0CYvv27V1yvJ9++snpy3LOYuPGjfK5v/jii5f9/uLFi2vVVk80mYMpLi5m6dKlHDhwgNTUVMrKytDr9XTt2pXx48fLKXMbEtu2baNPnz6A6yK8JDfe9957jylTprj7ElSLp556Sjas'
          + 'fvXVV9x9992XbeeECRNq5kHp7ieah4YBLnbOefzxx0VA9Pf3d3fTa0TPnj3la/bwww+X+/9Tp07JU5HayNTTg3twCG3atCEpKYknn3xSLgzhTAoLC+U15pMnT7otnLc29OjRg127dsnvb7rpJkJDQ1m+'
          + 'fLndktju3bvp2rVrzQ7i7ieZh4bB22+/LQKin5+fy44ZExMjAuJjjz3m7ubXmDlz5lRqr2nevLl47ty5Wu3f04N7cAhlZWVyiOSxY8ec7vQC8Oabb/L000/j7+9PXl6euy9Brfjf//7HunXrMBgMtG/f'
          + 'nnvuuccui2xN8Qjcg8No3749hw4d4vbbb+ebb75x+vHS09NlEXhu44rxOLp4cBhSTLir0ik1adJEfv3zzz+7u/l1Eo/APTgM22or77zzjkuOKQW4bNiwwd3Nr5N4BO7BoTz11FPAhdTGzkZKTFhX0jjV'
          + 'NTwC9+BQ3njjDfn14sWLnX48KV+8MypzNgQ8AvfgcCZPngzUMt1vFZHqbNfHMFtX4BG4B4cjJSAE58/F61NiDHfgEbgHp/DMM88Azp+Le5bHLo1H4B6cwmuvvSa/HjFihNOOY1sU0EN5PAL34DSkAhHL'
          + 'ly9ny5YtTjlGSkqKu5tZp/EI3IPTGDZsGH379gWocfG8yyHlOIuLi3N3c+skHoF7cCq2PbczSv2uW7cOsJZV9lAej8A9OJ38/Hz5ta17qSNYsWIFAGPGjHF3M+skHoF7cDp+fn7s3r0bsKb+DQ0Ndch+'
          + 'v/rqK/m1Mw159RmPwD24hK5du/L3338DkJmZiSAIpKam1mqf9957LwCTJk1yd/PqLJ5wUQ8u5cSJE3ax4o8++ihz586t9n6aN2/OqVOnAM9a+KXw9OAeXEpcXByiKMqFAN5//30EQahymqecnByCg4Nl'
          + 'cUtDfw8V4xG4B7eQkZFh13M//fTTCILAFVdcwWeffcbBgwdl//LTp0/z9ddf06NHD/R6PdnZ2QAsW7as5rnKGgmeIboHtzN9+nRef/31Kn8/OjqaXbt2yaMAD5Xj6cE9uJ3XXnsNURTZuHEjd999N0FB'
          + 'QeW+4+3tzZgxY9i3bx+nT5/2iLuKeHpwD3Uas9mMUql092nUWzwC9+ChAeMZonvw0IDxCNyDhwaMR+AePDRg/g8d8z4z7o9lowAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMS0xNVQxMDowOToxOCsw'
          + 'MTowMEtV4RkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTEtMTVUMTA6MDk6MTgrMDE6MDA6CFmlAAAAAElFTkSuQmCC" />'
          + '</svg>'
          + '</p>'
          + '<p class="good">ヨシ！</p>';
        modalElem.querySelector('.footer').innerHTML = '';

        setTimeout(function(){
          const CnfModal = new ConfirmModal();
          CnfModal.closeModal();
        }, 3000);
      }, false);

      modalElem.querySelector('.cancel').addEventListener('click', function() {
        modalElem.querySelector('.header').innerHTML = '';
        modalElem.querySelector('.body').innerHTML   = '<p class="goaway">子供はさっさと寝ろ！</p>';
        modalElem.querySelector('.footer').innerHTML = '';

        setTimeout(function(){
          window.location.href = CHILD_URL;
        }, 3000);
      }, false);
    }
  }

  /**
   * 確認モーダルクラス
   */
  class ConfirmModal
  {
    #bodyElem;  // body要素全体
    #modalElem; // モーダル要素

    /**
     * 要素取得
     */
    getElements()
    {
      this.#bodyElem  = document.body;
      this.#modalElem = document.querySelector('#adult-modal');
    };

    /**
     * URLチェック
     */
    checkUrl()
    {
      const url = window.location;

      return url.host === CNF_HOST && url.pathname === CNF_PATHNAME;
    };

    /**
     * モーダル表示
     */
    showModal()
    {
      // 指定URL以外無視する
      if (!this.checkUrl()) {
        // return;
      }

      this.getElements();

      this.#bodyElem.classList.add('show-modal');
      this.changeShowModal(true);
    };

    /**
     * 表示切り替え
     */
    changeShowModal(isShow)
    {
      this.getElements();

      this.#modalElem.setAttribute('aria-hidden', isShow ? 'false' : 'true');
      this.#modalElem.querySelector('.content').focus();
    };

    /**
     * モーダルウィンドウを閉じる
     */
    closeModal()
    {
      this.getElements();

      if (!this.#bodyElem.classList.contains('show-modal') || !this.#modalElem) {
        return;
      }

      this.#modalElem.classList.remove('show-modal');
      this.changeShowModal(false);
      this.#modalElem = null;
    };
  }

  // 初期設定
  Setup.init();

  // モーダル表示
  const CnfModal = new ConfirmModal();
  CnfModal.showModal();
}());
