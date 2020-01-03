import { AccountType } from '../models/account-type';

export const getAccountType = (text: string) => {
	if (text.indexOf('Cheque') !== -1 || text.indexOf('Business Account') !== -1 || text.indexOf('Fusion Private') !== -1) {
		return AccountType.Cheque;
	}

	if (text.indexOf('Credit') !== -1) {
		return AccountType.Credit;
	}

	if (text.indexOf('Savings') !== -1) {
		return AccountType.Savings;
	}

	return AccountType.Other;
}
