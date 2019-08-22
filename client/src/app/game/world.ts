import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { GameService } from './game.service';
import { Player, PlayerDump } from './player';
import { Input } from './input';

declare const goRoom: any;
declare const goPlayer: any;
declare const goTick: any;
declare const goJump: any;
declare const goRun: any;

export class World {

	wasmReady = false;

	c = new Container();

	tick = 0;

	gridSize = 0;

	x = 8;
	y = 3;

	me: Player;

	child = [];

	target: GameService;

	roomID = 0;
	playerID = 0;

	jumpSent = false;
	runSent = 0;

	constructor(private app: Application) {
		app.stage.addChild(this.c);

	}

	wasmInit() {
		this.wasmReady = true;
		this.roomID = goRoom();
		this.playerID = goPlayer();
		this.center();
		this.me = this.newChild();
	}

	run() {
		// this.tick++;

		// console.log('tick start');
		const dump = goTick(this.roomID);
		this.tick = dump.tick;
		Object.entries(dump.playerList).map(([_, v]) => {
			const d = v as PlayerDump;
			if (d.id === this.playerID) {
				this.me.setDump(d);
			}
		});

		// console.log('tick dump', dump);

		this.center();

		if (!this.child.length) {
			const p = this.newChild();
			if (!this.me) {
				this.me = p;
			}
		}

		this.control();

		this.loopChild();
	}

	center() {
		const s = this.target.screen;
		const p = this.c.position;
		p.x = s.centerW;
		p.y = s.centerH;

		if (!this.gridSize) {
			this.gridSize = s.gridSize;
		}
	}

	loopChild() {

		const gs = this.target.screen.gridSize;

		// console.log('child', this.child.length);

		for (const c of this.child) {
			c.draw(gs, this.x, this.y);
		}
	}

	newChild(): Player {
		const p = new Player(this.gridSize);
		this.c.addChild(p.graphic);
		this.child.push(p);
		return p;
	}

	control() {
		const c = Input.get();
		const p = this.me;

		if (this.jumpSent !== c.jump) {
			this.jumpSent = c.jump;
			goJump(this.playerID, this.jumpSent);
		}

		let run = 0;
		if (c.e) {
			run = 1;
		} else if (c.w) {
			run = -1;
		}
		if (this.runSent !== run) {
			this.runSent = run;
			goRun(this.playerID, this.runSent);
		}
	}
}
