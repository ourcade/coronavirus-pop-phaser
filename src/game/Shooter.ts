import Phaser from 'phaser'

import IShotGuide from '~/types/IShotGuide'
import { Subject, Observable } from 'rxjs'
import TextureKeys from '~/consts/TextureKeys'

const DPR = window.devicePixelRatio
const RADIUS = 100 * DPR

const HALF_PI = Math.PI * 0.5
const GAP = 5 * DPR

declare global
{
	interface IShooter extends Phaser.GameObjects.Container
	{
		readonly radius: number

		onShoot(): Observable<IBall>

		setBallPool(pool: IBallPool)
		setGuide(guide: IShotGuide)

		attachBall(ball?: IBall)
		returnBall(ball: IBall)
		update(dt: number)
	}
}

export default class Shooter extends Phaser.GameObjects.Container implements IShooter
{
	private ball?: IBall
	private ballPool?: IBallPool
	private shotGuide?: IShotGuide

	private shootSubject = new Subject<IBall>()

	get radius()
	{
		return RADIUS
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y)

		const base = scene.add.image(0, 0, TextureKeys.Shooter)

		this.add(base)

		scene.input.addListener(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this)
		scene.input.addListener(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this)
	}

	preDestroy()
	{
		this.scene.input.removeListener(Phaser.Input.Events.POINTER_DOWN, this.handlePointerDown, this)
		this.scene.input.removeListener(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this)

		super.preDestroy()
	}

	onShoot()
	{
		return this.shootSubject.asObservable()
	}

	setBallPool(pool: IBallPool)
	{
		this.ballPool = pool
	}

	setGuide(guide: IShotGuide)
	{
		this.shotGuide = guide
	}

	attachBall(ball?: IBall)
	{
		if (!this.ballPool)
		{
			return
		}

		if (!ball && this.ball)
		{
			return
		}

		if (!ball)
		{
			ball = this.ballPool.spawn(0, 0)
		}

		this.ball = ball
		this.ball.disableBody()

		const vec = new Phaser.Math.Vector2(0, 0)
		vec.setToPolar(this.rotation + HALF_PI)

		const ballRadius = this.ball.radius

		this.ball.x = this.x - (vec.x * (RADIUS + ballRadius + GAP))
		this.ball.y = this.y - (vec.y * (RADIUS + ballRadius + GAP))

		this.ball.scale = 0

		this.scene.add.tween({
			targets: this.ball,
			scale: 1,
			ease: 'Bounce.easeOut',
			duration: 300
		})
	}

	returnBall(ball: IBall)
	{
		this.ballPool?.despawn(ball)
	}

	update(dt: number)
	{
		if (!this.ball)
		{
			return
		}

		const pointer = this.scene.input.activePointer

		if (!pointer.leftButtonDown())
		{
			return
		}

		const dx = pointer.x - this.x
		const dy = pointer.y - this.y

		const vec = new Phaser.Math.Vector2(dx, dy)
		vec.normalize()

		const rotation = vec.angle()
		this.rotation = rotation + HALF_PI

		const ballRadius = this.ball.radius
		const physicsRadius = this.ball.physicsRadius

		this.ball.x = this.x + (vec.x * (RADIUS + ballRadius + GAP))
		this.ball.y = this.y + (vec.y * (RADIUS + ballRadius + GAP))

		this.shotGuide?.showFrom(this.ball.x, this.ball.y, vec, physicsRadius, this.ball.color)
	}

	private handlePointerDown()
	{
	}

	private handlePointerUp()
	{
		if (!this.ball)
		{
			return
		}

		const pointer = this.scene.input.activePointer
		const dx = pointer.x - this.x
		const dy = pointer.y - this.y

		const vec = new Phaser.Math.Vector2(dx, dy)
		vec.normalize()

		this.ball.launch(vec)

		this.shootSubject.next(this.ball)

		this.ball = undefined

		this.shotGuide?.hide()
	}
}

Phaser.GameObjects.GameObjectFactory.register('shooter', function (x: number, y: number, key: string) {
	// @ts-ignore
	return this.displayList.add(new Shooter(this.scene, x, y, key))
})
