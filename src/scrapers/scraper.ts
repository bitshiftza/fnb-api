import moment, { Moment } from 'moment';
import { launch, Browser, Page } from 'puppeteer';
import { ApiOptions } from '../api/fnb-api';
import { Account, DetailedBalance, AccountType, Transaction } from '../models';
import scrapeAccounts from './scrape-accounts';
import scrapeDetailedBalance from './scrape-detailed-balance';
import scrapeTransactions from './scrape-transactions';

export class Scraper {
	private _loginDate: Moment | undefined;
	private _options: ApiOptions;
	private _browser: Browser | undefined;
	private _page: Page | undefined;

	constructor(options: ApiOptions) {
		this._options = options;
	}

	public async accounts(): Promise<Account[]> {
		const page = await this._getLoggedInPage();
		return await scrapeAccounts(page);
	}

	public async detailedBalance(account: Account): Promise<{
		balance: DetailedBalance,
		accountType: AccountType
	}> {
		const page = await this._getLoggedInPage();
		return await scrapeDetailedBalance(page, account);
	}

	public async transactions(account: Account): Promise<{
		transactions: Transaction[],
		accountType: AccountType
	}> {
		const page = await this._getLoggedInPage();
		return await scrapeTransactions(page, account);
	}

	public async close() {
		if (this._page) {
			try {
				await this._page.close();
				this._page = undefined;
			} catch { }
		}

		if (this._browser) {
			try {
				await this._browser.close();
				this._browser = undefined;
			} catch { }
		}
	}

	private async _getLoggedInPage(): Promise<Page> {
		if (this._isLoggedIn()) {
			return this._page as Page;
		}

		return this._login();
	}

	private async _login() {
		if (this._browser) {
			this.close();
		}

		this._browser = await launch(this._options.puppeteerOptions || {});
		this._page = await this._browser.newPage();
		this._page.setViewport({ width: 1280, height: 720 });

		await this._page.goto('https://fnb.co.za');
		await this._page.type('#user', this._options.username);
		await this._page.type('#pass', this._options.password);
		await this._page.click('input[type="submit"]');

		await this._page.waitForFunction(() =>
			!!document.getElementById('newsLanding') ||
			document.getElementsByClassName('footerBtn').length !== 0 ||
			$('.loginPanel.overlayPanelHide').length > 0);

		const loginFailed = await this._page.evaluate(() => $('.loginPanel.overlayPanelHide').length === 0);
		if (loginFailed) {
			throw new Error('Login failed. Please check your credentials');
		}

		const hasFooterButton = await this._page.evaluate(() => document.getElementsByClassName('footerBtn').length > 0);
		if (hasFooterButton) {
			await this._clickFooterButton();
		}

		await this._page.waitForFunction(() => !!document.getElementById('newsLanding'));

		this._loginDate = moment();
		return this._page;
	}

	private async _clickFooterButton() {
		const page = this._page as Page;
		await page.click('.footerBtn a');
	}

	private _isLoggedIn() {
		if (!this._loginDate) {
			return false;
		}

		if ((this._page as Page).isClosed()) {
			return true;
		}

		const timeSinceLoginInSeconds = moment.duration(moment().diff(this._loginDate)).asSeconds();
		return timeSinceLoginInSeconds < 100;
	}
}
