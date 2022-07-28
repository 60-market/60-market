const backHistory = document.querySelector(".headerBarBack.buttonClick");
const postUploadTxt = document.querySelector(".postUploadComentTxt");
const postUploadInp = document.querySelector(".postUploadInput");
const postImgContainer = document.querySelector(".postUploadImageScreen");
const postUploadBtn = document.querySelector(".headerBarBtn.buttonClick");
const postImgItem = document.querySelector(".postImgItem");
const postUserProfile = document.querySelector(".userProfileImage");
const url = "https://mandarin.api.weniv.co.kr";
const curUrl = location.href;

const imgFiles = [];


// 뒤로 가기
backHistory.addEventListener("click", () => {
  window.location = document.referrer;
});

// 로그인 유저 정보
async function getLoginUserInfo() {
  const token = localStorage.getItem("Token");
  const accountname = localStorage.getItem("accountname");

  try {
    const res = await fetch(`${url}/profile/${accountname}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    const userJson = await res.json();
    postUserProfile.setAttribute("src", userJson.profile.image);
  } catch (err) {
    console.log(err);
  }
}

getLoginUserInfo();

// 사진 미리보기, 사진 삭제

function readInputFile(e) {
  const files = e.target.files;
  const fileArr = [...files];
  if (e.target.files[0].size > 10000000) {
    alert("이미지 사이즈는 10MB 이내로 등록 가능합니다.");
    return;
  } 
  fileArr.forEach((file) => imgFiles.push(file));
  fileArr.forEach(function (i) {
    
    if (files.length <= 3) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imgItem = document.createElement("div");
        imgItem.style.backgroundImage = `url(${reader.result})`;
        imgItem.className = "postImgItem";

        postImgContainer.appendChild(imgItem);
        e.target.value = "";

        const closeBtn = document.createElement("button");
        closeBtn.className = "postImgCloseBtn";
        imgItem.appendChild(closeBtn);
        closeBtn.addEventListener("click", function () {
          // MEMO:: imgFiles에서 삭제, 미리보기에 삭제
          imgFiles.splice([...postImgContainer.children].indexOf(imgItem), 1);
          postImgContainer.removeChild(imgItem);
          // console.log(imgFiles);
        });
      };
      reader.readAsDataURL(i);
    }
  });
}
// postUploadInp.addEventListener("change", uploadImg);

// 이미지 업로드
let arrImg = [];
async function uploadImg(event) {
  const formData = new FormData();
  imgFiles.forEach((file) => {
    formData.append("image", file);
  });
  try {
    const response = await fetch(url + "/image/uploadfiles", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    data.forEach((data) => {
      arrImg.push(`${url}/${data.filename}`);
    });
    return arrImg;
  } catch (err) {
    alert("이미지 파일은 최대 3장까지만 가능합니다.");
  }
  imgFiles = [];
}

// postUploadComentTxt나 postUploadImageScreen에 이미지가 업로드되면 업로드버튼 활성화

postUploadBtn.disabled = true;
console.log(postUploadBtn);
function postInput() {
  if (postUploadTxt.value !== "" || postImgContainer.value !== "") {
    postUploadBtn.style.opacity = "1";
    postUploadBtn.disabled = false;
  } else {
    postUploadBtn.style.opacity = "0.3";
    postUploadBtn.disabled = true;
  }
}

// 게시글 작성 후 데이터 서버에 보내기

async function createPost() {
  const token = localStorage.getItem("Token");
  const contentText = postUploadTxt.value;
  const images = await uploadImg(imgFiles);

  const res = await fetch(`${url}/post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      post: {
        content: contentText,
        image: images.join(","),
      },
    }),
  });
  const json = await res.json();
  // console.log(json);
  location.href = "../pages/profile.html";
}

if (curUrl.indexOf("postid=") == -1) {
  postUploadBtn.addEventListener("click", createPost);
}

