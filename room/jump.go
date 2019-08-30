package room

var (
	jumpHeight = float64(3)
)

func jumpCalc(rate, circle float64) float64 {

	rate /= circle
	rate--

	return (1 - rate*rate) * jumpHeight
}

// Jump ...
func (p *Player) Jump(v bool) {

	c := p.control

	if !c.JumpPress && v {
		c.Jump = true
	}
}

func (r *Room) mngJump(a *cmdJump) {

	if r.me == nil {
		j.Log(`jump not found me`)
		return
	}
	r.me.Jump(a.Jump)
}
