import update from 'immutability-helper';
import Parser from 'expr-eval';
import { parameterEquations, percentEquations } from './Equations';
import { AmountTypes } from '../model/Types';

let parser = Parser.Parser;

function flattenDealParameters(dealParameters) {
  return Object.keys(dealParameters).reduce((acc, key) => {
    if (dealParameters[key].amount !== undefined) {
      return Object.assign({}, acc, { [key]: dealParameters[key].amount });
    } else {
      return acc;
    }
  }, {});
}

function calculateDollarValueOfPercentParams(mappedParams, dealParameters) {
  // Get the dollar values of any percent type values
  let calculatedDollarParams = {}
  let lastKey = '';
  try {
    Object.keys(mappedParams).forEach((key) => {
      lastKey = key;
      if (dealParameters[key].amountType === AmountTypes.Percent) {
        let equation = percentEquations[key];
        if (equation !== undefined) {
          let expr = parser.parse(equation);
            let calculatedDollars = expr.evaluate(mappedParams);
            calculatedDollarParams[key] = calculatedDollars;
        }
      }
    });
  } catch (err) {
    // TODO: Show them what they still need to fill out.
    console.log(`Not enough info to calculate ${lastKey}!`);
    return null;
  }

  return calculatedDollarParams;
}

function evaluateEquation(equation, mappedParams, calculatedDollarParams) {
  let expr = parser.parse(equation);
  let neededVars = expr.variables();

  // Make sure we don't have a circular dependency
  if (neededVars.some(v => mappedParams[v] === null)) {
    return null;
  }

  let missingVars = neededVars.filter(v => mappedParams[v] === undefined && calculatedDollarParams[v] === undefined);

  // Set these all to 'null' as a flag for 'going to calculate'
  missingVars.forEach(v => {
    mappedParams[v] = null;
  });

  // Evaluate all dependencies
  missingVars.forEach(v => {
    mappedParams[v] = evaluateParameter(v, mappedParams, calculatedDollarParams);
  });

  if (missingVars.some(v => mappedParams[v] === null)) {
    return null;
  }

  // Evaluate self
  return expr.evaluate({...mappedParams, ...calculatedDollarParams});
}

function evaluateParameter(parameterName, mappedParams, calculatedDollarParams) {
  let eqList = parameterEquations[parameterName];
  let retVal = 0;
  eqList.some(eq => {
    retVal = evaluateEquation(eq, mappedParams, calculatedDollarParams);
    return !isNaN(retVal) && retVal !== null;
  });

  return !isNaN(retVal) ? retVal : null;
}

const solve = function(parameterNames, dealParameters, fundingMatrix) {
  // If we have multiple min/max values, we need to run all of this MULTIPLE TIMES, 
  //  dropping in one min/max value each, accumulating the results, 
  //  then finding out which result set (if any) matches all the min max constraints.
  let minMaxParams = Object.keys(dealParameters)
    .filter(name => dealParameters[name].min !== undefined || dealParameters[name].max !== undefined);
  
  let paramSets = minMaxParams.map(mmp => {
    let paramCopies = update(dealParameters, {
      [mmp] : { amount: { $set: dealParameters[mmp].min !== undefined ? dealParameters[mmp].min : dealParameters[mmp].max } } 
    });
    let mappedParams = flattenDealParameters(paramCopies);

    let calculatedDollarParams = calculateDollarValueOfPercentParams(mappedParams, dealParameters);
    if (calculatedDollarParams === null) {
      return {};
    }

    try {
      // Set these all to 'null' as a flag for 'going to calculate'
      parameterNames.forEach(v => {
        mappedParams[v] = null;
      });
      parameterNames.forEach(v => {
        mappedParams[v] = evaluateParameter(v, mappedParams, calculatedDollarParams);
      });
    } catch (err) {
      console.log(err.name);
      return {};
    }

    return mappedParams;
  });

  // console.log("All paramsets~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  // console.log(paramSets);

  // Now find out which of paramSets matches all constraints
  //  Should only be one or none, I think
  let bestMappedParams = paramSets.find(ps => {
    console.log("--> paramset");
    console.log(ps);
    return minMaxParams.every(mmp => {
      console.log("====> minmaxparam");
      console.log(mmp);
      console.log("====> dealparameter for minmaxparam");
      console.log(dealParameters[mmp]);
      console.log("====> param for minmaxparam");
      console.log(ps[mmp]);
      console.log("====> Min is defined");
      console.log(dealParameters[mmp].min !== undefined);
      console.log("====> paramset is greater than require min");
      console.log(ps[mmp], dealParameters[mmp].min);
      console.log(ps[mmp] >= dealParameters[mmp].min);
      
      return ps[mmp]
        && ((dealParameters[mmp].min !== undefined && ps[mmp] >= dealParameters[mmp].min)
        ||  (dealParameters[mmp].max !== undefined && ps[mmp] <= dealParameters[mmp].max));
    });
  }) || {};

  console.log('?????????????????????????"Solved" Params:????????????????????????');
  console.log(bestMappedParams);
  return bestMappedParams;
};

