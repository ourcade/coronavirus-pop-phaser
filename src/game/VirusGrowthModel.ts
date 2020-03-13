import { Subject, Observable } from 'rxjs'

declare global
{
	interface IGrowthModel
	{
		getNext(count: number): number
		onPopulationChanged(): Observable<number>
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
		if (this.populationCount <= 0)
		{
			return
		}

		this.accumulatedTime += dt

		const rate = this.getGrowthRate()

		if (this.accumulatedTime < rate)
		{
			return
		}

		// increase by 10% of population
		const increase = this.populationCount * 0.1

		this.increasePopulation(increase)
		
		this.accumulatedTime = this.accumulatedTime - rate
	}

	private getGrowthRate()
	{
		if (this.populationCount < 1000)
		{
			return 1000
		}

		if (this.populationCount < 5000)
		{
			return 2000
		}

		if (this.populationCount < 10000)
		{
			return 3000
		}

		if (this.populationCount < 50000)
		{
			return 3500
		}

		if (this.populationCount < 100000)
		{
			return 5000
		}

		return 5500
	}

	private increasePopulation(amount: number)
	{
		if (this.populationCount + amount >= Number.MAX_SAFE_INTEGER)
		{
			return
		}

		this.populationCount += amount
		this.populationChangedSubject.next(this.populationCount)
	}

	private decreatePopulation(amount: number)
	{
		if (this.populationCount - amount < 0)
		{
			amount = this.populationCount
		}

		this.populationCount -= amount
		this.populationChangedSubject.next(this.populationCount)
	}
}
