import Phaser from 'phaser'

import { DarkColor } from '~/consts/Colors'
import { Observable, SubscriptionLike } from 'rxjs'

const DPR = window.devicePixelRatio

declare global
{
	interface GameUiInitData
	{
		ballsDestroyed?: Observable<number>,
		ballsAdded?: Observable<number>,
		infectionsChanged: Observable<number>
	}
}

export default class GameUI extends Phaser.Scene
{
	private score = 0
	private scoreText?: Phaser.GameObjects.Text

	private infections = 0
	private infectionsText?: Phaser.GameObjects.Text

	private subscriptions: SubscriptionLike[] = []

	init()
	{
		this.score = 0
		this.infections = 0
	}

	create(data?: GameUiInitData)
	{
		const width = this.scale.width
		this.add.rectangle(width * 0.5, 0, width, 100 * DPR, DarkColor, 0.7)

		const offsetX = 10 * DPR
		const offsetY = 10 * DPR

		const startingText = this.createScoreText(this.score)
		this.scoreText = this.add.text(offsetX, offsetY, startingText, {
			fontSize: 22 * DPR,
			fontFamily: 'Righteous'
		})

		const rx = width - offsetX
		const infectionsText = this.createInfectionsText(0)
		this.infectionsText = this.add.text(rx, offsetY, infectionsText, {
			fontSize: 22 * DPR,
			fontFamily: 'Righteous'
		})
		.setOrigin(1, 0)

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.subscriptions.forEach(sub => sub.unsubscribe())
			this.subscriptions.length = 0
		})

		this.initWithData(data)
	}

	private initWithData(data?: GameUiInitData)
	{
		if (!data)
		{
			return
		}

		const destroyedSub = data.ballsDestroyed?.subscribe(count => {
			const multiplier = Math.max(1, count / 10)
			this.addToScore(Math.floor(count * multiplier))

			this.infections -= count
			this.updateInfections(this.infections)
		})

		const addedSub = data.ballsAdded?.subscribe(count => {
			this.infections += count
			this.updateInfections(this.infections)
		})

		const infectionsSub = data.infectionsChanged?.subscribe(count => {
			this.infections = count
			this.updateInfections(this.infections)
		})

		const subs = [destroyedSub, addedSub, infectionsSub]
		subs.filter(sub => sub)
			.forEach(sub => this.subscriptions.push(sub!))
	}

	private createScoreText(score: number)
	{
		return `Score: ${score.toLocaleString()}`
	}

	private addToScore(points: number)
	{
		this.score += points
		this.updateScore(this.score)
	}

	private updateScore(score: number)
	{
		if (!this.scoreText)
		{
			return
		}
		this.scoreText.text = this.createScoreText(this.score)
	}

	private createInfectionsText(infections: number)
	{
		return `${infections.toLocaleString()} Infections`
	}

	private updateInfections(count: number)
	{
		if (!this.infectionsText)
		{
			return
		}

		this.infectionsText.text = this.createInfectionsText(count)
	}
}
