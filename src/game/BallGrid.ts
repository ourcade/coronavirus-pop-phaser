import Phaser from 'phaser'

import BallLayoutData, {
	Red, Gre, Blu, Yel
} from './BallLayoutData'

import BallColor from './BallColor'

interface IGridPosition
{
	row: number
	col: number
}

type IBallOrNone = IBall | undefined

export default class BallGrid
{
	private scene: Phaser.Scene
	private pool: IStaticBallPool

	private layoutData?: BallLayoutData

	private size: Phaser.Structs.Size

	private grid: IBallOrNone[][] = []

	constructor(scene: Phaser.Scene, pool: IStaticBallPool)
	{
		this.scene = scene
		this.pool = pool

		const sample = this.pool.spawn(0, 0)
		this.size = new Phaser.Structs.Size(sample.width, sample.height)
		this.pool.despawn(sample)
	}

	setLayoutData(layout: BallLayoutData)
	{
		this.layoutData = layout

		return this
	}

	/**
	 * 
	 * @param x x position at collision with grid
	 * @param y y position at collision with grid
	 * @param color color ball
	 * @param gridBall ball in grid that was collided with
	 * @param bvx x velocity of ball at collision
	 * @param bvy y velocity of ball at collision
	 */
	attachBall(x: number, y: number, color: BallColor, gridBall: IBall, bvx: number, bvy: number)
	{
		const width = this.size.width
		const radius = width * 0.5

		const vel = new Phaser.Math.Vector2(bvx, bvy)
		vel.normalize()

		// the position on the ball in the direction it was heading
		const hx = x + (vel.x * radius)

		const cellX = gridBall.x
		const cellY = gridBall.y

		const dx = hx - cellX

		let tx = dx <= 0 ? cellX - radius : cellX + radius

		// offset by vertical interval
		const interval = width * 0.8
		const dy = y - cellY
		let ty = dy >= 0 ? cellY + interval : cellY - interval

		// place on same row
		const sameRow = Math.abs(dy) <= radius
		if (sameRow)
		{
			ty = cellY
			// adjust x to be next to
			tx = dx <= 0 ? tx - radius : tx + radius
		}

		const newBall = this.pool.spawn(x, y)
			.setColor(color)

		const { row, col } = this.findRowAndColumns(gridBall)

		let bRow = -1
		if (sameRow)
		{
			bRow = row
		}
		else
		{
			if (ty < cellY)
			{
				bRow = row - 1
			}
			else
			{
				bRow = row + 1
			}
		}

		let bCol = -1

		if (sameRow)
		{
			bCol = tx < cellX ? col - 1 : col + 1
		}
		else
		{
			const isEven = bRow % 2 === 0
			if (isEven)
			{
				bCol = tx < cellX ? col : col + 1
			}
			else
			{
				bCol = tx < cellX ? col - 1 : col
			}
		}

		this.insertAt(bRow, bCol, newBall)

		const matches = this.findMatchesAt(bRow, bCol, color)
		// minimum 3 matches required
		if (matches.length < 3)
		{
			this.animateAttachBounceAt(bRow, bCol, tx, ty, newBall)
			return
		}

		newBall.x = tx
		newBall.y = ty
		this.destroyMatches(matches, color)
	}

	generate()
	{
		if (!this.layoutData)
		{
			return this
		}

		const data = this.layoutData.getRandomData()
		const middle = this.scene.scale.width * 0.5
		let y = 0
		let x = middle

		const width = this.size.width
		const radius = width * 0.5
		const verticalInterval = width * 0.8

		data.forEach((row, idx) => {
			const count = row.length

			const gridRow: IBallOrNone[] = []
			this.grid.unshift(gridRow)
			
			if (count <= 0)
			{
				y -= verticalInterval
				return
			}

			const halfCount = count * 0.5
			x = middle - (halfCount * width) + (radius * 0.5)

			const isEven = idx % 2 === 0
			if (isEven)
			{
				x += radius
				// to handle the offset
				gridRow.push(undefined)
			}

			row.forEach(colorCode => {

				const b = this.pool.spawn(x, y)
				gridRow.push(b)

				switch (colorCode)
				{
					default:
					case Red:
						b.setColor(BallColor.Red)
						break

					case Blu:
						b.setColor(BallColor.Blue)
						break

					case Gre:
						b.setColor(BallColor.Green)
						break

					case Yel:
						b.setColor(BallColor.Yellow)
						break
				}

				x += width
			})

			if (!isEven)
			{
				// pad end with space for offset
				gridRow.push(undefined)
			}

			y -= verticalInterval
		})

		return this
	}

