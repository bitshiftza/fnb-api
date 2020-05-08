import { DetailedBalance } from './detailed-balance'

export interface DetailedBalanceCreditInitData {
	availableCredit: number
	currentBalance: number
	minimumRequiredPayment: number
	budgetBalance: number
	budgetAvailable: number
	outstandingAuthorisationNormal: number
	outstandingAuthorisationBudget: number
}

/** Provides access to all data FNB provide for the detailed balance of a credit account. */
export class DetailedBalanceCredit implements DetailedBalance {
	public readonly availableCredit: number
	public readonly currentBalance: number
	public readonly minimumRequiredPayment: number
	public readonly budgetBalance: number
	public readonly budgetAvailable: number
	public readonly outstandingAuthorisationNormal: number
	public readonly outstandingAuthorisationBudget: number

	constructor(init: DetailedBalanceCreditInitData) {
		this.availableCredit = init.availableCredit
		this.currentBalance = init.currentBalance
		this.minimumRequiredPayment = init.minimumRequiredPayment
		this.budgetBalance = init.budgetBalance
		this.budgetAvailable = init.budgetAvailable
		this.outstandingAuthorisationNormal = init.outstandingAuthorisationNormal
		this.outstandingAuthorisationBudget = init.outstandingAuthorisationBudget
	}
}
