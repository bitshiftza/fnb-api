import { AccountType } from '../models/account-type'
import { Page } from 'puppeteer'

export const getAccountType = (text: string, hasEngineNumber: boolean) => {
	if (text.indexOf('Cheque') !== -1 || text.indexOf('Business Account') !== -1 || text.indexOf('Fusion') !== -1 || text.indexOf('Current') !== -1) {
		return AccountType.Cheque
	}

	if (text.indexOf('Credit') !== -1) {
		return AccountType.Credit
	}

	if (text.indexOf('Savings') !== -1) {
		return AccountType.Savings
	}

	if(text.indexOf('eBucks') !== -1) {
		return AccountType.eBucks
	}

	if(hasEngineNumber) {
		return AccountType.Vehicle
	}

	return AccountType.Other
}

export const evaluateAccountType = async (page: Page) => {
	const accountTypeString = await page.evaluate(() => $('.dlTitle:contains("Type") + div').text().trim())
	const hasEngineNumber = await page.evaluate(() => $('.formElementLabel:contains("Asset Engine Number")').length > 0)

	return getAccountType(accountTypeString, hasEngineNumber)
}
