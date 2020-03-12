import Phaser from 'phaser'
import BallColor from './BallColor'

const ALL_COLORS = [
	BallColor.Red,
	BallColor.Blue,
	BallColor.Green,
	BallColor.Yellow
]

declare global
{
	interface IBall extends Phaser.Physics.Arcade.Sprite
	{
		readonly color: BallColor
		readonly radius: number

		setRandomColor(): IBall
		setColor(color: BallColor): IBall
		useCircleCollider(): IBall
		launch(direction: Phaser.Math.Vector2): void
	}
}

export default class Ball extends Phaser.Physics.Arcade.Sprite implements IBall
{
	private _color = BallColor.Red

	get color()
	{
		return this._color
	}

	get radius()
	{
		return this.width * 0.5
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string = '')
	{
		super(scene, x, y, texture, frame)

		this.setRandomColor()
	}

	setRandomColor()
	{
		const r = Phaser.Math.Between(0, ALL_COLORS.length - 1)
		return this.setColor(ALL_COLORS[r])
	}

	setColor(color: BallColor)
	{
		this._color = color
		this.tint = color

		return this
	}

	useCircleCollider()
	{
		const radius = this.width * 0.5
		const usedRadius = radius * 0.6
		const diff = radius - usedRadius
		this.setCircle(usedRadius, diff, diff)

		return this
	}

	launch(direction: Phaser.Math.Vector2, speed = 2500)
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
