import { AccountType } from './account-type'
import { DebitOrder } from './debit-order'
import { DetailedBalance } from './detailed-balance'
import { Transaction } from './transaction'
import { getScraper } from '../scrapers/scraper-factory'
import { DetailedBalanceSavings } from './detailed-balance-savings'
import { TransactionSavings } from './transaction-savings'
import { DetailedBalanceCheque } from './detailed-balance-cheque'
import { TransactionCheque } from './transaction-cheque'
import { DetailedBalanceCredit } from './detailed-balance-credit'
import { TransactionCredit } from './transaction-credit'
import { DetailedBalanceVehicle } from './detailed-balance-vehicle'
import { TransactionVehicle } from './transaction-vehicle'

export interface AccountInitData {
	name: string
	accountNumber: string
	balance?: number
	availableBalance: number
}

/** Represents an FNB account and provides access to more granular account data. */
export class Account<TBalance extends DetailedBalance = DetailedBalance, TTransaction extends Transaction = Transaction>  {
	/** The "nickname" of the account */
	public readonly name: string

	/** The account number of the account. This may be masked. */
	public readonly accountNumber: string

	/** The current balance of the account. Can be undefined during FNBs maintenance mode. */
	public readonly balance?: number

	/** The available balance of the account. */
	public readonly availableBalance: number

	constructor(init: AccountInitData) {
		this.name = init.name
		this.accountNumber = init.accountNumber
		this.balance = init.balance
		this.availableBalance = init.availableBalance
	}

	/**
	 * Gets all transactions FNB exposes through online banking.
	 * @see Transaction
	 */
	public async transactions<T extends Transaction = TTransaction>(): Promise<T[]> {
		const data = await getScraper().transactions(this)
		return data.transactions as T[]
	}

	/**
	 * Gets the detailed balance for this account type.
	 * @see type
	 * @see AccountType
	 * @see DetailedBalance
	 * @see DetailedBalanceCredit
	 * @see DetailedBalanceCheque
	 */
	public async detailedBalance<T extends DetailedBalance = TBalance>(): Promise<T> {
		const data = await getScraper().detailedBalance(this)
		return data.balance as T
	}

	/**
	 * Gets a list of debit orders FNB exposes through online banking.
	 * @see DebitOrder
	 */
	public debitOrders(): Promise<DebitOrder[]> {
		return Promise.resolve([])
	}

	/**
	 * Gets the type of this account
	 * @see AccountType
	 */
	public async type(): Promise<AccountType> {
		const data = await getScraper().detailedBalance(this)
		return data.accountType
	}
}

export type AccountCheque = Account<DetailedBalanceCheque, TransactionCheque>
export type AccountCredit = Account<DetailedBalanceCredit, TransactionCredit>
export type AccountSavings = Account<DetailedBalanceSavings, TransactionSavings>
export type AccountVehicle = Account<DetailedBalanceVehicle, TransactionVehicle>
