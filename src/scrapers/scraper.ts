import moment, { Moment } from 'moment'
import puppeteer from 'puppeteer'
import { ApiOptions } from '../api/fnb-api'
import { Account } from '../models/account'
import scrapeAccounts from './scrape-accounts'
import { scrapeDetailedBalance, DetailedBalanceResponse } from './scrape-detailed-balance'
import { scrapeTransactions, TransactionsResponse } from './scrape-transactions'
import { Cache } from './cache'

export class Scraper {
	private _loginDate: Moment | undefined
	private _options: ApiOptions
	private _browser: puppeteer.Browser | undefined
	private _page: puppeteer.Page | undefined
	private _cache: Cache

	constructor(options: ApiOptions) {
		this._options = options
		this._cache = new Cache(options)
	}

	public async accounts(): Promise<Account[]> {
		const page = await this._getLoggedInPage()

		if (this._options.cache === true) {
			const existing = this._cache.getAccounts()
			if (existing) {
				return existing
			}
		}

		const accounts = await scrapeAccounts(page)
		if (this._options.cache === true) {
			this._cache.setAccounts(accounts)
		}

		return accounts
	}

	public async detailedBalance(account: Account): Promise<DetailedBalanceResponse> {
		const page = await this._getLoggedInPage()

		if (this._options.cache === true) {
			const existing = this._cache.getDetailedBalance(account)
			if (existing) {
				return existing
			}
		}

		const detailedBalance = await scrapeDetailedBalance(page, account)
		if (this._options.cache === true) {
			this._cache.setDetailedBalance(account, detailedBalance)
		}

		return detailedBalance
	}

	public async transactions(account: Account): Promise<TransactionsResponse> {
		const page = await this._getLoggedInPage()

		if (this._options.cache === true) {
			const existing = this._cache.getTransactions(account)
			if (existing) {
				return existing
			}
		}

		const transactions = await scrapeTransactions(page, account)
		if (this._options.cache === true) {
			this._cache.setTransactions(account, transactions)
		}

		return transactions
	}

	public async close() {
		if (this._page) {
			try {
				await this._page.close()
				this._page = undefined
			} catch { }
		}

		if (this._browser) {
			try {
				await this._browser.close()
				this._browser = undefined
			} catch { }
		}
	}

	private async _getLoggedInPage(): Promise<puppeteer.Page> {
		if (this._isLoggedIn()) {
			return this._page as puppeteer.Page
		}

		return this._login()
	}

	private async _login() {
		if (this._browser) {
			this.close()
		}

		this._browser = await puppeteer.launch(this._options.puppeteerOptions || {})
		this._page = await this._browser.newPage()
		this._page.setViewport({ width: 1280, height: 720 })

		await this._page.goto('https://fnb.co.za')
		await this._page.type('#user', this._options.username)
		await this._page.type('#pass', this._options.password)
		await this._page.click('input[type="submit"]')

		await this._page.waitForFunction(() =>
			!!document.getElementById('newsLanding') ||
			document.getElementsByClassName('footerBtn').length !== 0 ||
			!!document.getElementById('gotItButtonBtn') ||
			$('.loginPanel.overlayPanelHide').length > 0)

		const loginFailed = await this._page.evaluate(() => $('.loginPanel.overlayPanelHide').length === 0)
		if (loginFailed) {
			throw new Error('Login failed. Please check your credentials')
		}

		await this._page.waitForFunction(() => !!document.querySelector('#loaderOverlay.overlayContainer.Hhide'))
		await this._page.waitForFunction(() => document.getElementsByClassName('footerBtn').length > 0 || !!document.getElementById('newsLanding') || !!document.getElementById('gotItButtonBtn'))

		const hasFooterButton = await this._page.evaluate(() => document.getElementsByClassName('footerBtn').length > 0)
		if (hasFooterButton) {
			await this._clickFooterButton()
		}

		const hasGotItButton = await this._page.evaluate(() => !!document.getElementById('gotItButtonBtn'))
		if (hasFooterButton) {
			await this._clickGitItButton()
		}

		await this._page.waitForFunction(() => !!document.getElementById('newsLanding'))

		this._loginDate = moment()
		return this._page
	}

	private async _clickFooterButton() {
		const page = this._page as puppeteer.Page
		await page.click('.footerBtn a')
	}

	private async _clickGitItButton() {
		const page = this._page as puppeteer.Page
		await page.click('#gotItButtonBtn')
	}

	private _isLoggedIn() {
		if (!this._loginDate) {
			return false
		}

		if ((this._page as puppeteer.Page).isClosed()) {
			return true
		}

		const timeSinceLoginInSeconds = moment.duration(moment().diff(this._loginDate)).asSeconds()
		return timeSinceLoginInSeconds < 100
	}
}
