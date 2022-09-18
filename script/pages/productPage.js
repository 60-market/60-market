class ProductPage {
  render() {
    // header
    const headerEl = document.createElement("header");
    const headerBarArticleEl = document.createElement("article");
    const backImgEl = document.createElement("img");
    const titlePEl = document.createElement("p");

    headerBarArticleEl.classList.add("headerBar");
    headerBarArticleEl.classList.add("followers");
    backImgEl.classList.add("headerBarBack");
    backImgEl.classList.add("buttonClick");
    backImgEl.setAttribute("src", "../asset/images/icons/icon__arrowLeft.svg");
    backImgEl.setAttribute("alt", "뒤로 가기");
    titlePEl.classList.add("followTitle");

    headerBarArticleEl.appendChild(backImgEl);
    headerBarArticleEl.appendChild(titlePEl);
    headerEl.appendChild(headerBarArticleEl);

    return { headerEl };
  }
}

export default ProductPage;

/* <header>
      <article class="headerBar addProductHeaderBar">
        <img
          class="headerBarBack buttonClick"
          src="../asset/images/icons/icon__arrowLeft.svg"
          alt="뒤로가기"
        />
        <button type="button"
        id="addProductSaveBtn"
        class="headerBarSettingBtn headerBarBtn buttonClick"
        >
          저장
        </button>
      </article>
    </header>

    <main class="addProduct">
        <!-- 이미지 등록 -->
        <form class="addProductForm">
          <h3 class="addProductFormLabel">이미지 등록</h3>
          <label for="addProductImg" class="addProductFormUplodeImg">
            <img class="addProductUplodeImgScreen">
            <img class="addProductUplodeImg" src="../asset/images/icons/icon__imagesUplode.svg" alt="이미지 등록" />
          </label>
          <input 
          id="addProductImg" 
          type="file"
          accept="image/*" 
          onchange="onChangeProductImg(event)"
          />

        <!-- 상품명 등록 -->
          <label class="addProductFormLabel" for="addProductName">상품명</label>
          <input 
          id="addProductName" 
          type="text" 
          required 
          placeholder="2~15자 이내여야 합니다." 
          minlength="2"
          maxlength="15"
          onkeyup="productInput()"
          />
        

        <!-- 가격 등록 -->
          <label class="addProductFormLabel" for="addProductPrice">가격</label>
          <input
            id="addProductPrice"
            type="text"
            required
            placeholder="숫자만 입력 가능합니다."
            maxlength="12"
            onkeyup="inputNumberFormat(this)"
            />
            
        <!-- 시간 선택 -->
        <div class="timeSelct">
          <h3 class="addProductFormLabel">시간 선택</h3>
          <article class="addProductTimeSelect">
            <h2 class="ir">시간을 선택해주세요</h2>
            <button type="button" class="addProductSelectBtn">
              시간을 선택해주세요.
            </button>
            <ul class="addProductTimeList">
              <li>
                <button type="button" class="textEllipsis">10분 이하</button>
              </li>
              <li><button type="button" class="textEllipsis">30분</button></li>
              <li>
                <button type="button" class="textEllipsis">1시간</button>
              </li>
              <li>
                <button type="button" class="textEllipsis">2시간</button>
              </li>
              <li>
                <button type="button" class="textEllipsis">3시간</button>
              </li>
              <li>
                <button type="button" class="textEllipsis">나눔</button>
              </li>
            </ul>
          </article>
        </div>

        <!-- 내용 입력 -->
        
          <label for="addProductContent" class="addProductFormLabel">내용</label>
          <textarea
            cols="10"
            rows="10"
            id="addProductContent"
            required
            placeholder="내용을 입력해 주세요."
            onkeyup="productInput()"
          ></textarea>
        </form>
      </main>
    </div> */
