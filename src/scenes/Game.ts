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
			.moveDown(5)

		this.physics.add.collider(ballPool, staticBallPool, this.handleBallHitGrid, undefined, this)
	}

	private handleBallHitGrid(ball: Phaser.GameObjects.GameObject, gridBall: Phaser.GameObjects.GameObject)
	{
		const b = ball as IBall
		const bx = b.x
		const by = b.y
		const color = b.color

		const gb = gridBall as IBall
		const gx = gb.x
		const gy = gb.y

		// determine direction ball traveling when it hit the grid
		// then negate it to have opposite direction
		const direction = new Phaser.Math.Vector2(gx - bx, gy - by)
			.normalize()
			.negate()

		// get where the ball would be at contact with grid
		const x = gx + (direction.x * gb.width)
		const y = gy + (direction.y * gb.width)

		this.shooter?.returnBall(b)
		this.shooter?.attachBall()

		this.grid?.attachBall(x, y, color, gx, gy)

		// TODO: add to ball grid at cell nearest x, y
		// TODO: evaluate matches
	}

	update(t, dt)
	{
		if (this.shooter)
		{
			this.shooter.update(dt)
		}
	}
}
