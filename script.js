"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Mohamed Ahmed",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Abu Treka",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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

const accounts = [account1, account2, account3, account4];

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
const appOpacity = (val) => {
  containerApp.style.opacity = val;
};
////////////////////////////// displayMoements

const displayMovs = function (Movements) {
  containerMovements.innerHTML = "";
  Movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const htmlCont = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date"></div>
    <div class="movements__value">${mov}€</div>
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
  labelBalance.textContent =
    Movements.reduce((acc, curr) => acc + curr, 0) + "€";
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
  labelSumIn.textContent = inCome + "€";
  labelSumOut.textContent = Math.abs(outCome) + "€";
  labelSumInterest.textContent = interest.toFixed(2) + "€";
};

const set_And_Update_UI = function () {
  displayMovs(currentAccount.movements);
  calcBalance(currentAccount.movements);
  calcSummary(currentAccount.movements, currentAccount.interestRate);
};

/////////////// log-in
let currentAccount, CurrentAccountIndex;
btnLogin.addEventListener("click", function (p) {
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
  const uName = inputTransferTo.value;
  const amount = Number(inputTransferAmount.value);
  const Recipient = accounts.find((acc) => acc.username === uName);

  if (Recipient && Recipient !== currentAccount) {
    if (
      amount < currentAccount.movements.reduce((acc, val) => acc + val, 0) &&
      amount > 0
    ) {
      Recipient.movements.push(amount);
      currentAccount.movements.push(-amount);
      set_And_Update_UI();
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
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= (loanAmount * 10) / 100)
  ) {
    currentAccount.movements.push(loanAmount);
    set_And_Update_UI();
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

alert(`
userName   pin

  ma          1111

  at            2222

  mma       3333

  am          4444`);
