const parameterEquations = {
  // Done
  operatingExpenses: [
    "propertyManagement + repairsMaintenance + vacancy + taxes + insurance + hoaFees + otherExpenses"
  ],
  totalExpenses: [
    "operatingExpenses + debtService + capitalExpenditures"
  ],
  profitPerMonth: [
    "rent - totalExpenses + otherIncome"
  ],
  capRate: [
    "noi / (purchasePrice + closingCosts + estimatedRepairs) * 100"
  ],
  noi: [
    "(rent + otherIncome - operatingExpenses) * 12"
  ],
  cashOnCashRoi: [
    "profitPerMonth * 12 / (purchasePrice + closingCosts + estimatedRepairs) * 100"
  ],
  equityAfterRepairs: [
    "arv - purchasePrice - estimatedRepairs - closingCosts"
  ],
  purchasePrice: [
    // if I have desired CoC% and net profit, I can solve for purchase price
    "profitPerMonth * 12 / (cashOnCashRoi / 100)",
    "noi / (capRate / 100)",
    // if I have equity after repairs, estimated repairs, and ARV, I can solve for purchase price
    "arv - equityAfterRepairs - estimatedRepairs - closingCosts"
  ],
  
  // In Work
  cashOutlay: [
    // Totally derived from amount needed to meet purchase price vs what is in the funding matrix marked as 'cash'
  ],
  debtService: [
    // Totally derived from amount needed to meet purchase price vs what is in the funding matrix
  ],

  // Derivable, but lower priority. These are numbers I expect people to fill in data for most of the time.
  rent: [],
  arv: [],
  estimatedRepairs: [],

  // SqFt is in Basic Info, so I can't easily derive this without refactor. Just gonna ignore it for now...?
  dollarPerSquareFoot: [],

  // Technically any of these are derivable, but in practice people aren't going to be doing things like
  //  deriving HOA fees or taxes owed. Any of the parameters below this point will not be derivable at this point in the app.
  hoaFees: [],
  propertyManagement: [],
  repairsMaintenance: [],
  capitalExpenditures: [],
  vacancy: [],
  taxes: [],
  insurance: [],
  otherIncome: [],
  otherExpenses: [],
  closingCosts: [],
};

// Used to turn input %s into $s
// Not to be used for things that don't get represented in dollars in some way (ex. CapRate, CoCRoI)
const percentEquations = {
  operatingExpenses: "(rent + otherIncome) * (operatingExpenses / 100)",
  totalExpenses: "(rent + otherIncome) * (totalExpenses / 100)",
  equityAfterRepairs: "arv * (equityAfterRepairs / 100)",
  propertyManagement: "rent * (propertyManagement / 100)",
  repairsMaintenance: "rent * (repairsMaintenance / 100)",
  capitalExpenditures: "rent * (capitalExpenditures / 100)",
  vacancy: "rent * (vacancy / 100)",
  closingCosts: "purchasePrice * (closingCosts / 100)"
};

export { parameterEquations, percentEquations };