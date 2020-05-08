import { Page } from 'puppeteer'
import { Account, AccountInitData } from '../models/account'
import { navigateToMyBankAccounts } from './navigator'

export default async (page: Page) => {
	await navigateToMyBankAccounts(page)

	const accounts: AccountInitData[] = await page.evaluate(() => {
		/* tslint:disable */
		function setValuesForSelector(selector: string, path: string, items: AccountInitData[], sanitizer: (text: string) => string | number | undefined) {
			$(selector).each(function (i, node) {
				if (!items[i]) {
					items.push({} as any);
				}

				(items[i] as any)[path] = sanitizer(node.textContent || '');
			});

			return items;
		}

		function cleanText(text: string) {
			return text.replace(/[\n\t]+/, '').replace(/[\n\t]+/, '').trim();
		}

		function cleanNumber(text: string) {
			var amount: string = text.replace(/\s+/, '').replace('R', '').replace(',', '').replace('eB', '');
			var num: number = parseInt(Math.round(parseFloat(amount) * 100) as any, 10);
			return num;
		}

		var accounts: AccountInitData[] = [];

		setValuesForSelector('[name="nickname"]', 'name', accounts, cleanText);
		setValuesForSelector('[name="accountNumber"]', 'accountNumber', accounts, cleanText);
		setValuesForSelector('[name="ledgerBalance"]', 'balance', accounts, cleanNumber);
		setValuesForSelector('[name="availablebalance"]', 'availableBalance', accounts, cleanNumber);

		return accounts;
		/* tslint:enable */
	})

	return accounts.map(x => new Account(x))
}
