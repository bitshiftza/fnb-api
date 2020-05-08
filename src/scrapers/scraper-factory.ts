import { Scraper } from './scraper'
import { ApiOptions } from '../api/fnb-api'

let _instance: Scraper

export function getScraper(options?: ApiOptions) {
	if (!_instance) {
		_instance = new Scraper(options as ApiOptions)
	}

	return _instance
}
