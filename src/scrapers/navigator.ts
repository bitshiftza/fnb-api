import { Page } from 'puppeteer';
import { Account } from '../models/account';

export const navigateToMyBankAccounts = async (page: Page) => {
	const indexOfTab = await page.evaluate(() => {
		/* tslint:disable */
		var mainTabs = $('.mainTab');

		var index = null;
		mainTabs.each(function (i, item) {
			var node = item.firstChild;
			while (node && node.firstChild) {
				node = node.firstChild;
			}

			if (node && node.textContent && node.textContent.indexOf('My Bank') !== -1) {
				index = i;
			}
		});

		return index;
		/* tslint:enable */
	});

	if (indexOfTab === null) {
		throw new Error('Could not find tab to navigate to my tabs');
	}

	await page.click(`#topTabs span:nth-child(${indexOfTab + 1})`);
	await page.waitForFunction(() => $('#loaderOverlay.Hhide').length > 0);
	await page.waitForFunction(() => $('#summary_of_account_balances').length > 0);
};

export const navigateToAccount = async (page: Page, account: Account, tab: string) => {
	await navigateToMyBankAccounts(page);

	const indexOfAccount = await page.evaluate((acc: Account) => {
		/* tslint:disable */
		var names = $('[name="nickname"]');
		for (var i = 0; i < names.length; i++) {
			var accountName = (names[i].textContent || '').replace(/[\n\t]+/, '').replace(/[\n\t]+/, '').trim();
			if (accountName === acc.name) {
				return i;
			}
		}

		return null;
		/* tslint:enable */
	}, account);

	if (indexOfAccount === null) {
		throw new Error('Could not find account to navigate to');
	}

	await page.click(`#nickname_${indexOfAccount + 1} a`);
	await page.waitForFunction(() => $('#loaderOverlay.Hhide').length > 0);

	const indexOfTab = await page.evaluate((text: string) => {
		/* tslint:disable */
		var tabs = $('.subTabText');
		for (var i = 0; i < tabs.length; i++) {
			var tab = (tabs[i].textContent || '').trim();
			if (tab.indexOf(text) !== -1) {
				return i;
			}
		}

		return null;
		/* tslint:enable */
	}, tab);

	if (indexOfTab === null) {
		throw new Error('Could not find detailed balance tab to navigate to');
	}

	await page.click(`.subTabButton:nth-child(${indexOfTab + 1})`);
	await page.waitForFunction(() => $('#loaderOverlay.Hhide').length > 0);
};
