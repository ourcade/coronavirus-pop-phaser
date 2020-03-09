import Phaser from 'phaser'

import TextureKeys from '~/consts/TextureKeys'

import '~/game/Shooter'
import '~/game/Ball'

export default class Game extends Phaser.Scene
{
	private shooter?: IShooter

	create()
	{
		const width = this.scale.width
		const height = this.scale.height

		this.physics.world.setBounds(0, 0, width, height)
		this.physics.world.setBoundsCollision(true, true, false, false)

		this.shooter = this.add.shooter(width * 0.5, height, '')

		this.shooter.attachBall(this.add.ball(0, 0, TextureKeys.Virus))
	}

	update(t, dt)
	{
		if (this.shooter)
		{
			this.shooter.update(dt)
		}
	}
}
