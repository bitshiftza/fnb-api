# FNB API

Pull account balances and transactions from FNB online banking.

## Support
### Basic Balances
Basic balances are supported for cheque, credit, savings, eBucks and vehicle accounts.
### Detailed Balances
Basic balances are supported for cheque, credit, savings and vehicle accounts.
### Transactions
Currently only cheque, credit and savings account transactions are supported.
> *Note*: Only the first page (150 entries) of successful transactions are scraped.

## Security

When using this, it's recommended to create a read-only secondary user on FNBs online banking site. See [this](https://conversations.22seven.com/hc/en-us/articles/360016980233-Setting-up-an-FNB-view-only-profile) guide for instructions.

## Installation

```bash
npm i -S fnb-api
```

## Usage

```js
const FnbApi = require('fnb-api').Api;

(async () => {
  const api = new FnbApi({
    username: 'xxx',
    password: 'xxx'
  });

  const accounts = await api.accounts.get();
  console.log(accounts);

  const detailedBalance = await accounts[0].detailedBalance();
  console.log(detailedBalance);

  const transactions = await accounts[0].transactions();
  console.log(transactions[0]);

  await api.close();
})();

```

```js
// All monetary and percent values are multiplied by 100
// ie R100,23 will be represented as 10023 and 9.75% will be represented as 975
[ Account {
    name: 'FNB XXX Cheque Account',
    accountNumber: 'XXX',
    balance: 1000000,
    availableBalance: 1000000 },
  Account {
    name: 'FNB XXX Credit Card',
    accountNumber: 'XXX',
    balance: 1000000,
    availableBalance: 1000000 },
  Account {
    name: 'Savings Account',
    accountNumber: 'XXX',
    balance: 1000000,
    availableBalance: 1000000 } ]
	
DetailedBalanceCheque {
  balance: 1000000,
  availableBalance: 1000000,
  reservedFunds: 0,
  pendingCredits: 0,
  chargesAccrued: 0,
  minimumBalance: 0,
  pendingDebits: 0,
  outstandingDebitCardAuthorization: -58156 }

TransactionCheque {
  date: moment("2018-12-08T00:00:00.000"),
  description: 'CAPE TOWN SERVICE C 409283*1927 06 DEC',
  amount: -20264,
  status: 'Successful',
  reference: '7479059234715535760161',
  serviceFee: 0,
  balance: 1000000 }
```


## Options

```js
{
  /** The username to log in with. */
  username: string;

  /** The password to log in with. */
  password: string;

  /** Should scraped data be cached. Default = true */
  cache?: boolean;

  /** If scraped data should be cached, for how long? Default = 60 */
  cacheTimeInSeconds?: number;

  /** Puppeteer options */
  puppeteerOptions?: PuppeteerLaunchOptions;
}
```

## License

See [LICENSE](LICENSE)
