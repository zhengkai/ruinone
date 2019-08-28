package room

// Physics ...
type Physics struct {
	W float64
	H float64

	X float64
	Y float64

	VX float64
	VY float64

	pos *phyPos
}

type phyPos struct {
	x float64
	y float64

	x1 float64
	x2 float64
	y1 float64
	y2 float64
}

type phyOver struct {
	n bool
	s bool
	w bool
	e bool
}

type phyResult struct {
	m       float64
	phy     *Physics
	overlap *phyOver
}

func (p *Physics) newPos() *phyPos {

	w := p.W / 2

	p.pos = &phyPos{
		x:  p.X,
		y:  p.Y,
		x1: p.X - w,
		x2: p.X + w,
		y1: p.Y,
		y2: p.Y + p.H,
	}

	return p.pos
}

func (p *Physics) getPos() *phyPos {

	if p.pos != nil {
		return p.pos
	}

	return p.newPos()
}

func (p *Physics) checkOverlap(target *Physics) (is bool, over *phyOver) {

	a := p.getPos()
	b := target.getPos()

	// j.Log(`b`, a, b)

	over = &phyOver{}

	x := false
	y := false

	if a.y1 > b.y1 && a.y1 < b.y2 {
		y = true
		over.s = true
	}
	if a.y2 > b.y1 && a.y2 < b.y2 {
		y = true
		over.n = true
	}

	if a.x1 > b.x1 && a.x1 < b.x2 {
		x = true
		over.w = true
	}
	if a.x2 > b.x1 && a.x2 < b.x2 {
		x = true
		over.e = true
	}

	is = x && y
	return
}
