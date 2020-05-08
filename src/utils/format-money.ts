export function formatMoney(amount: number | string, mustDivide = true, currency = '', decimalCount = 2, decimal = '.', thousands = ',') {
	if(mustDivide) {
		if(typeof amount === 'number') {
			amount /= 100
		} else {
			amount = parseInt(amount, 10) / 100
		}
	}

	try {
		decimalCount = Math.abs(decimalCount)
		decimalCount = isNaN(decimalCount) ? 2 : decimalCount

		const negativeSign = amount < 0 ? '-' : ''

		const i = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)), 10).toString()
		const j = i.length > 3 ? i.length % 3 : 0

		return (
			negativeSign +
			currency +
			(j ? i.substr(0, j) + thousands : '') +
			i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
			(decimalCount
				? decimal +
				  Math.abs(parseInt(amount, 10) - parseInt(i, 10))
						.toFixed(decimalCount)
						.slice(2)
				: '')
		)
	} catch (e) {
		return amount
	}
}