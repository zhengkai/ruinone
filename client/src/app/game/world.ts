import { Application, Container } from 'pixi.js';
import { GameService } from './game.service';
import { Player, PlayerDump } from './player';
import { Camera } from './camera';
import { Screen } from './screen';
import { Field, FieldDump } from './field';

declare const goSetMap: any;
declare const goPause: any;
declare const goField: any;
declare const goDump: any;

export class World {

	game: GameService;

	c = new Container();

	tick = 0;

	pause = false;

	gridSizeChange = false;

	x = 8;
	y = 3;

	child = new Map();

	field = Array<Field>();

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

		this.c.zIndex = -100;
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
			Camera.draw(f);
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

		if (this.pause && !Camera.resize) {
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

			Camera.setPos(v.x, v.y);

			p.setDump(v);
		}

		this.loop();
	}

	center() {
		const p = this.c.position;
		p.x = Camera.centerX;
		p.y = Camera.centerY;
	}

	loop() {

		const gs = Camera.gridSize;

		if (Camera.resize) {

			this.child.forEach((v) => {
				v.build();
				this.c.addChild(v.graphic);
			});

			for (const f of this.field) {
				f.build();
				this.c.addChild(f.graphic);
			}
		}

		this.child.forEach((p) => {
			Camera.draw(p);
		});

		if (Camera.posChange) {
			// console.log('pos change');
			for (const f of this.field) {
				Camera.draw(f);
			}
		}
	}

	newPlayer(): Player {
		const p = new Player();
		this.c.addChild(p.graphic);
		// this.child.push(p);
		return p;
	}

	newField(): Field {
		const f = new Field();
		this.c.addChild(f.graphic);
		return f;
	}
}
