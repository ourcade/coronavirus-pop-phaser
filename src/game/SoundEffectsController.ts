import { Observable, SubscriptionLike } from 'rxjs'
import AudioKeys from '~/consts/AudioKeys'

import debounce from 'lodash/debounce'

export default class SoundEffectsController
{
	private sound: Phaser.Sound.BaseSoundManager

	private subscriptions: SubscriptionLike[] = []

	constructor(sound: Phaser.Sound.BaseSoundManager)
	{
		this.sound = sound
	}

	destroy()
	{
		this.subscriptions.forEach(sub => sub.unsubscribe())
		this.subscriptions.length = 0
	}

	handleBallAttached(attached: Observable<IBall>)
	{
		const sub = attached.subscribe(ball => {
			this.sound.play(AudioKeys.AttachToGrid, {
				volume: 0.2
			})
		})

		this.subscriptions.push(sub)
	}

	handleClearMatches(clearMatches: Observable<number>)
	{
		const sub = clearMatches.subscribe(count => {
			this.sound.play(AudioKeys.ClearMatches, {
				volume: count > 3 ? 0.4 : 0.7
			})

			if (count > 3)
			{
				this.sound.play(AudioKeys.ClearMatchesExtra1, {
					volume: 0.7
				})
			}
		})

		this.subscriptions.push(sub)
	}

	handleClearOrphan(clearOrphan: Observable<IBall>)
	{
		const sub = clearOrphan.subscribe(debounce(ball => {
			this.sound.play(AudioKeys.OrphanCleared, {
				volume: 0.2
			})
		}, 10))

		this.subscriptions.push(sub)
	}
}
