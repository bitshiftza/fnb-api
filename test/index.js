require('dotenv').config();
const FnbApi = require('../dist/src/index.js').Api;

(async () => {
	const api = new FnbApi({
		username: process.env.FNB_USER,
		password: process.env.FNB_PASS
	});

	const accounts = await api.accounts.get();
	console.log(accounts);
	console.log('---------------------');

	const detailedBalance = await accounts[0].detailedBalance();
	console.log(detailedBalance);
	console.log('---------------------');

	const transactions = await accounts[0].transactions();
	console.log(transactions[0]);

	await api.close();
})();
