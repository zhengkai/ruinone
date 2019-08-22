package room

import "strconv"

// Room ...
type Room struct {
	ID   int
	Tick int
	PL   map[int]*Player
}

func mngNewRoom(a *CmdNewRoom) {
	ai++
	a.ID = ai

	r := &Room{
		ID: ai,
		PL: make(map[int]*Player),
	}

	j.Log(`mngNewRoom`, ai, r)

	if room == nil {
		room = r
	}
	roomMap[ai] = r

	a.mutex.Unlock()
}

func mngRoomTick(a *CmdRoomTick) {
	// j.Log(`tick start`)

	if a.ID > 0 {
		r, ok := roomMap[a.ID]
		if !ok {
			j.Log(`tick unknown room`, a.ID, a)
			return
		}
		r.tick()
		a.Dump = r.Dump()
	} else {
		room.tick()
		a.Dump = room.Dump()
	}

	// j.Log(`tick dump`, a.Dump)

	a.mutex.Unlock()
}

func (r *Room) addPlayer(p *Player) {
	r.PL[p.ID] = p
}

func (r *Room) tick() {
	r.Tick++

	for _, p := range r.PL {
		r.tickPlayer(p)
	}
}

func (r *Room) tickPlayer(p *Player) {

	p.parseControl()

	p.Y += p.Acceleration
	p.Acceleration -= p.Fall

	p.X += p.control.Run * 0.2

	if p.X < 0 {
		p.X = 0
	} else if p.X > 16 {
		p.X = 16
	}

	if p.Y < 0 {

		p.Y = 0

		p.JumpCount = 0
		p.Acceleration = 0

	} else if p.Y > 7 {
		p.Y = 7
	}
}

// Dump ...
func (r *Room) Dump() (a map[string]interface{}) {

	a = make(map[string]interface{})
	a[`tick`] = r.Tick

	pl := make(map[string]interface{})
	a[`playerList`] = pl

	for k, v := range r.PL {
		id := strconv.Itoa(k)
		pl[id] = v.Dump()
	}

	return
}
