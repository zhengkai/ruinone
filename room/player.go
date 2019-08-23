package room

// Player ...
type Player struct {
	Physics
	ID           int
	JumpCount    int
	JumpLimit    int
	Acceleration float64
	JumpPower    float64
	Fall         float64
	Speed        float64
	control      *PlayerControl

	dataDump *playerDump
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

	p := NewPlayer(r.ai)

	r.addPlayer(p)
	if r.me == nil {
		r.me = p
	}

	a.mutex.Unlock()
}

// NewPlayer ...
func NewPlayer(id int) (p *Player) {

	p = &Player{
		ID:        id,
		JumpPower: 0.4,
		Fall:      0.02,
		JumpLimit: 2,
		Speed:     0.1,
		control:   &PlayerControl{},
		dataDump:  &playerDump{x: -10000},
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

	p.control.Run = v
}

func (p *Player) parseControl() {

	c := p.control

	if c.Jump {
		c.Jump = false
		if p.JumpCount < p.JumpLimit {
			p.JumpCount++
			p.Acceleration = p.JumpPower
		}
	}
}

// Dump ...
func (p *Player) Dump() (a map[string]interface{}, ok bool) {

	v := playerDump{
		x: p.X,
		y: p.Y,
	}

	// j.Log(*p.dataDump == v, v, *p.dataDump)

	if *p.dataDump == v {
		return
	}

	ok = true

	p.dataDump = &v

	a = make(map[string]interface{})
	a[`id`] = p.ID
	a[`x`] = v.x
	a[`y`] = v.y

	return
}
