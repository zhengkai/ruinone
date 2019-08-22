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
}

// PlayerControl  ...
type PlayerControl struct {
	Run       float64
	Jump      bool
	JumpPress bool
}

func mngNewPlayer(a *CmdNewPlayer) {
	ai++
	a.ID = ai

	p := &Player{
		ID:        ai,
		JumpPower: 0.4,
		Fall:      0.02,
		JumpLimit: 2,
		Speed:     0.1,
		control:   &PlayerControl{},
	}

	if a.Room > 0 {

		r, ok := roomMap[a.Room]
		if !ok {
			j.Log(`new player, room not found`, a.Room, a)
			return
		}

		r.addPlayer(p)
	} else {
		room.addPlayer(p)
	}

	j.Log(`mngNewPlayer`, ai, p)

	if player == nil {
		player = p
	}
	playerMap[ai] = p

	a.mutex.Unlock()
}

func mngJump(a *CmdJump) {

	p, ok := playerMap[a.ID]
	if !ok {
		j.Log(`jump not found player`, a.ID, p)
		return
	}
	p.Jump(a.Jump)
}

func mngRun(a *CmdRun) {

	p, ok := playerMap[a.ID]
	if !ok {
		j.Log(`jump not found player`, a.ID, p)
		return
	}
	p.Run(a.Run)
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
func (p *Player) Dump() (a map[string]interface{}) {
	a = make(map[string]interface{})

	a[`id`] = p.ID
	a[`x`] = p.X
	a[`y`] = p.Y
	a[`jumpCount`] = p.JumpCount

	return
}
