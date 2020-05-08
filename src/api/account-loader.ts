import { Account } from '../models'
import { Scraper } from '../scrapers'

/** Proxy for fetching a list of accounts. */
export class AccountLoader {
	private _scraper: Scraper

	constructor(scraper: Scraper) {
		this._scraper = scraper
	}

	/** 
	 * Fetch a list of accounts from FNB. 
	 * @see Account
	 */
	public get(): Promise<Account[]> {
		return this._scraper.accounts()
	}
}
