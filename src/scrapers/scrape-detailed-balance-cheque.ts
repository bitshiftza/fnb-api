import { Page } from 'puppeteer'
import { DetailedBalanceCheque } from '../models'
import { scrapeChequeOrSavings } from './scrape-detailed-balance-util'

export const scrapeCheque = async (page: Page): Promise<DetailedBalanceCheque> => {
	return new DetailedBalanceCheque(await scrapeChequeOrSavings(page))
}