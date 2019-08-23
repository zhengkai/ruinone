package room

import (
	"math/rand"
)

// Room ...
type Room struct {
	ID    int
	Tick  int
	PL    map[int]*Player
	Rand  *rand.Rand
	cmdCh chan interface{}
	ai    int
	me    *Player
}

func (r *Room) mngTick(a *cmdTick) {

	r.tick()
	a.Dump = r.Dump()

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

	pl := []interface{}{}
	for _, p := range r.PL {
		v, ok := p.Dump()
		if !ok {
			continue
		}
		pl = append(pl, v)
	}

	a[`playerList`] = pl

	return
}
