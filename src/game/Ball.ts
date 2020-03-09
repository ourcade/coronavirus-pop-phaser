import Phaser from 'phaser'

declare global
{
	interface IBall extends Phaser.Physics.Arcade.Sprite
	{
		launch(direction: Phaser.Math.Vector2): void
	}
}

export default class Ball extends Phaser.Physics.Arcade.Sprite implements IBall
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string = '')
	{
		super(scene, x, y, texture, frame)
	}

	launch(direction: Phaser.Math.Vector2, speed = 900)
	{
		this.setCollideWorldBounds(true, 1, 1)

		this.body.x = this.x
		this.body.y = this.y

		this.body.enable = true

		this.setVelocity(direction.x * speed, direction.y * speed)
	}
}

Phaser.GameObjects.GameObjectFactory.register('ball', function (x: number, y: number, texture: string, frame: string = '') {
	// @ts-ignore
	var ball = new Ball(this.scene, x, y, texture, frame);

	// @ts-ignore
	this.displayList.add(ball);
	// @ts-ignore
	this.updateList.add(ball);
	// @ts-ignore
	this.scene.physics.world.enableBody(ball, Phaser.Physics.Arcade.DYNAMIC_BODY)

	ball.setCircle(ball.width * 0.5)

    return ball;
})
