const headerTitle = document.querySelector(".header__title");

const startBtn = document.querySelector(".start__section__bottom__start-btn");

const startSection = document.querySelector(".start__section");
const countdownSection = document.querySelector(".countdown__section");
const playScreenSection = document.querySelector(".play_screen__section");

const countdownSectionNum = document.querySelector(".countdown__section__num");

const playScreenImage = document.querySelector(".play_screen__section div");
const resultSection = document.querySelector(".result__section");
const resultSectionPoint = document.querySelector(".result__section__point");

const twitterIcon = document.querySelector(".result__section__share_link");

const flickityElement = document.querySelector(".start__section");
// 対象画像の要素
let targetImage;
// 画像チェック要素の確認
let guyName;
// カウントダウン
let countdownNum = 5;
// 開始時間
let beforeTime;
// 終了時間
let afterTime;
// 得点
let point;
// プレイ画面のサイズ倍率
const wScale = 4;
const hScale = 4;
// 対象画像のサイズ
imageWidth = 100;
imageHeight = 100;
// 画面サイズの取得
let screenWidth;
let screenHeight;

window.onload = function () {
    screenWidth = screen.width;
    screenHeight = screen.height;
    // ページ読み込み時に実行したい処理
    makeSelectGuyGroup();
    flickity;
    // 対象ノードとオブザーバの設定を渡す
    observer.observe(resultSection, config);
};

let flickity = new Flickity(flickityElement, {
    // options
    cellAlign: "left",
    contain: false,
    pageDots: false,
    prevNextButtons: false,
    setGallerySize: false,
    rightToLeft: false,
});

let makeSelectGuyGroup = () => {
    const selectGuyGroup = document.querySelector("#select-guy-group");

    Object.keys(guys).forEach((g) => {
        selectGuyGroup.insertAdjacentHTML(
            "beforeend",
            `
            <li>
                <input id="${guys[g]["id"]}" type="radio" name="rate" value="${g}">
                <label for="${guys[g]["id"]}">
                    <div>
                        <img src="${guys[g]["targetPath"]}">
                    </div>
                </label>
            </li>
            `
        );
    });
};

// オブザーバインスタンスを作成
const observer = new MutationObserver((mutations) => {
    // 得点をセットする
    resultSectionPoint.insertAdjacentHTML(
        "afterbegin",
        `<p class="point">${point} / 100 点</p>`
    );
    // twitterシェアボタン挿入
    const baseUrl = "https://twitter.com/intent/tweet?";
    const text = [
        "text",
        `@anohito_ca\n${point}/100点でした！\n`
    ];
    const hashtags = ["hashtags", ["あの人かれんだー\n", "あの人を探せ\n"].join(",")];
    const url = ["url", location.href + "\n\n"];
    const via = ["via", "anohito_ca\n"];
    const query = new URLSearchParams([text, hashtags, url]).toString();
    const shareUrl = `${baseUrl}${query}`;
    twitterIcon.href = shareUrl;
    console.log(query);

    observer.disconnect();
});

// オブザーバの設定
const config = {
    attributes: true,
    characterData: true,
    subtree: true,
};

// スタートボタン
startBtn.addEventListener("click", () => {
    // 画像選択の結果を受け取る
    const selectGuyGroupElements = document.querySelectorAll("#select-guy-group input");

    let selectElement = selectGuyGroupElements.forEach((el) => {
        if (el.checked) {
            guyName = el.value;
            console.log(guyName);
        }
    });

    if (guyName == undefined) {
        // 「あの人」選択時に選択されていなかった場合戻る
        flickity.select(1);
    } else {
        startSection.classList.add("none");
        countdownSection.classList.remove("none");
        // playScreenSection.classList.remove("none");

        setImg();

        // カウントダウンアクション(1000m/sごとに)
        let countdownFunc = setInterval(() => {
            if (countdownNum > 0) {
                // 321表示
                countdownSectionNum.innerHTML = countdownNum;
            } else if (countdownNum == 0) {
                // START表示
                countdownSectionNum.innerHTML = "START!";
            } else {
                // countdown,playScreen切り替え
                countdownSection.classList.add("none");
                playScreenSection.classList.remove("none");
                clearInterval(countdownFunc); // 終了

                headerTitle.innerHTML = `${guyName}を探せ！`;
                // 開始時間をセット
                beforeTime = Date.now();
            }
            countdownNum--;
        }, 500);
    }
});

// 選択した画像をセットする
let setImg = () => {
    // プレイ画面のサイズセット
    playScreenImage.style.width = `${wScale * 100}%`;
    playScreenImage.style.height = `${hScale * 100}%`;

    // 対象画像の位置をランダムで
    let targetImgTop =
        Math.random() * (screenHeight * hScale - imageHeight - screenHeight) + screenHeight;
    let targetImgLeft =
        Math.random() * (screenWidth * wScale - imageWidth - screenWidth) + screenWidth;
    console.log(`targetImgTop ${targetImgTop}px`);
    console.log(`targetImgLeft ${targetImgLeft}px`);

    // 背景セット
    playScreenImage.style.background = `url(${guys[guyName]["backgroundPath"]})`;

    // 対象画像をセット
    playScreenImage.insertAdjacentHTML(
        "beforeend",
        `<img src="${guys[guyName]["targetPath"]}" alt="" class="target-image">`
    );

    // 対象画像のcssをセット
    targetImage = document.querySelector(".target-image");
    targetImage.style.width = `auto`;
    targetImage.style.height = `${imageHeight}px`;
    targetImage.style.top = `${targetImgTop}px`;
    targetImage.style.left = `${targetImgLeft}px`;

    // 対象画像タッチ時
    targetImage.addEventListener("click", () => {
        afterTime = Date.now();
        let resultSec = (afterTime - beforeTime) / 1000;
        console.log(resultSec);
        if (resultSec <= 3) {
            point = 100;
        } else if (resultSec < 5) {
            point = 90;
        } else if (resultSec > 50) {
            point = 0;
        } else {
            point = 90 - 2 * (resultSec - 5);
        }
        point = Math.floor(point);
        console.log(point);

        playScreenSection.classList.add("none");
        resultSection.classList.remove("none");

        // 何らかのタイミングで監視を解除したい時
        // observer.disconnect();
    });
};

