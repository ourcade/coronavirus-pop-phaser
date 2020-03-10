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

	private size: Phaser.Structs.Size

	constructor(scene: Phaser.Scene, pool: IStaticBallPool)
	{
		this.scene = scene
		this.pool = pool

		const sample = this.pool.spawn(0, 0)
		this.size = new Phaser.Structs.Size(sample.width, sample.height)
		this.pool.despawn(sample)
	}

	setLayoutData(layout: BallLayoutData)
	{
		this.layoutData = layout

		return this
	}

	/**
	 * 
	 * @param x x position at collision with grid
	 * @param y y position at collision with grid
	 * @param color color ball
	 * @param cellX x position of cell collided with
	 * @param cellY y position of cell collided with
	 */
	attachBall(x: number, y: number, color: BallColor, cellX: number, cellY: number)
	{
		console.log(`hit ${x}, ${y}`)
		const width = this.size.width
		const radius = width * 0.5

		const dx = x - cellX

		let tx = dx <= 0 ? cellX - radius : cellX + radius

		// offset by vertical interval
		const interval = width * 0.8
		const dy = y - cellY
		let ty = dy >= 0 ? cellY + interval : cellY - interval

		// place on same row
		if (Math.abs(dy) <= radius)
		{
			ty = cellY
			// adjust x to be next to
			tx = dx <= 0 ? tx - radius : tx + radius
		}
		
		if (dy < 0)
		{
			console.log('above')
		}

		console.log(`place ${tx}, ${ty}`)

		const newBall = this.pool.spawn(x, y)
			.setColor(color)
		
		https://github.com/photonstorm/phaser/blob/v3.22.0/src/math/easing/EaseMap.js
		this.scene.tweens.add({
			targets: newBall,
			x: tx,
			y: ty,
			duration: 70,
			ease: 'Back.easeOut',
			onComplete: () => {
				const body = newBall.body as Phaser.Physics.Arcade.StaticBody
				body.updateFromGameObject()
			}
		})
		
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

		const width = this.size.width
		const radius = width * 0.5
		const verticalInterval = width * 0.8

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
