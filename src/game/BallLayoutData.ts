export const Red = 'r'
export const Blu = 'b'
export const Gre = 'g'
export const Yel = 'y'

const AllColors = [
	Red, Blu, Gre, Yel
]

export default class BallLayoutData
{
	// TODO: select from a bunch of different kinds
	getRandomData()
	{
		// return [
		// 	[Red, 	Red, 	Red, 	Red, 	Red, 	Red],
		// 		[Blu,	Blu, 	Blu, 	Blu, 	Blu, 	Blu],
		// 	[Gre,	Gre,	Gre,	Gre,	Gre,	Gre],
		// 		[Yel,	Yel,	Yel,	Yel,	Yel,	Yel],
		// 	[Red, 	Blu, 	Gre, 	Yel, 	Red, 	Blu]
		// ].reverse()
		return this.generateRandom().reverse()
	}

	private generateRandom()
	{
		const ret: string[][] = []
		for (let i = 0; i < 5; ++i)
		{
			ret[i] = []
			for (let j = 0; j < 6; ++j)
			{
				ret[i][j] = this.getRandomColor()
			}
		}
		return ret
	}

	private getRandomColor()
	{
		const size = AllColors.length
		const r = Math.floor(Math.random() * size)
		return AllColors[r]
	}
}
