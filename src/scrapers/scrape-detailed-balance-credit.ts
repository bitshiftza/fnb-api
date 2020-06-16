import { Page } from 'puppeteer'
import { DetailedBalanceCredit } from '../models'

export const scrapeCredit = async (page: Page): Promise<DetailedBalanceCredit> => {
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
	}

	const availableCredit = await getValueForRow(1)
	const currentBalance = await getValueForRow(2)
	const minimumRequiredPayment = await getValueForRow(3)
	const budgetBalance = await getValueForRow(5)
	const budgetAvailable = await getValueForRow(6)
	const outstandingAuthorisationNormal = await getValueForRow(7)
	const outstandingAuthorisationBudget = await getValueForRow(8)

	return new DetailedBalanceCredit({
		availableCredit,
		currentBalance,
		minimumRequiredPayment,
		budgetBalance,
		budgetAvailable,
		outstandingAuthorisationNormal,
		outstandingAuthorisationBudget
	})
}