	moveDown(rows: number = 1)
	{
		if (this.pool.countActive() === 0)
		{
			return this
		}

		const balls = this.pool.getChildren()
		const count = balls.length
		for (let i = 0; i < count; ++i)
		{
			const b = balls[i] as IBall
			b.y += (b.height * rows)

			const body = b.body as Phaser.Physics.Arcade.StaticBody
			body.updateFromGameObject()
		}

		return this
	}

	private destroyMatches(matches: IGridPosition[], color: BallColor)
	{
		const size = matches.length
		for (let i = 0; i < size; ++i)
		{
			const { row, col } = matches[i]
			const ball = this.getAt(row, col)

			if (!ball)
			{
				// should never be the case..
				console.warn(`detroyMatches: match not found...`)
				continue
			}

			this.grid[row][col] = undefined
			this.pool.despawn(ball)
		}
	}

	private animateAttachBounceAt(row: number, col: number, tx: number, ty: number, newBall: IBall)
	{
		// https://github.com/photonstorm/phaser/blob/v3.22.0/src/math/easing/EaseMap.js
		const timeline = this.scene.tweens.createTimeline()
		timeline.add({
			targets: newBall,
			y: ty - 5,
			duration: 50
		})

		timeline.add({
			targets: newBall,
			x: tx,
			duration: 100,
			offset: 0
		})

		timeline.add({
			targets: newBall,
			y: ty,
			duration: 50,
			ease: 'Back.easeOut',
			onComplete: () => {
				const body = newBall.body as Phaser.Physics.Arcade.StaticBody
				body.updateFromGameObject()
			}
		})

		timeline.play()

		this.jiggleNeighbors(row, col)
	}

	private findRowAndColumns(ball: IBall)
	{
		// search from the bottom
		const size = this.grid.length
		for (let i = size - 1; i >= 0; --i)
		{
			const row = this.grid[i]
			const colIdx = row.findIndex(b => b === ball)
			if (colIdx < 0)
			{
				continue
			}

			return {
				row: i,
				col: colIdx
			}
		}

		return {
			row: -1,
			col: -1
		}
	}

	private insertAt(row: number, col: number, ball: IBall)
	{
		if (row >= this.grid.length)
		{
			const count = row - (this.grid.length - 1)
			for (let i = 0; i < count; ++i)
			{
				this.grid.push([])
			}
		}

		const rowList = this.grid[row]
		for (let i = 0; i <= col; ++i)
		{
			if (rowList.length <= i)
			{
				// @ts-ignore
				rowList[i] = undefined
			}
		}

		rowList[col] = ball
	}

	private getAt(row: number, col: number)
	{
		if (row < 0)
		{
			return null
		}

		if (row > this.grid.length - 1)
		{
			return null
		}

		const rowList = this.grid[row]
		return rowList[col]
	}

