import { DetailedBalance } from './detailed-balance'
import { Moment } from 'moment'

export interface DetailedBalanceVehicleInitData {
	balanceDetails: {
	customerName: string
	paymentDueDay: number
	contractBalance: number
	advanceArrearsAmount: number
	contractPeriod: number
	ageOfDeal: number
	paymentFrequency: string
	paymentMode: string
  }

  paymentDetails: {
	originalContractBalance: number
	currentContractBalance: number
	originalCapitalBalance: number
	currentCapitalBalance: number
	originalInterestRate: number
	currentInterestRate: number
  }

  instalmentDetails: {
	currentInstalmentAmount: number
	dateOfNextInstalment: Moment
	previousInstalmentDate: Moment
	finalInstalmentDate: Moment
  }

  assetDetails: {
	description: string
	yearModel: number
	registrationNumber: string
	engineNumber: string
	chassisNumber: string
  }

  debitOrderDetails: {
	bankName: string
	branchName: string
	accountHolder: string
	branchCode: string
	accountNumber: string
  }
}

/** Provides access to all data FNB provide for the detailed balance of a vehicle account. */
export class DetailedBalanceVehicle implements DetailedBalance {
  public readonly balanceDetails!: {
	readonly customerName: string;
	readonly paymentDueDay: number;
	readonly contractBalance: number;
	readonly advanceArrearsAmount: number;
	readonly contractPeriod: number;
	readonly ageOfDeal: number;
	readonly paymentFrequency: string;
	readonly paymentMode: string;
  }

  public readonly paymentDetails!: {
	readonly originalContractBalance: number
	readonly currentContractBalance: number
	readonly originalCapitalBalance: number
	readonly currentCapitalBalance: number
	readonly originalInterestRate: number
	readonly currentInterestRate: number
  }

  public readonly instalmentDetails!: {
	readonly currentInstalmentAmount: number
	readonly dateOfNextInstalment: Moment
	readonly previousInstalmentDate: Moment
	readonly finalInstalmentDate: Moment
  }

  public readonly assetDetails!: {
	readonly description: string
	readonly yearModel: number
	readonly registrationNumber: string
	readonly engineNumber: string
	readonly chassisNumber: string
  }

  public readonly debitOrderDetails!: {
	readonly bankName: string
	readonly branchName: string
	readonly accountHolder: string
	readonly branchCode: string
	readonly accountNumber: string
  }

	constructor(init: DetailedBalanceVehicleInitData) {
		this.balanceDetails = init.balanceDetails
		this.paymentDetails = init.paymentDetails
		this.instalmentDetails = init.instalmentDetails
		this.assetDetails = init.assetDetails
		this.debitOrderDetails = init.debitOrderDetails
	}
}
