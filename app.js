const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies';
const dropdowns = document.querySelectorAll('.dropdown select');
const btn = document.querySelector('form button');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.to select');
const amountInput = document.querySelector('.amount input');
const msg = document.querySelector('.msg');
const fromCurrencyFlag = document.querySelector('.from .flag img');
const toCurrencyFlag = document.querySelector('.to .flag img');

let isLoading = false;

const updateFlags = () => {
  updateFlag(fromCurr, fromCurrencyFlag);
  updateFlag(toCurr, toCurrencyFlag);
};

const updateFlag = (select, img) => {
  const currCode = select.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  if (isLoading) return;
  isLoading = true;
  msg.innerText = 'Loading...';

  const amount = amountInput.value;
  if (+amount <= 0) {
    msg.innerText = 'Please enter a positive number.';
    isLoading = false;
    return;
  }

  const fromCurrCode = fromCurr.value.toLowerCase();
  const toCurrCode = toCurr.value.toLowerCase();

  if (fromCurrCode === toCurrCode) {
    msg.innerText = `${amount} ${fromCurrCode} = ${amount} ${toCurrCode}`;
    isLoading = false;
    return;
  }

  try {
    const URL = `${BASE_URL}/${fromCurrCode}/${toCurrCode}.json`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    const rate = data[toCurrCode];

    const finalAmount = (amount * rate).toFixed(2);
    msg.innerText = `${amount} ${fromCurrCode} = ${finalAmount} ${toCurrCode}`;
  } catch (error) {
    msg.innerText = 'Error: Unable to fetch exchange rate.';
  }

  isLoading = false;
};

for (const select of dropdowns) {
  for (const currCode in countryList) {
    const newOption = document.createElement('option');
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === 'from' && currCode === 'USD') {
      newOption.selected = 'selected';
    } else if (
