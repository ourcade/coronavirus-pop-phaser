import Phaser from 'phaser'

import BallLayoutData, {
	Red, Gre, Blu, Yel
} from './BallLayoutData'

import BallColor from './BallColor'

export default class BallGrid
{
	private scene: Phaser.Scene
	private pool: IStaticBallPool

	private layoutData?: BallLayoutData

	constructor(scene: Phaser.Scene, pool: IStaticBallPool)
	{
		this.scene = scene
		this.pool = pool
	}

	setLayoutData(layout: BallLayoutData)
	{
		this.layoutData = layout

		return this
	}

	generate()
	{
		if (!this.layoutData)
		{
			return this
		}

		const data = this.layoutData.getRandomData()
		const middle = this.scene.scale.width * 0.5
		let y = 0
		let x = middle

		const sample = this.pool.spawn(0, 0)
		const width = sample.width

		const radius = width * 0.5
		const verticalInterval = width * 0.8
		this.pool.despawn(sample)

		data.forEach((row, idx) => {
			const count = row.length
			
			if (count <= 0)
			{
				y -= verticalInterval
				return
			}

			const halfCount = count * 0.5
			x = middle - (halfCount * width) + (radius * 0.5)

			if (idx % 2 === 0)
			{
				x += radius
			}
			else
			{

			}

			row.forEach(colorCode => {
				switch (colorCode)
				{
					default:
					case Red:
					{
						const b = this.pool.spawn(x, y)
						b.setColor(BallColor.Red)
						break
					}

					case Blu:
					{
						const b = this.pool.spawn(x, y)
						b.setColor(BallColor.Blue)
						break
					}

					case Gre:
					{
						const b = this.pool.spawn(x, y)
						b.setColor(BallColor.Green)
						break
					}

					case Yel:
					{
						const b = this.pool.spawn(x, y)
						b.setColor(BallColor.Yellow)
						break
					}
				}

				x += width
			})

			y -= verticalInterval
		})

		return this
	}

	moveDown(rows: number = 1)
	{
		if (this.pool.countActive() === 0)
		{
			return this
		}

		const balls = this.pool.getChildren()
		const count = balls.length
		for (let i = 0; i < count; ++i)
		{
			const b = balls[i] as IBall
			b.y += (b.height * rows)

			const body = b.body as Phaser.Physics.Arcade.StaticBody
			body.updateFromGameObject()
		}

		return this
	}
}
