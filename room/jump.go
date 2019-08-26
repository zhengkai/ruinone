package room

var (
	jumpHeight = float64(5)
)

func jumpCalc(rate, circle float64) float64 {

	rate /= circle
	rate--

	return (1 - rate*rate) * jumpHeight
}
