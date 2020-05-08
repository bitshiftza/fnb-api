import moment, { Moment } from 'moment'

/** Provides access to all data FNB provide for a debit order. */
export class DebitOrder {
	/** The date the debit order was processed. */
	public readonly date: Moment
	
	/** The description provided for the debit order. */
	public readonly description: string

	/** The amount deducted by the debit order. */
	public readonly amount: number

	constructor() {
		this.date = moment()
		this.description = ''
		this.amount = 0
	}
}
