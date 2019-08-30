import { Application, Container } from 'pixi.js';
import { GameService } from './game.service';
import { Player, PlayerDump } from './player';
import { Input } from './input';
import { Screen } from './screen';
import { Field } from './field';

declare const goSetMap: any;
declare const goPause: any;
declare const goField: any;
declare const goDump: any;
declare const goJump: any;
declare const goRun: any;

export class World {

	wasmReady = false;

	c = new Container();

	tick = 0;

	gridSize = 0;
	gridSizeChange = false;

	x = 8;
	y = 3;

	child = new Map();

	field = Array<Field>();

	jumpSent = false;
	runSent = 0;

	constructor(private app: Application, private screen: Screen) {
		app.stage.addChild(this.c);
		this.c.visible = false;
	}

	hide() {
		this.c.visible = false;
		goPause(true);
	}

	show() {
		this.c.visible = true;
		goPause(false);
	}

	init() {
		const seed = Math.floor(Math.random() * 999999999);

		goField().list.forEach((v) => {
			const f = this.newField();
			f.setDump(v);
			f.draw(this.x, this.y);
			this.field.push(f);
		});

		this.center();
	}

	run() {

		if (!this.c.visible) {
			return;
		}

		let ts = +Date.now();
		const dump = goDump();
		ts = +Date.now() - ts;
		this.tick = dump.tick;

		if (ts > 5) {
			// console.warn('dump time > 5ms', ts);
		}

		for (const v of dump.playerList) {
			let p = this.child.get(v.id);
			if (!p) {
				p = this.newPlayer();
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

		this.loop();
	}

	center() {
		const s = this.screen;
		const p = this.c.position;
		p.x = s.centerW;
		p.y = s.centerH;

		if (this.gridSize !== s.gridSize) {
			this.gridSize = s.gridSize;
			this.gridSizeChange = true;
		}
	}

	loop() {

		const gs = this.screen.gridSize;

		this.child.forEach((p) => {
			p.draw(this.x, this.y);
		});

		if (this.gridSizeChange) {
			this.gridSizeChange = false;
			for (const f of this.field) {
				f.draw(this.x, this.y);
			}
		}
	}

	newPlayer(): Player {
		const p = new Player(this.screen);
		this.c.addChild(p.graphic);
		// this.child.push(p);
		return p;
	}

	newField(): Field {
		const f = new Field(this.screen);
		this.c.addChild(f.graphic);
		return f;
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