const getNecessaryValues = function(parameterNames, suppliedDealParameters, currentNecessaryValues) {
  currentNecessaryValues = currentNecessaryValues || [];
  
  parameterNames.forEach(parameterName => {
    let pullValuesForEquation = function(eq) {
      let expr = parser.parse(eq);
      let neededVars = expr.variables();
      // add each needed var to currentNecessaryValues if it is not in there already
      let newNeededVars = neededVars.filter(nv => !currentNecessaryValues.includes(nv));
      currentNecessaryValues.push(...newNeededVars);
      newNeededVars = getNecessaryValues(newNeededVars, suppliedDealParameters, currentNecessaryValues);
      currentNecessaryValues.push(...newNeededVars.filter(nnv => !currentNecessaryValues.includes(nnv)));
    };

    let eqList = parameterEquations[parameterName];
    if (!eqList.some(eq => {
      let expr = parser.parse(eq);
      let neededVars = expr.variables();
      let stillNeeded = neededVars.filter(nv => !suppliedDealParameters.includes(nv));
      if (stillNeeded.length === 0) {
        //This is the equation we want to use, don't check any of the other equations for this parameter.
        pullValuesForEquation(eq);
        return true;
      }
      return false;
    })) {
      eqList.forEach(pullValuesForEquation);
    }
  });

  return currentNecessaryValues;
};

// Used to get the amount used from each funding option in the matrix, given a specific purchase price
//  Also returns total debt service amount
function getBreakdownFromFundingMatrix(fundingMatrix, purchasePrice) {
  //fundingOptions: [{ name: "Cash on hand", amortizationPeriod: "", interest: 0, amount: 100, amountType: AmountTypes.Percent, isCash: true }],
  let results = {
    purchasePrice,
    debtService: 0,
    amountCash: 0,
    optionUsages: [],
  };

  let priceRemaining = purchasePrice;
  let success = fundingMatrix.some(fundingOption => {
    let cashValue = fundingOption.amount;
    if (fundingOption.amountType === AmountTypes.Percent) {
      cashValue = (fundingOption.amount / 100) * purchasePrice;
    }

    let percentage = Math.min(priceRemaining / cashValue, 1);
    let optionUsage = Object.assign({}, fundingOption, { amount: cashValue * percentage, amountType: AmountTypes.Dollars });
    results.optionUsages.push(optionUsage);
    results.amountCash += optionUsage.isCash ? optionUsage.amount : 0;
    if (optionUsage.amortizationPeriod) {
      let moRate = optionUsage.interest / 12;
      let somePiece = Math.pow(1 + moRate, optionUsage.amortizationPeriod);
      let paymentAmount = cashValue * (moRate * somePiece) / (somePiece - 1);
      results.debtService += paymentAmount;
    } else if (optionUsage.interest) {
      // Interest only payments
      let paymentAmount = (cashValue * optionUsage.interest) / 12;
      results.debtService += paymentAmount;
    }
    results.push(optionUsage);
    priceRemaining -= optionUsage.amount;

    return priceRemaining <= 0;
  });

  return success ? results : undefined;
}

