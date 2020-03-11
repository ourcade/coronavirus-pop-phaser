import Phaser from 'phaser'
import Ball from './Ball'

declare global
{
	interface IStaticBallPool extends Phaser.Physics.Arcade.StaticGroup
	{
		spawn(x: number, y: number): IBall
		despawn(ball: IBall)
	}
}

export default class StaticBallPool extends Phaser.Physics.Arcade.StaticGroup implements IStaticBallPool
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
			frameQuantity: 30
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

			ball.setRandomColor()
		}

		const body = ball.body as Phaser.Physics.Arcade.StaticBody
		body.updateFromGameObject()

		return ball
	}

	despawn(ball: IBall)
	{
		this.killAndHide(ball)

		this.world.remove(ball.body)

		ball.alpha = 1
		ball.body.reset(0, 0)
	}
}

Phaser.GameObjects.GameObjectFactory.register('staticBallPool', function (texture: string, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {}) {
	// @ts-ignore
	const pool = new StaticBallPool(this.scene.physics.world, this.scene, texture, config)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})