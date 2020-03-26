import Phaser from 'phaser'

const tips = [
	'There is currently no vaccine to prevent coronavirus disease 2019 (COVID-19).',
	'The best way to prevent illness is to avoid being exposed to this virus.',
	'These droplets can land in the mouths or noses of people who are nearby or possibly be inhaled into the lungs.',
	'Wash your hands often with soap and water for at least 20 seconds especially after you have been in a public place, or after blowing your nose, coughing, or sneezing.',
	'If soap and water are not readily available, use a hand sanitizer that contains at least 60% alcohol. Cover all surfaces of your hands and rub them together until they feel dry.',
	'Avoid touching your eyes, nose, and mouth with unwashed hands.',
	'Put distance between yourself and other people if COVID-19 is spreading in your community.'
]

let tipIdx = Phaser.Math.Between(0, tips.length - 1)
const getNextTip = () => {
	const tip = tips[tipIdx]

	++tipIdx

	if (tipIdx >= tips.length)
	{
		tipIdx = 0
	}

	return tip
}

export default tips

export {
	getNextTip
}