// Used to get the amount used from each funding option in the matrix, given a specific debt service target
//  Also returns resulting purchase price
function getPurchasePriceFromFundingMatrix(fundingMatrix, debtService) {
  // GONNA BE WONKY IF WE HAVE A PERCENT IN HERE
  //  Not sure how I'm gonna solve it, though it is absolutely solvable. Probably time for some pencil and paper...
  
  //fundingOptions: [{ name: "Cash on hand", amortizationPeriod: "", interest: 0, amount: 100, amountType: AmountTypes.Percent, isCash: true }],
  let results = {
    purchasePrice: 0,
    debtService,
    amountCash: 0,
    optionUsages: [],
  };
  //TODO: There is the possibility that we can't reach our debtService target here, so may want to revisit that.
  //    (for example, if there is no interest bearing or amortizing amounts in here)

  // Go through each option in the funding matrix
  //  If it has no debt service, (interest == 0), and it is a DOLLAR AMOUNT, gobble it all up and continue on
  //  If it has no debt service, (interest == 0), and it is a PERCENT AMOUNT, set it aside. We'll need to calculate it later when we have the rest of the info.
  //  If it has debt service, and it is a DOLLAR AMOUNT
  //    calculate the total debt service if we use all of the funding
  //    if that does not meet our target debt service, gobble it all up and continue on
  //    if that exceeds or meets our target debt service, find out what percentage of this we need to use
  //  If it has debt service and it is a PERCENT AMOUNT

  // Now go back to all the previous percent amounts set aside and do something.
  //  If we only have percent amounts, this should be pretty easy?
  let remainingDebtService = debtService;
  fundingMatrix.some(fundingOption => {
    let optionUsage = Object.assign({}, fundingOption);
    
    if (optionUsage.amountType === AmountTypes.Dollars) {
      if (optionUsage.amortizationPeriod) {
        // Dollar amount, amortized
        let moRate = optionUsage.interest / 12;
        let somePiece = Math.pow(1 + moRate, optionUsage.amortizationPeriod);
        let paymentAmount = optionUsage.amount * (moRate * somePiece) / (somePiece - 1);
        if (paymentAmount < remainingDebtService) {
          remainingDebtService -= paymentAmount;
          optionUsage.debtService = paymentAmount;
          //Let this get added to the results
        }
      } else if (optionUsage.interest) {
        // Dollar amount, interest only
        let paymentAmount = (optionUsage.amount * optionUsage.interest) / 12;
        if (paymentAmount < remainingDebtService) {
          remainingDebtService -= paymentAmount;
          optionUsage.debtService = paymentAmount;
          //Let this get added to the results
        }
      } else {
        // Dollar amount, no debt service
          optionUsage.debtService = 0;
        // Don't need to do anything. Just add it to the list.
      }
    } else if (optionUsage.amountType === AmountTypes.Percent) {
      if (optionUsage.amortizationPeriod) {
        // Percent amount, amortized

      } else if (optionUsage.interest) {
        // Percent amount, interest only
      } else {
        // Percent amount, no debt service
        // Don't do anything yet. Just add it to the list and we'll resolve it later.
      }
    }

    results.push(optionUsage);
    return remainingDebtService <= 0;
  });

  //TODO: Resolve any percentages left in the optionUsages
  // TODO: Do I need to take into account the possibility of having over 100%?
  // situations: at least one dollar value, some percents (this is easy. Total the dollars, find out what the remaining percent is)
  //            all percents (this is fine as long as they add up to 100?)
  let totalDollars = results.optionUsages.reduce((dollarAmount, usage) => dollarAmount + (usage.amountType === AmountTypes.Dollars ? usage.amount : 0), 0);
  let totalPercent = results.optionUsages.reduce((percentAmount, usage) => percentAmount + (usage.amountType === AmountTypes.Percent ? usage.amount : 0), 0);
  if (totalDollars > 0) {
    let remainingPercent = 100 - totalPercent;
    let valueOfOnePercent = totalDollars / remainingPercent;
    results.optionUsages.forEach((_v, idx, arr) => { 
      arr[idx].amount *= valueOfOnePercent;
      arr[idx].amountType = AmountTypes.Dollars;
    });
  } else if (totalPercent === 100) {
    results.optionUsages.forEach((usage, idx, arr) => { 
      arr[idx].amountType = AmountTypes.Dollars;
      let moRate = usage.interest / 12;
      let somePiece = Math.pow(1 + moRate, usage.amortizationPeriod);
      // P = ((r * [1 + r]^n) / ([1 + r]^n - 1)) / paymentAmount
      arr[idx].amount = ((moRate * somePiece) / (somePiece - 1)) / usage.debtService;
    });
  }

  // Assume everything has been converted to dollar amount by this time
  results.amountCash = results.optionUsages.reduce((total, usage) => total + (usage.isCash ? usage.amount : 0), 0);
  results.purchasePrice = results.optionUsages.reduce((total, usage) => total + usage.amount, 0);
  return results;
}



// function calculateLoanPayment(originalLoanAmount, annualRate, numYears) {
//   let numMonths = numYears * 12;
//   let monthlyRate = (annualRate / 100) / 12;

//   return (monthlyRate * originalLoanAmount) / (1 - Math.pow(1 + monthlyRate, -numMonths));
// }

// function calculatePrincipalAndInterest(currentLoanAmount, annualRate, monthlyPayment) {
//   let monthlyRate = (annualRate / 100) / 12;

//   let interestAccrued = currentLoanAmount * monthlyRate;
//   return { principal: monthlyPayment - interestAccrued, interest: interestAccrued };
// }

// function calculateLoanValuesAtPeriod(originalLoanAmount, annualRate, numYears, periodNumber) {
//   let monthlyRate = (annualRate / 100) / 12;
//   let monthlyPayment = calculateLoanPayment(originalLoanAmount, annualRate, numYears);
//   let accruedPrincipal = originalLoanAmount * (Math.pow(1 + monthlyRate, periodNumber));
//   let accruedPayments = monthlyPayment * ((Math.pow(1 + monthlyRate, periodNumber) - 1) / monthlyRate);

//   let balance = accruedPrincipal - accruedPayments;
//   let interestAccrued = balance * monthlyRate;
//   return { balance, monthlyPayment, paymentPrincipalPortion: monthlyPayment - interestAccrued, paymentInterestPortion: interestAccrued };
// }

export { solve, getNecessaryValues };