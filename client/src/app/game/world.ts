import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { GameService } from './game.service';
import { Player, PlayerDump } from './player';
import { Input } from './input';

declare const goPlayer: any;
declare const goDump: any;
declare const goJump: any;
declare const goRun: any;

export class World {

	wasmReady = false;

	c = new Container();

	tick = 0;

	gridSize = 0;

	x = 8;
	y = 3;

	child = new Map();

	target: GameService;

	jumpSent = false;
	runSent = 0;

	constructor(private app: Application) {
		app.stage.addChild(this.c);
	}

	wasmInit() {
		this.wasmReady = true;

		const seed = Math.floor(Math.random() * 999999999);

		// this.playerID = goPlayer();

		this.center();
	}

	run() {
		// this.tick++;

		// console.log('tick start');

		let ts = +Date.now();
		const dump = goDump();
		ts = +Date.now() - ts;
		this.tick = dump.tick;

		if (ts > 5) {
			console.warn('dump time > 5ms', ts);
		}

		for (const v of dump.playerList) {
			let p = this.child.get(v.id);
			if (!p) {
				p = this.newChild();
				this.child.set(v.id, p);
			}
			p.setDump(v);
		}

		/*
		Object.entries(dump.playerList).map(([_, v]) => {
			const d = v as PlayerDump;
			if (d.id === this.playerID) {
				this.me.setDump(d);
			}
		});
		 */

		// console.log('tick dump', dump);

		this.center();

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
		//

		this.child.forEach((p) => {
			p.draw(gs, this.x, this.y);
		});
	}

	newChild(): Player {
		const p = new Player(this.gridSize);
		this.c.addChild(p.graphic);
		// this.child.push(p);
		return p;
	}

	control() {
		const c = Input.get();

		if (this.jumpSent !== c.jump) {
			this.jumpSent = c.jump;
			goJump(this.jumpSent);
		}

		let run = 0;
		if (c.e) {
			run = 1;
		} else if (c.w) {
			run = -1;
		}
		if (this.runSent !== run) {
			this.runSent = run;
			goRun(this.runSent);
		}
	}
}
