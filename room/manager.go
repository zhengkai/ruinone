package room

var (
	roomMap   = make(map[int]*Room)
	playerMap = make(map[int]*Player)
	room      *Room
	player    *Player
)

func (r *Room) manager() {

	for {
		a := <-r.cmdCh

		switch a.(type) {

		case *cmdNewPlayer:
			r.mngNewPlayer(a.(*cmdNewPlayer))

		case *cmdTick:
			r.mngTick(a.(*cmdTick))

		case *cmdJump:
			r.mngJump(a.(*cmdJump))

		case *cmdRun:
			r.mngRun(a.(*cmdRun))

		default:
			j.Log(`unknown cmd`, a)
		}
	}
}
