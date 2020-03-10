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
		this.shooter?.returnBall(ball as IBall)
		this.shooter?.attachBall()
		console.dir(gridBall)
	}

	update(t, dt)
	{
		if (this.shooter)
		{
			this.shooter.update(dt)
		}
	}
}
