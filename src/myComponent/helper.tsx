export const getReducingDecliningInterest = (
  principal: number,
  r: number,
  tenorMonths: number
) => {
  const monthlyPrincipal = principal / tenorMonths;
  let bal = principal;
  let totalInt = 0;

  for (let m = 1; m <= tenorMonths; m++) {
    const interest = bal * r;
    totalInt += interest;
    bal -= monthlyPrincipal;
  }

  return totalInt;
};
