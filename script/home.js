//로그인 구현시 삭제
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjNmOGUxNTM2MWFhZWE1NjlhYWUzOCIsImV4cCI6MTY2MTE0NTgyNywiaWF0IjoxNjU1OTYxODI3fQ.F7JLkiPLzbW3GcLUK_b_-h4_7zkZdLQgTZB-OddOhLY";

// localStorage.getItem("token");
// const postAccountName = "ayden123";
const postAccountName = "ujin16";
// localStorage.getItem("accountname");

let state = "list";
const curUrl = location.href;

const albumBtn = document.querySelector(".postingType.album");
const listBtn = document.querySelector(".postingType.list");
const albumContent = document.querySelector(".postContent");
const listContent = document.querySelector(".post");

// 나의 프로필 페이지 일 경우
// if (curUrl.split("accountname=")[1] === postAccountName) {
if (curUrl.split("/pages/")[1] === "profile.html") {
  console.log("마이프로필 페이지입니다.");
  myProfileFeed(state);
  listBtn.addEventListener("click", changeListType);
  albumBtn.addEventListener("click", changeAlbumType);
  // 타 유저 프로필 페이지 일 경우
} else if (curUrl.indexOf("/profile.html/") !== -1) {
  console.log("타 유저 프로필 페이지입니다.");
  yourProfileFeed(state);
  listBtn.addEventListener("click", changeListType);
  albumBtn.addEventListener("click", changeAlbumType);
  // 홈피드 일 경우
} else {
  console.log("홈피드 페이지입니다");
  homeFeed();
}
//   // 피드 댓글 페이지 일 경우
// } else if (curUrl.indexOf('/post/') !== -1) {
//   feedDetail()
// }

// 프로필페이지 게시물 리스트형으로 변경, 버튼 활성화
function changeListType() {
  state = "list";
  albumContent.classList.add("hidden");
  listContent.classList.remove("hidden");
  albumBtn.classList.add("unselected");
  listBtn.classList.remove("unselected");
  if (curUrl.split("/pages/")[1] === "profile.html") {
    myProfileFeed(state);
  } else {
    yourProfileFeed(state);
  }
}

// 프로필페이지 게시물 앨범형으로 변경, 버튼 활성화
function changeAlbumType() {
  state = "album";
  albumContent.classList.remove("hidden");
  listContent.classList.add("hidden");
  albumBtn.classList.remove("unselected");
  listBtn.classList.add("unselected");
  if (curUrl.split("/pages/")[1] === "profile.html") {
    myProfileFeed(state);
  } else {
    yourProfileFeed(state);
  }
}

// 나의 프로필 페이지 일 때 데이터 뿌려주기
async function myProfileFeed(state) {
  const url = `https://mandarin.api.weniv.co.kr/post/${postAccountName}/userpost/?limit=9&skip=3`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const data = await res.json();
  const posts = data.post;
  console.log(posts);
  getFeed(posts, state);
}

// 타 유저 프로필 페이지 일 경우
async function yourProfileFeed(state) {
  const userAccountName = curUrl.split("/profile/")[1];
  const url = `https://mandarin.api.weniv.co.kr/post/${userAccountName}/userpost/?limit=9&skip=3`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const data = await res.json();
  const posts = data.post;
  console.log(posts);
  getFeed(posts, state);
}

// 홈피드일 때 데이터 뿌려주기
async function homeFeed() {
  // 처음 게시물 10개까지만 보이고 5개씩 로딩
  const url = `https://mandarin.api.weniv.co.kr/post/feed/?limit=20&skip=5`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  const data = await res.json();
  const posts = data.posts;
  // console.log(posts);
  // 게시물 유/무 판별
  if (posts.length <= 0) {
    noFeed();
  } else {
    getFeed(posts, state);
  }
}

// 팔로우한 유저가 없을 경우 보여줄 피드
function noFeed() {
  listContent.innerHTML = `
    <h3 class="ir">피드 게시글</h3>
    <section class="noneFeed">
      <p>유저를 검색해 팔로우 해보세요!</p>
      <a href="/pages/search.html" class="userSearchBtn">검색하기</a>
    </section>`;
}

// 팔로우한 유저가 있을 때 보여줄 피드
function getFeed(posts, state) {
  console.log(posts);
  // 팔로우한 유저의 게시물이 없을 경우
  if (!posts && curUrl.split("/pages/")[1] === "home.html") {
    listContent.innerHTML = `
      <h3 class="ir">피드 게시글</h3>
      <section class="noneFeed">
        <p>등록된 게시물이 없습니다 :(</p>
      </section>
      `;
  }

  posts.forEach((element) => {
    const date = timeForToday(element.updatedAt);
    // console.log(element.updatedAt);
    // console.log(date);
    let postImage = "";
    let firstImage = "";
    // 이미지가 있는 게시글이라면
    if (element.image) {
      let images = element.image.split(",");
      // album형에서 사용될 첫번째 이미지 저장
      firstImage = `
      <li>
        <a href="profile.html\?accountname=${element.id}"> 
          <img src="${images[0]}" alt="게시물 이미지" />
        </a>
      </li>
      `;
      // list형에서 사용될 전체 이미지 저장
      for (image of images) {
        postImage += `
        <li>
          <img src="${image}" alt="게시물 이미지" />
        </li>
        `;
      }
    }
    // console.log(firstImage);
    if (state === "list") {
      const postItem = document.createElement("div");
      postItem.classList.add("postItem");
      postItem.id = element.id;
      postItem.innerHTML = `
        <section>
          <div class="userList">
            <div class="userItem">
            <a href="profile.html\?accountname=${element.author.accountname}" class="userBox">
                <img
                  src="${element.author.image}"
                  alt="${element.author.username}님의 프로필 이미지"
                  class="userProfileImage"
                />
                <div class="userInfo">
                  <strong class="userNickname">${element.author.username}</strong>
                  <div class="userText">
                    <p class="userMsgContent userStatusMsg">
                      @${element.author.accountname}
                    </p>
                  </div>
                </div>
                <button class="moreBtn buttonClick"><span class="ir">게시글 더보기 버튼</span></button>
              </a>
            </div>
          </div>
        </section>
        <section class="postContent">
          <h4 class="ir">게시글 내용</h4>
          <p>${element.content}</p>
          <ul>${postImage}</ul>
          <div class="postBtnContent">
            <button class="likeBtn ${element.hearted ? "on" : ""}">
              <span class="ir">좋아요 버튼</span>
                <span class="likeCount">${element.heartCount}</span>
            </button>
            <a href="/post/${element.id}" class="commentBtn">
              <span class="commentCount">${element.commentCount}</span>
            </a>
          </div>
          <strong class="postDate">${date}</strong>
        </section>
      `;
      // console.log(postItem);
      listContent.appendChild(postItem);

      // 좋아요 버튼 기능 구현
    } else if (state === "album") {
      const postItem = document.createElement("ul");
      postItem.classList.add("postingList");
      postItem.innerHTML = firstImage;
      albumContent.appendChild(postItem);
    }
  });
}

// 게시물 삭제 모달

// 게시물 등록 시간 계산 함수
function timeForToday(value) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전` + console.log(today);
}
