import { Page } from 'puppeteer';
import { Account } from '../models/account';
import { AccountType } from '../models/account-type';
import { navigateToAccount } from './navigator';
import { DetailedBalance } from '../models/detailed-balance';
import { DetailedBalanceCheque, DetailedBalanceCredit, DetailedBalanceChequeInitData, DetailedBalanceSavings } from '../models';
import moment from 'moment';

function getAccountType(text: string) {
	if (text.indexOf('Cheque') !== -1) {
		return AccountType.Cheque;
	}

	if (text.indexOf('Credit') !== -1) {
		return AccountType.Credit;
	}

	if (text.indexOf('Savings') !== -1) {
		return AccountType.Savings;
	}

	return AccountType.Other;
}

const scrapeChequeOrSavings = async (page: Page): Promise<DetailedBalanceChequeInitData> => {
	const getValueForRowAndCell = async (row: number, cell: number, element: number) => {
		/* tslint:disable */
		function cleanNumber(text: string) {
			var amount: string = text.replace(/\s+/, '').replace('R', '').replace(',', '').replace('eB', '');
			var num: number = parseInt(Math.round(parseFloat(amount) * 100) as any, 10);
			return num;
		}

		const val = `h3:contains("Account Details") + .formTable .tableRow:nth-child(${row}) .tableCell:nth-child(${cell}) .tableCellItem:last-child()`;
		return cleanNumber(await page.evaluate((toEval: string, index: number) => $(toEval)[index].innerText.trim(), val, element));
		/* tslint:enable */
	};

	const balance = await (getValueForRowAndCell(1, 1, 0));
	const minimumBalance = await (getValueForRowAndCell(1, 2, 0));
	const reservedFunds = await (getValueForRowAndCell(2, 1, 0));
	const pendingDebits = await (getValueForRowAndCell(2, 2, 0));
	const pendingCredits = await (getValueForRowAndCell(3, 1, 0));
	const outstandingDebitCardAuthorization = await (getValueForRowAndCell(3, 2, 0));
	const chargesAccrued = await (getValueForRowAndCell(3, 1, 1));
	const availableBalance = await (getValueForRowAndCell(3, 1, 2));

	return {
		balance,
		minimumBalance,
		reservedFunds,
		pendingDebits,
		pendingCredits,
		outstandingDebitCardAuthorization,
		chargesAccrued,
		availableBalance
	};
};

const scrapeCheque = async (page: Page): Promise<DetailedBalanceCheque> => {
	return new DetailedBalanceCheque(await scrapeChequeOrSavings(page));
};

const scrapeSavings = async (page: Page): Promise<DetailedBalanceSavings> => {
	return new DetailedBalanceSavings(await scrapeChequeOrSavings(page));
};

const scrapeCredit = async (page: Page): Promise<DetailedBalanceCredit> => {
	const getValueForRow = async (row: number) => {
		/* tslint:disable */
		function cleanNumber(text: string) {
			var amount: string = text.replace(/\s+/, '').replace('R', '').replace(',', '').replace('eB', '');
			var num: number = parseInt(Math.round(parseFloat(amount) * 100) as any, 10);
			return num;
		}

		const val = `h3:contains("Detailed Balance Details") + .formTable .tableRow:nth-child(${row}) .tableCell:nth-child(2) .tableCellItem:last-child()`;
		return cleanNumber(await page.evaluate((toEval: string) => $(toEval)[0].innerText.trim(), val));
		/* tslint:enable */
	};

	const getValueForRowString = async (row: number) => {
		/* tslint:disable */
		const val = `h3:contains("Detailed Balance Details") + .formTable .tableRow:nth-child(${row}) .tableCell:nth-child(2) .tableCellItem:last-child()`;
		return await page.evaluate((toEval: string) => $(toEval)[0].innerText.trim(), val);
		/* tslint:enable */
	};

	const availableCredit = await getValueForRow(1);
	const currentBalance = await getValueForRow(2);
	const minimumRequiredPayment = await getValueForRow(3);
	const minimumRequiredPaymentDueDate = moment(await getValueForRowString(4), 'DD MMM YYYY');
	const budgetBalance = await getValueForRow(5);
	const budgetAvailable = await getValueForRow(6);
	const outstandingAuthorisationNormal = await getValueForRow(7);
	const outstandingAuthorisationBudget = await getValueForRow(8);

	return new DetailedBalanceCredit({
		availableCredit,
		currentBalance,
		minimumRequiredPayment,
		minimumRequiredPaymentDueDate,
		budgetBalance,
		budgetAvailable,
		outstandingAuthorisationNormal,
		outstandingAuthorisationBudget
	});
};

export default async (page: Page, account: Account) => {
	await navigateToAccount(page, account, 'Detailed');

	const accountTypeString = await page.evaluate(() => $('.dlTitle:contains("Type") + div').text().trim());
	const accountType = getAccountType(accountTypeString);

	let promise: Promise<DetailedBalance>;

	switch (accountType) {
		case AccountType.Cheque:
			promise = scrapeCheque(page);
			break;
		case AccountType.Credit:
			promise = scrapeCredit(page);
			break;
		case AccountType.Savings:
			promise = scrapeSavings(page);
			break;
		default:
			promise = Promise.resolve({});
			break;
	}

	const balance = await promise;

	return {
		balance,
		accountType
	};
};
