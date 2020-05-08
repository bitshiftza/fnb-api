import { Page } from 'puppeteer'
import { DetailedBalanceChequeInitData } from '../models'

export const scrapeChequeOrSavings = async (page: Page): Promise<DetailedBalanceChequeInitData> => {
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
	}

	const balance = await (getValueForRowAndCell(1, 1, 0))
	const minimumBalance = await (getValueForRowAndCell(1, 2, 0))
	const reservedFunds = await (getValueForRowAndCell(2, 1, 0))
	const pendingDebits = await (getValueForRowAndCell(2, 2, 0))
	const pendingCredits = await (getValueForRowAndCell(3, 1, 0))
	const outstandingDebitCardAuthorization = await (getValueForRowAndCell(3, 2, 0))
	const chargesAccrued = await (getValueForRowAndCell(3, 1, 1))
	const availableBalance = await (getValueForRowAndCell(3, 1, 2))

	return {
		balance,
		minimumBalance,
		reservedFunds,
		pendingDebits,
		pendingCredits,
		outstandingDebitCardAuthorization,
		chargesAccrued,
		availableBalance
	}
}