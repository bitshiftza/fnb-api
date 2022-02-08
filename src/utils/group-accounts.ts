import { Account, AccountCheque, AccountCredit, AccountSavings, AccountVehicle, AccountType } from '../models'

export interface GroupedAccounts {
  chequeAccounts: AccountCheque[]
  creditAccounts: AccountCredit[]
  savingsAccounts: AccountSavings[]
  vehicleAccounts: AccountVehicle[]
}

export async function groupAccounts(accounts: Account[]) {
  const grouped: GroupedAccounts = {
	chequeAccounts: [],
	creditAccounts: [],
	savingsAccounts: [],
	vehicleAccounts: []
  }

	for(const account of accounts) {
	const accountType = await account.type()
	
	switch (accountType) {
		case AccountType.Cheque:
		grouped.chequeAccounts.push(account as AccountCheque)
		break
		case AccountType.Credit:
		grouped.creditAccounts.push(account as AccountCredit)
		break
		case AccountType.Savings:
		case AccountType.Easy:
		grouped.savingsAccounts.push(account as AccountSavings)
		break
		case AccountType.Vehicle:
		grouped.vehicleAccounts.push(account as AccountVehicle)
		break
	}
  }
  
  return grouped
}