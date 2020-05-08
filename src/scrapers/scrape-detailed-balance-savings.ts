import { Page } from 'puppeteer'
import { DetailedBalanceSavings } from '../models'
import { scrapeChequeOrSavings } from './scrape-detailed-balance-util'

export const scrapeSavings = async (page: Page): Promise<DetailedBalanceSavings> => {
	return new DetailedBalanceSavings(await scrapeChequeOrSavings(page))
}