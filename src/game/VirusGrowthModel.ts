import { Subject } from 'rxjs'

declare global
{
	interface IGrowthModel
	{
		getNext(count: number): number
		onPopulationChanged()
		update(dt: number)
	}
}

export default class VirusGrowthModel implements IGrowthModel
{
	private accumulatedTime = 0
	private populationCount = 0

	private populationChangedSubject = new Subject<number>()

	constructor(initialPopulation = 0)
	{
		this.populationCount = initialPopulation
	}

	onPopulationChanged()
	{
		return this.populationChangedSubject.asObservable()
	}

	getNext(count: number)
	{
		if (count > this.populationCount)
		{
			const total = this.populationCount
			this.decreatePopulation(total)
			return total
		}

		this.decreatePopulation(count)
		return count
	}

	update(dt: number)
	{
		this.accumulatedTime += dt

		if (this.accumulatedTime >= 1000)
		{
			this.increasePopulation(1)
			this.accumulatedTime = this.accumulatedTime - 1000
		}
	}

	private increasePopulation(amount: number)
	{
		this.populationCount += amount
		this.populationChangedSubject.next(this.populationCount)
	}

	private decreatePopulation(amount: number)
	{
		this.populationCount -= amount
		this.populationChangedSubject.next(this.populationCount)
	}
}