	private findMatchesAt(row: number, col: number, color: BallColor, found: Set<IBall> = new Set())
	{
		const isEven = row % 2 === 0
		const adjacentMatches: IGridPosition[] = []

		// top left
		if (isEven)
		{
			const tl = this.getAt(row - 1, col - 1)
			if (tl && tl.color === color && !found.has(tl))
			{
				adjacentMatches.push({
					row: row - 1,
					col: col - 1
				})
				found.add(tl)
			}
		}

		// top
		const t = this.getAt(row - 1, col)
		if (t && t.color === color && !found.has(t))
		{
			adjacentMatches.push({
				row: row - 1,
				col
			})
			found.add(t)
		}

		// top right
		const tr = this.getAt(row - 1, col + 1)
		if (tr && tr.color === color && !found.has(tr))
		{
			adjacentMatches.push({
				row: row - 1,
				col: col + 1
			})
			found.add(tr)
		}

		// right
		const r = this.getAt(row, col + 1)
		if (r && r.color === color && !found.has(r))
		{
			adjacentMatches.push({
				row,
				col: col + 1
			})
			found.add(r)
		}

		// bottom right
		const br = this.getAt(row + 1, col + 1)
		if (br && br.color === color && !found.has(br))
		{
			adjacentMatches.push({
				row: row + 1,
				col: col + 1
			})
			found.add(br)
		}

		// bottom
		const b = this.getAt(row + 1, col)
		if (b && b.color === color && !found.has(b))
		{
			adjacentMatches.push({
				row: row + 1,
				col
			})
			found.add(b)
		}

		// bottom left
		if (isEven)
		{
			const bl = this.getAt(row + 1, col - 1)
			if (bl && bl.color === color && !found.has(bl))
			{
				adjacentMatches.push({
					row: row + 1,
					col: col - 1
				})
				found.add(bl)
			}
		}

		// left
		const l = this.getAt(row, col - 1)
		if (l && l.color === color && !found.has(l))
		{
			adjacentMatches.push({
				row,
				col: col - 1
			})
			found.add(l)
		}

		adjacentMatches.forEach(pos => {
			this.findMatchesAt(pos.row, pos.col, color, found).forEach(obj => adjacentMatches.push(obj))
		})

		return adjacentMatches
	}

	private jiggleNeighbors(sourceRow: number, sourceCol: number)
	{
		const sourceBall = this.getAt(sourceRow, sourceCol)
		const firstNeightbors = this.getNeighbors(sourceRow, sourceCol)

		const secondTop = sourceRow - 1

		const secondNeighbors = firstNeightbors.find(({ row }) => row === secondTop)
			? this.getNeighbors(secondTop, sourceCol)
			: []

		const degrees = [
			firstNeightbors,
			secondNeighbors
		]

		const size = degrees.length
		for (let i = 0; i < size; ++i)
		{
			const deg = degrees[i]
			for (let j = 0; j < deg.length; ++j)
			{
				const { row, col } = deg[j]
				const ball = this.getAt(row, col)
				if (!ball || ball === sourceBall)
				{
					continue
				}

				const factor = (size - i) / size
				const movement = 10 * factor
				

				const timeline = this.scene.tweens.createTimeline()
				const y = ball.y
				
				timeline.add({
					targets: ball,
					y: y - movement,
					duration: 50
				})

				timeline.add({
					targets: ball,
					y,
					duration: 50,
					ease: 'Back.easeOut'
				})

				timeline.play()
			}
		}
	}

	private getNeighbors(row: number, col: number, includeBottom = false)
	{
		const positions = this.getNeighborPositions(row, col, 1, includeBottom)
		const neighbors = positions.map(({ row, col }) => {
			const n = this.getAt(row, col)
			if (!n)
			{
				return undefined
			}
			return { row, col }
		})
		.filter(n => n)

		return neighbors as { row: number, col: number }[]
	}

	private getNeighborPositions(row: number, col: number, degrees = 1, includeBottom = false)
	{
		const positions = [
			{ row: row, col: col - degrees },			// left
			{ row: row, col: col + degrees },			// right
			{ row: row - degrees, col: col }, 			// top
			{ row: row - degrees, col: col - degrees },	// top left
			{ row: row - degrees, col: col + degrees},	// top right
		]

		if (includeBottom)
		{
			positions.push({ row: row + degrees, col: col }) 			// bottom
			positions.push({ row: row + degrees, col: col - degrees })	// bottom left
			positions.push({ row: row + degrees, col: col + degrees })	// bottom right
		}

		return positions
	}
}