///////////////게시물 수정///////////////
if (curUrl.indexOf("postid=") !== -1) {
  const postingId = curUrl.split("postid=")[1];
  const token = localStorage.getItem("Token");
  const defaultUrl = "https://mandarin.api.weniv.co.kr";
  let hiddenImg = "";
  let imageArr = [];
  postUploadBtn.disabled = false;
  postUploadBtn.style.opacity = "1";

  //이미지 파일 url 생성
  async function uploadImg(file) {
    const formData = new FormData();
    formData.append("image", file);
    imgFiles.forEach((file) => {
      formData.append("image", file);
    });
    try {
      const res = await fetch(`${defaultUrl}/image/uploadfiles`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      imageName = data[0].filename;
      return imageName;
    } catch (err) {
      console.log(err);
    }
  }

  // 이미지 미리보기, 삭제 버튼
  function setImg() {
    if (hiddenImg.value !== "") {
      imageArr = hiddenImg.split(",");

      if (imageArr.length >= 1 && imageArr[0] !== "") {
        imageArr.map((src) => {
          const imgItem = document.createElement("div");
          imgItem.className = "postImgItem";
          imgItem.setAttribute("style", `background-image: url(${src})`);
          postImgContainer.appendChild(imgItem);

          const closeBtn = document.createElement("button");
          closeBtn.className = "postImgCloseBtn";
          imgItem.appendChild(closeBtn);

          closeBtn.addEventListener("click", function () {
            imageArr.splice(
              [...postImgContainer.children].indexOf(imgItem) - 1,
              1
            );
            postImgContainer.removeChild(imgItem);
            hiddenImg.value = imageArr;
          });
        });
      }
    }
  }

  // 게시물 데이터 받아오기
  async function getPost() {
    try {
      const res = await fetch(`${defaultUrl}/post/${postingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      const json = await res.json();
      const post = json.post;

      const postContent = post.content;
      const postImgArr = post.image;

      postUploadTxt.textContent = postContent;
      hiddenImg = postImgArr;

      setImg();
    } catch (err) {
      console.log(err);
    }
  }

  // 이미지 수정
  function readInputFile(e) {
    const files = e.target.files;
    const fileArr = [...files];
    imageArr = hiddenImg.split(",");

    fileArr.forEach((file) => imgFiles.push(file));
    fileArr.forEach(function (i) {
      if (files.length <= 3) {
        var reader = new FileReader();
        reader.onload = function (e) {
          const imgItem = document.createElement("div");
          imgItem.style.backgroundImage = `url(${reader.result})`;
          imgItem.className = "postImgItem";

          postImgContainer.appendChild(imgItem);
          e.target.value = "";

          const closeBtn = document.createElement("button");
          closeBtn.className = "postImgCloseBtn";
          imgItem.appendChild(closeBtn);

          closeBtn.addEventListener("click", function () {
            imgFiles.splice(
              [...postImgContainer.children].indexOf(imgItem) - 1,
              1
            );
            postImgContainer.removeChild(imgItem);
            hiddenImg.value = imageArr;
          });
        };
        reader.readAsDataURL(i);
      } else {
        alert("이미지는 3장까지 가능합니다.");
      }
    });
  }

  getPost();
  postUploadInp.addEventListener("change", uploadImg);

  // 게시물 수정 PUT 요청
  async function editPost() {
    const oldImg = hiddenImg;
    const updateImgArr = hiddenImg === "" ? [] : oldImg.split(",");

    for (const file of imgFiles) {
      const resultImg = await uploadImg(file);
      updateImgArr.push(`${defaultUrl}/${resultImg}`);
    }

    try {
      const res = await fetch(`${defaultUrl}/post/${postingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          post: {
            content: postUploadTxt.value,
            image: updateImgArr.join(","),
          },
        }),
      });
      const json = await res.json();
      location.href = "./profile.html";

      if (json.type == "entity.too.large") {
        console.error(json.message);
        alert("이미지 용량이 너무 큽니다.");
      }
    } catch (err) {
      // location.href = "./error.html";
      console.error(err);
    }
  }
  postUploadBtn.addEventListener("click", editPost);
}
