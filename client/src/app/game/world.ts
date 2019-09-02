import { Application, Container } from 'pixi.js';
import { GameService } from './game.service';
import { Player, PlayerDump } from './player';
import { Input } from './input';
import { Camera } from './camera';
import { Screen } from './screen';
import { Field, FieldDump } from './field';

declare const goSetMap: any;
declare const goPause: any;
declare const goField: any;
declare const goDump: any;
declare const goJump: any;
declare const goRun: any;

export class World {

	game: GameService;

	c = new Container();

	tick = 0;

	gridSizeChange = false;

	x = 8;
	y = 3;

	child = new Map();

	pos = {
		x: 0,
		y: 0,
	};
	posRefresh = false;

	field = Array<Field>();

	jumpSent = false;
	runSent = 0;

	constructor() {
		this.c.visible = false;
	}

	hide() {
		this.c.visible = false;
		goPause(true);
	}

	show() {
		this.c.visible = true;
		goPause(false);
		this.loadMap();
	}

	init(g: GameService) {

		this.game = g;
		g.app.stage.addChild(this.c);

		const seed = Math.floor(Math.random() * 999999999);

		this.loadMap();

		this.center();

		Camera.refresh();
	}

	loadMap() {

		for (const f of this.field) {
			f.graphic.destroy();
		}
		this.field.length = 0;

		let i = -1;
		let id = 0;
		const editor = this.game.editor;
		const map = editor.loadMapStr();
		for (const s of map) {
			i++;
			if (s !== '1') {
				continue;
			}

			id++;
			const v = {
				id,
				x: Math.floor(i / editor.size.h),
				y: i % editor.size.h,
			} as FieldDump;

			// console.log('field', v);

			const f = this.newField();
			f.setDump(v);
			f.draw();
			this.field.push(f);
		}
		goSetMap(map);

		// console.log('map size', id, map);
	}

	run() {

		if (!this.c.visible) {
			return;
		}
		if (Camera.posChange) {
			this.center();
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

			Camera.setPos(v.x, v.y);

			p.setDump(v);
		}

		this.control();

		this.loop();
	}

	center() {
		const p = this.c.position;
		p.x = Camera.centerX;
		p.y = Camera.centerY;

	}

	loop() {

		const gs = Camera.gridSize;

		this.child.forEach((p) => {
			p.draw();
		});

		for (const f of this.field) {
			f.draw();
		}
		if (Camera.posChange) {
		}
	}

	newPlayer(): Player {
		const p = new Player();
		this.c.addChild(p.graphic);
		// this.child.push(p);
		return p;
	}

	newField(): Field {
		const f = new Field(this.game.screen);
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
