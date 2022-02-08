import { Page } from 'puppeteer'
import { Account } from '../models/account'
import { AccountType } from '../models/account-type'
import { evaluateAccountType } from './scrape-util'
import { navigateToAccount } from './navigator'
import { DetailedBalance } from '../models/detailed-balance'
import { scrapeCredit } from './scrape-detailed-balance-credit'
import { scrapeCheque } from './scrape-detailed-balance-cheque'
import { scrapeSavings } from './scrape-detailed-balance-savings'
import { scrapeVehicle } from './scrape-detailed-balance-vehicle'

export interface DetailedBalanceResponse {
	balance: DetailedBalance
	accountType: AccountType
}

export const scrapeDetailedBalance = async (page: Page, account: Account): Promise<DetailedBalanceResponse> => {
	await navigateToAccount(page, account, 'Detailed')
	const accountType = await evaluateAccountType(page)

	let promise: Promise<DetailedBalance>

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
		case AccountType.Vehicle:
			promise = scrapeVehicle(page)
			break
		default:
			promise = Promise.resolve({})
			break
	}

	const balance = await promise

	return {
		balance,
		accountType
	}
}
