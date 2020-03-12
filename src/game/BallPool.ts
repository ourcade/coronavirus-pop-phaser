import Phaser from 'phaser'
import Ball from './Ball'

declare global
{
	interface IBallPool extends Phaser.Physics.Arcade.Group
	{
		spawn(x: number, y: number): IBall
		despawn(ball: IBall)
	}
}

export default class BallPool extends Phaser.Physics.Arcade.Group implements IBallPool
{
	private texture: string

	constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, texture: string, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {})
	{
		const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {
			classType: Ball,
			maxSize: -1,
			key: texture,
			frame: 0,
			active: false,
			visible: false,
			frameQuantity: 4
		}

		super(world, scene, Object.assign(defaults, config))

		this.texture = texture
	}

	spawn(x: number, y: number)
	{
		const spawnExisting = this.countActive(false) > 0

		const ball: IBall = this.get(x, y, this.texture)

		if (!ball)
		{
			return ball
		}

		ball.useCircleCollider()

		ball.emit('on-spawned')

		if (spawnExisting)
		{
			ball.setVisible(true)
			ball.setActive(true)
			this.world.add(ball.body)
		}

		ball.setRandomColor()

		return ball
	}

	despawn(ball: IBall)
	{
		this.killAndHide(ball)

		this.world.remove(ball.body)

		ball.body.reset(0, 0)
	}
}

Phaser.GameObjects.GameObjectFactory.register('ballPool', function (texture: string, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {}) {
	// @ts-ignore
	const pool = new BallPool(this.scene.physics.world, this.scene, texture, config)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})