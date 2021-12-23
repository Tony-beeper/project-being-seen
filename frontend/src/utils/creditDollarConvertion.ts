const conversionRate = 5;

const creditToDollar = (credit: number) => (credit * conversionRate).toFixed(2);

const dollarToCredit = (dollar: number) => (dollar / conversionRate).toFixed(2);

export { creditToDollar, dollarToCredit };
