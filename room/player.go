package room

// Player ...
type Player struct {
	Physics
	ID        int
	JumpCount int
	JumpLimit int
	JumpPower float64
	Speed     float64
	control   *PlayerControl
	room      *Room

	run      float64
	tickJump int

	dataDump     *playerDump
	dataDumpPrev *playerDump
}

type playerDump struct {
	x float64
	y float64
}

// PlayerControl  ...
type PlayerControl struct {
	Run       float64
	Jump      bool
	JumpPress bool
}

func (r *Room) mngNewPlayer(a *cmdNewPlayer) {
	r.ai++
	a.ID = r.ai

	p := NewPlayer(r.ai, r.fps)
	p.room = r

	r.addPlayer(p)
	if r.me == nil {
		r.me = p
	}

	a.mutex.Unlock()
}

// NewPlayer ...
func NewPlayer(id, fps int) (p *Player) {

	rate := 60 / float64(fps)
	// rate := float64(1)

	p = &Player{
		ID:        id,
		JumpPower: 0.4,
		JumpLimit: 2,
		Speed:     0.2 * rate,
		control:   &PlayerControl{},

		dataDump:     &playerDump{},
		dataDumpPrev: &playerDump{x: -10000},
	}

	p.W = 0.7
	p.H = 0.9
	p.X = 10

	return
}

func (r *Room) mngJump(a *cmdJump) {

	if r.me == nil {
		j.Log(`jump not found me`)
		return
	}
	r.me.Jump(a.Jump)
}

func (r *Room) mngRun(a *cmdRun) {

	if r.me == nil {
		j.Log(`run not found me`)
		return
	}
	r.me.Run(a.Run)
}

// Jump ...
func (p *Player) Jump(v bool) {

	c := p.control

	if !c.JumpPress && v {
		c.Jump = true
	}
}

// Run ...
func (p *Player) Run(v float64) {

	if v > 1 {
		v = 1
	} else if v < -1 {
		v = -1
	}

	p.control.Run = v * p.Speed
}

func (p *Player) parseControl() {

	c := p.control

	p.run = c.Run

	if c.Jump {
		c.Jump = false
		if p.JumpCount < p.JumpLimit {
			p.JumpCount++
			p.tickJump = p.room.tickCount
		}
	}
}

func (p *Player) tick() {

	phy, overlap := p.calcTick(1)
	p.X = phy.X
	p.Y = phy.Y

	if overlap.s {

		p.tickJump = 0
		p.JumpCount = 0

	} else if p.tickJump == 0 {

		minCheck := 0.001
		if phy.VY == 0 && phy.X > minCheck {
			ok := false
			for _, v := range fieldOne {
				ok, _ = phy.checkOverlap(&v.Physics)
			}
			if !ok {
				p.tickJump = p.room.tickCount - p.room.fps/2
			}
		}
	}

	if overlap.e || overlap.w {
		p.run = 0
	}
}

func (p *Player) getTickJump() (tick int, ok bool, stop bool) {

	if p.tickJump == 0 {
		return
	}

	ok = true
	tick = p.room.tickCount - p.tickJump
	return
}

func (p *Player) calcTick(rate float64) (phy *Physics, overlap *phyOver) {

	vx := p.run * rate

	vy := float64(0)
	if rate > 0 {
		tick, ok, _ := p.getTickJump()
		if ok {
			half := p.room.fps / 2
			circle := float64(half)
			tf := float64(tick)
			total := jumpCalc(tf+rate, circle)
			jump := jumpCalc(tf, circle)
			vy = total - jump
		}
	}

	motion := [2]phyResult{}

	for i, firstX := range [...]bool{true, false} {

		overlap = &phyOver{}
		phy := &Physics{
			W:  p.W,
			H:  p.H,
			X:  p.X + vx,
			Y:  p.Y + vy,
			VX: vx,
			VY: vy,
		}

		for _, v := range fieldOne {
			a := v.Physics
			ok, over := phy.checkOverlap(&a)
			if !ok {
				continue
			}

			for _, useX := range [...]bool{firstX, !firstX} {

				fix := false

				if useX {
					if vx < 0 && over.w {
						fix = true
						overlap.w = true
						phy.X = a.pos.x2 + phy.W/2
					} else if vx > 0 && over.e {
						fix = true
						overlap.e = true
						phy.X = a.pos.x1 - phy.W/2
					}
				} else {
					if vy < 0 && over.s {
						fix = true
						overlap.s = true
						phy.Y = a.pos.y2
					} else if vy > 0 && over.n {
						fix = true
						overlap.n = true
						phy.Y = a.pos.y1 - phy.H
					}
				}

				if fix {
					// j.Log(`break`)
					break
				}
			}
		}

		mx := vx - (phy.X - p.X)
		my := vy - (phy.Y - p.Y)
		if vx < 0 {
			mx = -mx
		}
		if vy < 0 {
			my = -my
		}
		phy.VX = mx
		phy.VY = my

		motion[i] = phyResult{
			m:       mx + my,
			phy:     phy,
			overlap: overlap,
		}
	}

	if motion[0].m < motion[1].m {
		phy = motion[0].phy
		overlap = motion[0].overlap
	} else {
		phy = motion[1].phy
		overlap = motion[1].overlap
	}

	if phy.X < 0 {
		overlap.w = true
		phy.X = 0
	} else if phy.X > 16 {
		overlap.e = true
		phy.X = 16
	}

	if phy.Y < 0 {
		overlap.s = true
		phy.Y = 0
	} else if phy.Y > 7 {
		overlap.n = true
		phy.Y = 7
	}

	return
}

// Dump ...
func (p *Player) Dump(rate float64) (a map[string]interface{}, ok bool) {

	// j.Log(*p.dataDump == v, v, *p.dataDump)

	phy, _ := p.calcTick(rate)

	d := playerDump{
		x: phy.X,
		y: phy.Y,
	}

	if *p.dataDumpPrev == d {
		return
	}

	ok = true
	p.dataDumpPrev = &d

	a = make(map[string]interface{})
	a[`id`] = p.ID
	a[`x`] = d.x
	a[`y`] = d.y

	return
}
