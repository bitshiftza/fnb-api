import { Moment } from 'moment'
import { TransactionStatus } from './transaction-status'
import { Transaction, TransactionInitData } from './transaction'

export interface TransactionChequeInitData extends TransactionInitData {
	date: Moment
	description: string
	reference?: string
	serviceFee?: number
	amount: number
	balance?: number
	status: TransactionStatus
}

/** Provides access to all data FNB provide for a cheque account transaction. */
export class TransactionCheque extends Transaction {

	/** The reference number provided for the transaction. */
	public readonly reference: string | undefined

	/** The service fee charged for the transaction. */
	public readonly serviceFee: number | undefined

	/** The resulting balance of the transaction after the transaction was processed. */
	public readonly balance: number | undefined

	constructor(init: TransactionChequeInitData) {
		super(init)
		this.reference = init.reference
		this.serviceFee = init.serviceFee
		this.balance = init.balance
	}
}
