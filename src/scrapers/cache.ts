import moment, { Moment } from 'moment'
import { ApiOptions } from '../api/fnb-api'
import { Account } from '../models/account'
import { DetailedBalanceResponse } from './scrape-detailed-balance'
import { TransactionsResponse } from './scrape-transactions'

interface CacheDictionary {
	[key: string]: {
		date: Moment;
		value: object;
	}
}

export class Cache {
	private _cache: CacheDictionary = {}
	private _options: ApiOptions

	constructor(options: ApiOptions) {
		this._options = options
	}

	private _getValue<T>(key: string) {
		const entry = this._cache[key]
		if (!entry) {
			return undefined
		}

		const entryAgeInSeconds = moment.duration(moment().diff(entry.date)).asSeconds()
		if (entryAgeInSeconds > (this._options.cacheTimeInSeconds as number)) {
			delete this._cache[key]
			return undefined
		}

		return entry.value as any as T
	}

	private _setValue(key: string, value: object) {
		this._cache[key] = {
			date: moment(),
			value
		}
	}

	public getAccounts() {
		return this._getValue<Account[]>('accounts')
	}

	public setAccounts(accounts: Account[]) {
		this._setValue('accounts', accounts)
	}

	public getDetailedBalance(account: Account) {
		return this._getValue<DetailedBalanceResponse>(`${account.name}_detailedBalance`)
	}

	public setDetailedBalance(account: Account, detailedBalance: DetailedBalanceResponse) {
		this._setValue(`${account.name}_detailedBalance`, detailedBalance)
	}

	public getTransactions(account: Account) {
		return this._getValue<TransactionsResponse>(`${account.name}_transactions`)
	}

	public setTransactions(account: Account, transactions: TransactionsResponse) {
		this._setValue(`${account.name}_transactions`, transactions)
	}
}
