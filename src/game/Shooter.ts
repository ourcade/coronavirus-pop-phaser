import Phaser from 'phaser'

import { OrangeColor } from '~/consts/Colors'

const DPR = window.devicePixelRatio
const RADIUS = 100 * DPR

declare global
{
	interface IShooter extends Phaser.GameObjects.Container
	{
		setBallPool(pool: IBallPool)
		attachBall(ball?: IBall)
		update(dt: number)
	}
}

export default class Shooter extends Phaser.GameObjects.Container implements IShooter
{
	private ball?: IBall
	private ballPool?: IBallPool

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y)

		const base = scene.add.circle(0, 0, RADIUS, OrangeColor, 1)

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

	setBallPool(pool: IBallPool)
	{
		this.ballPool = pool
	}

	attachBall(ball?: IBall)
	{
		if (!this.ballPool)
		{
			return
		}

		if (!ball)
		{
			ball = this.ballPool.spawn(0, 0)
		}

		this.ball = ball
		this.ball.disableBody()

		// 5 is gap
		this.ball.x = this.x
		this.ball.y = this.y - RADIUS - (this.ball.height * 0.5) - (5 * DPR)
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

		// const dx = (pointer.isDown ? pointer.downX : pointer.x) - this.x
		// const dy = (pointer.isDown ? pointer.downY : pointer.y) - this.y

		const dx = pointer.x - this.x
		const dy = pointer.y - this.y

		const vec = new Phaser.Math.Vector2(dx, dy)
		vec.normalize()

		const ballRadius = this.ball.height * 0.5
		const gap = 5 * DPR

		this.ball.x = this.x + (vec.x * (RADIUS + ballRadius + gap))
		this.ball.y = this.y + (vec.y * (RADIUS + ballRadius + gap))
	}

	private handlePointerDown()
	{
		console.dir('down')
	}

	private handlePointerUp()
	{
		console.dir('up')
		// if (!this.ball)
		// {
		// 	return
		// }
		
		// const pointer = this.scene.input.activePointer
		// const dx = pointer.x - this.x
		// const dy = pointer.y - this.y

		// const x = this.ball.x
		// const y = this.ball.y

		// const ball = this.scene.add.ball(x, y, 'virus')

		// const vec = new Phaser.Math.Vector2(dx, dy)
		// vec.normalize()
		// ball.setVelocity(vec.x * 100, vec.y * 100)

		// this.ball.destroy(true)

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

		this.ball = undefined
	}
}

Phaser.GameObjects.GameObjectFactory.register('shooter', function (x: number, y: number, key: string) {
	// @ts-ignore
	return this.displayList.add(new Shooter(this.scene, x, y, key))
})
