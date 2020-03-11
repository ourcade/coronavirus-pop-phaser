enum BallColor
{
	Red = 0xdb0b0b,
	Blue = 0x0b6cdb,
	Green = 0x0bdb23,
	Yellow = 0xdbc60b,

	Any = -1
}

const colorIsMatch = (first: BallColor, second: BallColor) => {
	if (first === BallColor.Any || second === BallColor.Any)
	{
		return true
	}

	return first === second
}

export default BallColor

export {
	colorIsMatch
}
