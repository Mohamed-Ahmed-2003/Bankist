"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Mohamed Ahmed",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-11-18T21:31:17.178Z",
    "2021-12-23T07:42:02.383Z",
    "2022-08-28T09:15:04.904Z",
    "2022-08-01T10:17:24.185Z",
    "2022-08-26T14:11:59.604Z",
    "2022-08-26T17:01:17.194Z",
    "2022-08-27T23:36:17.929Z",
    "2022-08-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Abu Treka",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-08-25T16:33:06.386Z",
    "2022-08-01T14:43:26.374Z",
    "2022-08-28T18:49:59.371Z",
    "2022-08-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Mohamed Magdy Afsha",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Ali Maloul",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

///////////// extended
let currentAccount, CurrentAccountIndex, timer;

const appOpacity = (val) => {
  containerApp.style.opacity = val;
};

//////////// days between 2 dates
const calcDaysBetweenDates = (d1, d2) =>
  Math.round(Math.abs((d1 - d2) / (1000 * 60 * 60 * 24)));

///////////////////////////  a new DateFormated auto
const newDateFormated = (date, tActive = false) => {
  const loc = navigator.language;
  const options = tActive
    ? {
        hour: "numeric",
        minute: "numeric",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }
    : false;
  return new Intl.DateTimeFormat(loc, options).format(date);
};

////////////////////////// date
const formatDate = function (currentDate) {
  /*const day = `${currentDate.getDate()}`.padStart(2, 0);
  const month = `${currentDate.getMonth()}`.padStart(2, 0);
  const year = currentDate.getFullYear();
  const hours = `${currentDate.getHours()}`.padStart(2, 0);
  const min = `${currentDate.getMinutes()}`.padStart(2, 0);
  const time = nd ? `,${hours}:${min}` : "";*/
  const normalFormat = newDateFormated(currentDate);
  const passedDays = calcDaysBetweenDates(new Date(), currentDate);
  if (passedDays < 8) {
    let strDate;
    switch (passedDays) {
      case 0:
        strDate = "Today";
        break;
      case 1:
        strDate = "Yesterday";
        break;
      default:
        strDate = `${passedDays} Days Ago`;
        break;
    }
    return strDate;
  }
  return normalFormat;
};
////// push date
const pushDate = (acc) => acc.movementsDates.push(new Date().toISOString());
////////////////////////// format the numbers
const formatNumbers = (val) => {
  const options = {
    style: "currency",
    currency: currentAccount.currency,
  };
  return new Intl.NumberFormat(currentAccount.locale, options).format(val);
};
///////////////////// timer
const setTimer = function () {
  if (timer) clearInterval(timer);
  let min = 5,
    sec = 0;
  labelTimer.textContent = "05:00";
  timer = setInterval(() => {
    if (sec === 0 && min > 0) {
      min -= 1;
      sec = 60;
    }
    sec -= 1;
    labelTimer.textContent =
      `${min}`.padStart(2, 0) + " : " + `${sec}`.padStart(2, 0);
    if (min === 0 && sec === 0) {
      appOpacity(0);
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started ";
    }
  }, 1000);
};
////////////////////////////// displayMoements

const displayMovs = function (Movements) {
  containerMovements.innerHTML = "";
  Movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const htmlCont = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${formatDate(
      new Date(currentAccount.movementsDates[i])
    )}</div>
    <div class="movements__value">${formatNumbers(mov)}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", htmlCont);
  });
};

/////////////////////////// user name
const createUserNames = (accounts) => {
  accounts.forEach((ac) => {
    ac.username = ac.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
/////////////////////////  balance calc
const calcBalance = (Movements) => {
  labelBalance.textContent = formatNumbers(
    Movements.reduce((acc, curr) => acc + curr, 0)
  );
};

const calcSummary = (movements, iR) => {
  const inCome = movements
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value, 0);

  const outCome = movements
    .filter((value) => value < 0)
    .reduce((acc, value) => acc + value, 0);
  const interest = movements
    .filter((value) => value > 0)
    .map((val) => (val * iR) / 100)
    .filter((val) => val >= 1)
    .reduce((acc, val) => acc + val, 0);

  labelSumIn.textContent = formatNumbers(inCome);
  labelSumOut.textContent = formatNumbers(Math.abs(outCome));
  labelSumInterest.textContent = formatNumbers(interest);
};

const loc = navigator.language;
const set_And_Update_UI = function () {
  //labelDate.textContent = formatDate(new Date(), true, false);

  labelDate.textContent = newDateFormated(new Date(), true);

  displayMovs(currentAccount.movements);
  calcBalance(currentAccount.movements);
  calcSummary(currentAccount.movements, currentAccount.interestRate);
};

/////////////// log-in
btnLogin.addEventListener("click", function (p) {
  setTimer();
  ////////
  p.preventDefault();
  ///////
  const userName = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  currentAccount = accounts.find(
    (acc) => acc.username === userName && acc.pin === pin
  );
  inputLoginUsername.value = inputLoginPin.value = "";
  if (currentAccount) {
    // welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    CurrentAccountIndex = accounts.indexOf(currentAccount);
    set_And_Update_UI();
    appOpacity("100%");
  } else {
    alert("Log-in  failed");
  }
});
///////////////////// transfer money

btnTransfer.addEventListener("click", function (p) {
  ////////////////
  p.preventDefault();
  /////////////////
  setTimer(); ////////// reset timer
  const uName = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const Recipient = accounts.find((acc) => acc.username === uName);

  if (Recipient && Recipient !== currentAccount) {
    if (
      amount < currentAccount.movements.reduce((acc, val) => acc + val, 0) &&
      amount > 0
    ) {
      setTimeout(() => {
        Recipient.movements.push(amount);
        currentAccount.movements.push(-amount);
        pushDate(Recipient);
        pushDate(currentAccount);
        set_And_Update_UI();
      }, 2000);
    } else alert("Sorry your balance is less than the transferAmount");
  } else alert("Sorry this accountUserName is not exist !! ");
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
});

///////////////////////// close an account
btnClose.addEventListener("click", function (p) {
  /////////////////
  p.preventDefault();
  //////////////////
  let clsUser = inputCloseUsername.value;
  let clsUserPin = inputClosePin.value;
  const accountIndex = accounts.findIndex(
    (curr) => curr.username === clsUser && curr.pin === Number(clsUserPin)
  );
  if (accountIndex !== -1) {
    accounts.splice(accountIndex, 1);
    if (CurrentAccountIndex === accountIndex) appOpacity("0");
    alert("closed Successfully !!");
    inputCloseUsername.value = "";
    inputClosePin.value = "";
  } else alert("This account isn't Exist");
});

///////////////////// Loan

btnLoan.addEventListener("click", function (p) {
  ///////////////////
  p.preventDefault();
  //////////////////
  setTimer(); ////////// reset timer

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= (loanAmount * 10) / 100)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(Math.round(loanAmount));
      pushDate(currentAccount);
      set_And_Update_UI();
    }, 1500);
  } else alert("Failed");
  inputLoanAmount.value = "";
});

/////////////////////// sort
let counter = 0;
btnSort.addEventListener("click", () => {
  counter++;
  const Sorted = [...currentAccount.movements];
  Sorted.sort((a, b) => a - b);
  if (counter % 2 !== 0) {
    displayMovs(Sorted);
    btnSort.textContent = "↑ Sorted";
  } else {
    displayMovs(currentAccount.movements);
    btnSort.textContent = "↓ Sort";
  }
});
///////////// functions test
createUserNames(accounts);
alert(`UserName  | password 
=============
      ma        |  1111
                   |
       at         |  2222`);
