require('dotenv').config()
import {
	Api,
	Account,
	groupAccounts,
	DetailedBalance,
	AccountCheque,
	DetailedBalanceCheque,
	AccountCredit,
	DetailedBalanceCredit,
	DetailedBalanceSavings,
	AccountSavings,
	AccountVehicle,
	DetailedBalanceVehicle,
	formatMoney,
} from '../src'

async function getTotal<A extends Account, B extends DetailedBalance>(accounts: A[], selector: (t: B) => number) {
	return (
		await Promise.all(
			accounts.map(async (a) => {
				const detailedBalance = await a.detailedBalance()
				return selector(detailedBalance as B)
			})
		)
	).reduce((a, b) => a + b, 0)
}

;(async () => {
	const api = new Api({
		username: process.env.FNB_USER as string,
		password: process.env.FNB_PASS as string,
	})

	const accounts = await api.accounts.get()
	const groupedAccounts = await groupAccounts(accounts)

	const chequeTotal = await getTotal<AccountCheque, DetailedBalanceCheque>(groupedAccounts.chequeAccounts, (b) => b.balance)
	const creditTotal = await getTotal<AccountCredit, DetailedBalanceCredit>(groupedAccounts.creditAccounts, (b) => b.currentBalance)
	const savingsTotal = await getTotal<AccountSavings, DetailedBalanceSavings>(groupedAccounts.savingsAccounts, (b) => b.balance)
	const vehicleTotal = await getTotal<AccountVehicle, DetailedBalanceVehicle>(groupedAccounts.vehicleAccounts, (b) => b.paymentDetails.currentCapitalBalance)

	const totals = {
		cheque: formatMoney(chequeTotal),
		credit: formatMoney(creditTotal),
		savings: formatMoney(savingsTotal),
		vehicle: formatMoney(vehicleTotal),
	}

	console.table(totals)
	console.log('Total', formatMoney(chequeTotal + creditTotal + savingsTotal + vehicleTotal))

	await api.close()
})()
