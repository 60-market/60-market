const url = 'https://mandarin.api.weniv.co.kr';
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const errorMessage = document.querySelector('.registerFormAlert');
const logInForm = document.querySelector('.logInForm');
const logInFormBtn = document.querySelector('.logInBtn');

// 폼 입력
class CheckForm {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  // 버튼 활성화
  isActiveBtn = () => {
    if (email.value !== '' && password.value !== '') {
      logInFormBtn.style.opacity = '1';
      logInFormBtn.disabled = false;
    }
    if (email.value === '' || password.value === '') {
      logInFormBtn.style.opacity = '0.3';
      logInFormBtn.disabled = true;
    }
  };

  // 비밀번호 길이 체크
  checkInput = () => {
    if (password.value.length >= 6) {
      this.isActiveBtn();
    }
  };
}

// 로그인 유효성 검사
class Validation {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  // 홈으로 이동
  locationHome = (status) => {
    if (status !== 422) {
      location.href = './home.html';
    }
  };

  // 로컬 스토리지에 토큰 저장
  saveToken = (userData, status) => {
    localStorage.setItem('Token', userData.token);
    localStorage.setItem('accountname', userData.accountname);
    this.locationHome(status);
  };

  // 로그인 체크
  checklogIn = (userData, status) => {
    if (status !== 422) {
      this.saveToken(userData, status);
    }
    if (status === 422) {
      errorMessage.classList.remove('ir');
    }
    logInForm.oninput = () => {
      errorMessage.classList.add('ir');
    };
  };

  // 로그인 데이터 요청
  getLogInData = async () => {
    try {
      const res = await axios.post(`${url}/user/login`, {
        user: {
          email: email.value,
          password: password.value,
        },
      });
      const userData = res.data.user;
      const status = res.data.status;
      this.checklogIn(userData, status);
      return status;
    } catch (err) {
      return err;
    }
  };
}

// 폼 입력
const checkForm = new CheckForm(email, password);
// 로그인 유효성 검사
const validation = new Validation(email, password);

// 폼 입력
logInForm.addEventListener('input', checkForm.checkInput);
// 로그인 유효성 검사
logInFormBtn.addEventListener('click', validation.getLogInData);
