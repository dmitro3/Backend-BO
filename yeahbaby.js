unMatchBalance = {
  btc: false,
  eth: false,
  bnb: false,
  matic: true,
  usdtEth: false,
  usdcEth: false,
  usdtBnb: false,
  usdcBnb: false,
  usdtMatic: false,
  usdcMatic: false,
};

console.log(
  Object.values(unMatchBalance).some(
    (value) => value === true || value === null
  )
);
