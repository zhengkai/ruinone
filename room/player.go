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
	Run  int
	Jump bool
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

// Jump ...
func (p *Player) Jump() {
	p.control.Jump = true
}

func (p *Player) parseControl() {
	if p.control.Jump {
		if p.JumpCount < p.JumpLimit {
			p.control.Jump = false
			p.JumpCount++
			p.Acceleration = p.JumpPower
		}
	}
}

// Dump ...
func (p *Player) Dump() (a map[string]interface{}) {
	a = make(map[string]interface{})

	a[`id`] = p.ID
	a[`X`] = p.X
	a[`Y`] = p.Y
	a[`JumpCount`] = p.JumpCount

	return
}
