import { AccountLoader } from './account-loader'
import { LaunchOptions } from 'puppeteer'
import { Scraper, getScraper } from '../scrapers'

/** 
 * Configuration options for the FNB Api.
 * @see FnbApi
 */
export interface ApiOptions {
	/** The username to log in with. */
	username: string

	/** The password to log in with. */
	password: string

	/** Should scraped data be cached. Default = true */
	cache?: boolean

	/** If scraped data should be cached, for how long? Default = 60 */
	cacheTimeInSeconds?: number

	/** Puppeteer options */
	puppeteerOptions?: LaunchOptions
}

/**
 * Entry point into fetching banking data.
 * @see ApiOptions
 */
export class Api {
	private _options: ApiOptions
	private _scraper: Scraper

	/** Provides access to account information. */
	public readonly accounts: AccountLoader

	constructor(options: ApiOptions) {
		if (typeof options.cache !== 'boolean') {
			options.cache = true
		}

		if (typeof options.cacheTimeInSeconds !== 'number') {
			options.cacheTimeInSeconds = 60
		}

		this._options = options

		this._scraper = getScraper(this._options)
		this.accounts = new AccountLoader(this._scraper)
	}

	/** Frees up puppeteer resources */
	public close() {
		this._scraper.close()
	}
}
