import IShotGuide from '~/types/IShotGuide'

export default class NoGuide implements IShotGuide
{
	private static sharedInstance = new NoGuide()

	static instance()
	{
		return this.sharedInstance
	}

	showFrom(x: number, y: number, direction: Phaser.Math.Vector2, radius: number)
	{
	}

	hide()
	{
	}
}
