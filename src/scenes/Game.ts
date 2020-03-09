import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'

import '~/game/Shooter'
import '~/game/BallPool'
// import '~/game/Ball'

const DPR = window.devicePixelRatio

export default class Game extends Phaser.Scene
{
	private shooter?: IShooter

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

		this.physics.world.setBounds(0, 0, width, height)
		this.physics.world.setBoundsCollision(true, true, false, false)

		this.shooter = this.add.shooter(width * 0.5, height + (30 * DPR), '')
		const pool = this.add.ballPool(TextureKeys.Virus)

		this.shooter.setBallPool(pool)
		this.shooter.attachBall()
	}

	update(t, dt)
	{
		if (this.shooter)
		{
			this.shooter.update(dt)
		}
	}
}
