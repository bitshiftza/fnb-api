import { Page } from 'puppeteer'
import moment from 'moment'
import { DetailedBalanceVehicle } from '../models'

export const scrapeVehicle = async (page: Page): Promise<DetailedBalanceVehicle> => {
	const getTextForRow = async (rowTitle: string) => {
		/* tslint:disable */
		const val = `.formElementLabel:contains("${rowTitle}") + div`;
		return await page.evaluate((toEval: string) => {
			var elem = $(toEval);
			if(elem.length === 0) {
				// TODO: Will this ever be the case? Assuming not...
				return ''
			}

			return elem[0].innerText.trim()
		}, val);
		/* tslint:enable */
	}

	const toCurrency = (text: string) => {
		const amount: string = text.replace(/\s+/, '').replace('R', '').replace(',', '').replace('eB', '')
		const num: number = parseInt(Math.round(parseFloat(amount) * 100) as any, 10)
		return num
	}

	return new DetailedBalanceVehicle({
		balanceDetails: {
			customerName: await getTextForRow('Customer Name'),
			paymentDueDay: parseInt(await getTextForRow('Payment Due Day'), 10),
			contractBalance: toCurrency(await getTextForRow('Contract Balance')),
			advanceArrearsAmount: toCurrency(await getTextForRow('Advance / Arrears Amount')),
			contractPeriod: parseInt(await getTextForRow('Contract Period'), 10),
			ageOfDeal: parseInt(await getTextForRow('Age of Deal'), 10),
			paymentFrequency: await getTextForRow('Payment Frequency'),
			paymentMode: await getTextForRow('Payment Mode')
		},
		paymentDetails: {
			originalContractBalance: toCurrency(await getTextForRow('Original Contract Balance')),
			currentContractBalance: toCurrency(await getTextForRow('Current Contract Balance')),
			originalCapitalBalance: toCurrency(await getTextForRow('Original Capital Balance')),
			currentCapitalBalance: toCurrency(await getTextForRow('Current Capital Balance')),
			originalInterestRate: toCurrency(await getTextForRow('Original Interest Rate')),
			currentInterestRate: toCurrency(await getTextForRow('Current Interest Rate'))
		},
		instalmentDetails: {
			currentInstalmentAmount: toCurrency(await getTextForRow('Current Instalment Amount')),
			dateOfNextInstalment: moment(await getTextForRow('Date of Next Instalment'), 'DD MMM YYYY'),
			previousInstalmentDate: moment(await getTextForRow('Previous Instalment Date'), 'DD MMM YYYY'),
			finalInstalmentDate: moment(await getTextForRow('Final Instalment Date'), 'DD MMM YYYY')
		},
		assetDetails: {
			description: await getTextForRow('Asset Description'),
			yearModel: parseInt(await getTextForRow('Asset Year Model'), 10),
			registrationNumber: await getTextForRow('Asset Registration Number'),
			engineNumber: await getTextForRow('Asset Engine Number'),
			chassisNumber: await getTextForRow('Asset Chassis Number'),
		},
		debitOrderDetails: {
			bankName: await getTextForRow('Bank Name'),
			branchName: await getTextForRow('Branch Name'),
			accountHolder: await getTextForRow('Account Holder'),
			branchCode: await getTextForRow('Branch Code'),
			accountNumber: await getTextForRow('Account Number'),
		}
	})
}
