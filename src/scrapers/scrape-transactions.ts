import { Page } from 'puppeteer'
import { Account } from '../models/account'
import { AccountType } from '../models/account-type'
import { evaluateAccountType } from './scrape-util'
import { navigateToAccount } from './navigator'
import { Transaction } from '../models/transaction'
import { TransactionCheque, TransactionChequeInitData } from '../models/transaction-cheque'
import { TransactionSavings, TransactionSavingsInitData } from '../models/transaction-savings'
import { TransactionCredit } from '../models/transaction-credit'
import { TransactionStatus } from '../models/transaction-status'
import moment from 'moment'


export interface TransactionsResponse {
	transactions: Transaction[]
	accountType: AccountType
}

function cleanNumber(text: string) {
	const amount: string = text.replace(/\s+/, '').replace('R', '').replace(',', '').replace('eB', '')
	const num: number = parseInt(Math.round(parseFloat(amount) * 100) as any, 10)
	return num
}

async function scrapeChequeOrSavings<T extends TransactionChequeInitData>(page: Page): Promise<T[]> {
	const rows = await page.evaluate(() => {
		/* tslint:disable */

		var data = [];

		var rows = $('.tableRow');
		for (var i = 0; i < rows.length; i++) {
			var row = $(rows[i]);
			var cells = row.find('.tableCell .tableCellItem');

			data.push({
				date: cells[0].innerText as any,
				description: cells[1].innerText,
				reference: cells[2].innerText,
				serviceFee: cells[3].innerText as any,
				amount: cells[4].innerText as any,
				balance: cells[5].innerText as any,
				status: 'Successful'
			});
		}

		return data;
		/* tslint:enable */
	})

	return rows.map((x: any) => ({
		date: moment(x.date, 'DD MMM YYYY'),
		description: x.description,
		reference: x.reference,
		serviceFee: cleanNumber(x.serviceFee),
		amount: cleanNumber(x.amount),
		balance: cleanNumber(x.balance),
		status: TransactionStatus.Successful
	}) as T)
}

const scrapeCheque = async (page: Page): Promise<TransactionCheque[]> => {
	return (await scrapeChequeOrSavings<TransactionChequeInitData>(page)).map(x => new TransactionCheque(x))
}

const scrapeSavings = async (page: Page): Promise<TransactionSavings[]> => {
	return (await scrapeChequeOrSavings<TransactionSavingsInitData>(page)).map(x => new TransactionSavings(x))
}

const scrapeCredit = async (page: Page): Promise<TransactionCredit[]> => {
	const rows = await page.evaluate(() => {
		/* tslint:disable */

		var data = [];

		var rows = $('.tableRow');
		for (var i = 0; i < rows.length; i++) {
			var row = $(rows[i]);
			var cells = row.find('.tableCell .tableCellItem');

			data.push({
				date: cells[0].innerText as any,
				description: cells[1].innerText,
				amount: cells[2].innerText as any,
				status: 'Successful'
			});
		}

		return data;
		/* tslint:enable */
	})

	return rows.map((x: any) => new TransactionCredit({
		date: moment(x.date, 'DD MMM YYYY'),
		description: x.description,
		amount: cleanNumber(x.amount),
		status: TransactionStatus.Successful
	}))
}

export const scrapeTransactions = async (page: Page, account: Account): Promise<TransactionsResponse> => {
	await navigateToAccount(page, account, 'Transaction')
	const accountType = await evaluateAccountType(page)

	let promise: Promise<Transaction[]>

	switch (accountType) {
		case AccountType.Cheque:
			promise = scrapeCheque(page)
			break
		case AccountType.Credit:
			promise = scrapeCredit(page)
			break
		case AccountType.Savings:
		case AccountType.Easy:
			promise = scrapeSavings(page)
			break
		default:
			promise = Promise.resolve([])
			break
	}

	const transactions = await promise

	return {
		transactions,
		accountType
	}
}
