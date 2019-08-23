package room

var (
	jumpCircle = float64(15)
)

// Player ...
type Player struct {
	Physics
	ID           int
	JumpCount    int
	JumpLimit    int
	JumpPower    float64
	Acceleration float64
	Fall         float64
	Speed        float64
	control      *PlayerControl
	room         *Room

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
		Fall:      0.02 / rate,
		JumpLimit: 2,
		Speed:     0.2 * rate,
		control:   &PlayerControl{},

		dataDump:     &playerDump{},
		dataDumpPrev: &playerDump{x: -10000},
	}

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

	if c.Jump {
		c.Jump = false
		if p.JumpCount < p.JumpLimit {
			p.JumpCount++
			p.tickJump = p.room.tickCount
		}
	}
}

func (p *Player) tick() {

	// j.Log(`p.Acceleration`, p.Acceleration)

	d := p.calcTick(1)
	p.X = d.x
	p.Y = d.y

	p.Acceleration -= p.Fall

	if p.Y <= 0 {
		p.JumpCount = 0
		p.Acceleration = 0
	}
}

func (p *Player) calcTick(rate float64) (d *playerDump) {

	d = &playerDump{}

	d.x = p.X + p.control.Run*rate

	if p.tickJump > 0 {

		tick := float64(p.room.tickCount-p.tickJump) + rate

		d.y = p.Y + tick*rate
	}

	if d.x < 0 {
		d.x = 0
	} else if d.x > 16 {
		d.x = 16
	}

	if d.y < 0 {
		d.y = 0
	} else if d.y > 7 {
		d.y = 7
	}

	return
}

// Dump ...
func (p *Player) Dump(rate float64) (a map[string]interface{}, ok bool) {

	// j.Log(*p.dataDump == v, v, *p.dataDump)

	d := p.calcTick(rate)

	if *p.dataDumpPrev == *d {
		return
	}

	ok = true
	p.dataDumpPrev = p.dataDump

	a = make(map[string]interface{})
	a[`id`] = p.ID
	a[`x`] = d.x
	a[`y`] = d.y

	return
}
