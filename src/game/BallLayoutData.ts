export const Red = 'r'
export const Blu = 'b'
export const Gre = 'g'
export const Yel = 'y'

export default class BallLayoutData
{
	// TODO: select from a bunch of different kinds
	getRandomData()
	{
		return [
			[Red, 	Red, 	Red, 	Red, 	Red, 	Red],
				[Blu,	Blu, 	Blu, 	Blu, 	Blu, 	Blu],
			[Gre,	Gre,	Gre,	Gre,	Gre,	Gre],
				[Yel,	Yel,	Yel,	Yel,	Yel,	Yel],
			[Red, 	Blu, 	Gre, 	Yel, 	Red, 	Blu]
		].reverse()
	}
}
