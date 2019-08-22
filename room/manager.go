package room

var (
	cmdCh     = make(chan interface{})
	roomMap   = make(map[int]*Room)
	playerMap = make(map[int]*Player)
	room      *Room
	player    *Player

	ai = 0
)

func manager() {

	for {
		a := <-cmdCh

		switch a.(type) {

		case *CmdNewRoom:
			mngNewRoom(a.(*CmdNewRoom))

		case *CmdNewPlayer:
			mngNewPlayer(a.(*CmdNewPlayer))

		case *CmdRoomTick:
			mngRoomTick(a.(*CmdRoomTick))

		case *CmdJump:
			mngJump(a.(*CmdJump))

		case *CmdRun:
			mngRun(a.(*CmdRun))

		default:
			j.Log(`unknown cmd`, a)
		}
	}
}
