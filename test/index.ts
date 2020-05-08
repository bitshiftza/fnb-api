require('dotenv').config()
import { Api as FnbApi } from '../src'

(async () => {
	const api = new FnbApi({
		username: process.env.FNB_USER as string,
		password: process.env.FNB_PASS as string
	})

	const accounts = await api.accounts.get()
	console.log(accounts)
	console.log('---------------------')

	const detailedBalance = await accounts[0].detailedBalance()
	console.log(detailedBalance)
	console.log('---------------------')

	const transactions = await accounts[0].transactions()
	console.log(transactions[0])

	await api.close()
})()
