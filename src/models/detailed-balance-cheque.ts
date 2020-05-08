import { DetailedBalance } from './detailed-balance'

export interface DetailedBalanceChequeInitData {
	balance: number
	availableBalance: number
	reservedFunds: number
	pendingCredits: number
	chargesAccrued: number
	minimumBalance: number
	pendingDebits: number
	outstandingDebitCardAuthorization: number
}

/** Provides access to all data FNB provide for the detailed balance of a cheque account. */
export class DetailedBalanceCheque implements DetailedBalance {
	public readonly balance: number
	public readonly availableBalance: number
	public readonly reservedFunds: number
	public readonly pendingCredits: number
	public readonly chargesAccrued: number
	public readonly minimumBalance: number
	public readonly pendingDebits: number
	public readonly outstandingDebitCardAuthorization: number

	constructor(init: DetailedBalanceChequeInitData) {
		this.balance = init.balance
		this.availableBalance = init.availableBalance
		this.reservedFunds = init.reservedFunds
		this.pendingCredits = init.pendingCredits
		this.chargesAccrued = init.chargesAccrued
		this.minimumBalance = init.minimumBalance
		this.pendingDebits = init.pendingDebits
		this.outstandingDebitCardAuthorization = init.outstandingDebitCardAuthorization
	}
}
