import { Moment } from 'moment'
import { TransactionStatus } from './transaction-status'

export interface TransactionInitData {
	date: Moment
	description: string
	amount: number
	status: TransactionStatus
}

/** Provides access to all data FNB provide for a transaction. */
export class Transaction {
	/** The date the transaction was processed. */
	public readonly date: Moment

	/** The description of the transaction. */
	public readonly description: string

	/** The amount of the transaction. */
	public readonly amount: number

	/** 
	 * The status of the transaction.
	 * @see TransactionStatus
	 */
	public readonly status: TransactionStatus

	constructor(init: TransactionInitData) {
		this.date = init.date
		this.description = init.description
		this.amount = init.amount
		this.status = init.status
	}
}
