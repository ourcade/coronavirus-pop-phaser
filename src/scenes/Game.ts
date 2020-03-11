import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'

import '~/game/Shooter'
import '~/game/BallPool'
import '~/game/StaticBallPool'
import BallGrid from '~/game/BallGrid'
import BallLayoutData from '~/game/BallLayoutData'

const DPR = window.devicePixelRatio

export default class Game extends Phaser.Scene
{
	private shooter?: IShooter
	private grid?: BallGrid

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

		this.physics.world.setBounds(0, 0, width, height)
		this.physics.world.setBoundsCollision(true, true, false, false)

		this.shooter = this.add.shooter(width * 0.5, height + (30 * DPR), '')

		const ballPool = this.add.ballPool(TextureKeys.Virus)
		this.shooter.setBallPool(ballPool)
		this.shooter.attachBall()

		const staticBallPool = this.add.staticBallPool(TextureKeys.Virus)

		this.grid = new BallGrid(this, staticBallPool)
		this.grid.setLayoutData(new BallLayoutData())
			.generate()
			.moveDown(4)

		this.physics.add.collider(ballPool, staticBallPool, this.handleBallHitGrid, this.processBallHitGrid, this)
	}

	private processBallHitGrid(ball: Phaser.GameObjects.GameObject, gridBall: Phaser.GameObjects.GameObject)
	{
		// only accept collision if distance is close enough
		// gives a better feel for tight shots
		const b = ball as IBall
		const gb = gridBall as IBall

		const distanceSq = Phaser.Math.Distance.Squared(b.x, b.y, gb.x, gb.y)
		const minDistance = b.width * 0.9
		const mdSq = minDistance * minDistance

		return distanceSq <= mdSq
	}

	private handleBallHitGrid(ball: Phaser.GameObjects.GameObject, gridBall: Phaser.GameObjects.GameObject)
	{
		const b = ball as IBall
		const bx = b.x
		const by = b.y
		const color = b.color

		const vx = b.body.deltaX()
		const vy = b.body.deltaY()

		const gb = gridBall as IBall
		const gx = gb.x
		const gy = gb.y

		// determine direction from ball to grid
		// then negate it to have opposite direction
		const directionToGrid = new Phaser.Math.Vector2(gx - bx, gy - by)
			.normalize()
			.negate()

		// get where the ball would be at contact with grid
		const x = gx + (directionToGrid.x * gb.width)
		const y = gy + (directionToGrid.y * gb.width)

		this.shooter?.returnBall(b)
		this.shooter?.attachBall()

		this.grid?.attachBall(x, y, color, gb, vx, vy)
	}

	update(t, dt)
	{
		if (this.shooter)
		{
			this.shooter.update(dt)
		}
	}
}
