const conversion_rate = 5;

const dollarToCredit = (donation) => {
  donation = donation / conversion_rate;
  return donation;
};

const creditToDollar = (credit) => {
  credit = credit * conversion_rate;
  return credit;
};

export { dollarToCredit, creditToDollar };
