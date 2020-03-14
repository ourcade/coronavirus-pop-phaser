import BallGrid from './BallGrid'
import { SubscriptionLike } from 'rxjs'

enum DescentState
{
	Descending,
	Reversing,
	Holding
}

export default class DescentController
{
	private scene: Phaser.Scene
	private ballGrid: BallGrid
	private growthModel: IGrowthModel

	private speed: number

	private state = DescentState.Descending

	private subscriptions: SubscriptionLike[] = []

	get yPosition()
	{
		return this.ballGrid.bottom
	}

	constructor(scene: Phaser.Scene, grid: BallGrid, growthModel: IGrowthModel, speed = 0.3)
	{
		this.scene = scene
		this.ballGrid = grid
		this.growthModel = growthModel

		this.speed = speed

		const bds = this.ballGrid.onBallsDestroyed().subscribe(count => {
			this.handleBallsDestroyed(count)
		})

		const pcs = this.growthModel.onPopulationChanged().subscribe(count => {
			this.handleVirusPopulationChanged(count)
		})

		this.subscriptions = [
			bds,
			pcs
		]
	}

	destroy()
	{
		this.subscriptions.forEach(sub => sub.unsubscribe())
		this.subscriptions.length = 0
	}

	setStartingDescent(dy: number)
	{
		this.ballGrid.moveBy(dy)
	}

	update(dt: number)
	{
		switch (this.state)
		{
			case DescentState.Descending:
			{
				this.ballGrid.moveBy(this.speed)

				const dy = this.ballGrid.height - this.ballGrid.bottom
				if (dy < this.ballGrid.ballInterval * 5)
				{
					this.ballGrid.spawnRow()
				}
				break
			}

			case DescentState.Reversing:
				break

			case DescentState.Holding:
				// potential for future use like powerups
				break
		}
	}

	private handleBallsDestroyed(count: number)
	{
		this.state = DescentState.Reversing

		let dy = count
		if (count > 10)
		{
			dy *= Math.min(count / 10, 3)
		}

		const grid = this.ballGrid
		const bottom = grid.bottom

		this.scene.tweens.addCounter({
			from: bottom,
			to: bottom - dy,
			duration: 300,
			ease: 'Back.easeOut',
			onUpdate: function (tween: Phaser.Tweens.Tween) {
				const v = tween.getValue()
				const diff = v - grid.bottom
				grid.moveBy(diff)
			},
			onUpdateScope: this,
			onComplete: function () {
				// @ts-ignore
				this.state = DescentState.Descending
			},
			onCompleteScope: this
		})
	}

	private handleVirusPopulationChanged(count: number)
	{
		const s = Math.max(0.3, Math.log(count * .0004))
		this.speed = s > 1.1 ? 1.1 : s
	}
}
