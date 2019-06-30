import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';
import { GameService } from './game.service';
import { Player } from './player';
import { Input } from './input';

export class World {

	c = new Container();

	tick = 0;

	gridSize = 0;

	x = 8;
	y = 3;

	me: Player;

	child = [];

	target: GameService;

	constructor(private app: Application) {
		app.stage.addChild(this.c);
	}

	run() {
		this.tick++;

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

		for (const c of this.child) {

			if (c.acceleration) {
				c.y += c.acceleration;
				c.acceleration -= c.fall;
			}

			if (c.x < 0) {
				c.x = 0;
			} else if (c.x > 16) {
				c.x = 16;
			}

			if (c.y < 0) {
				c.jumpCount = 2;
				c.acceleration = 0;
				c.y = 0;
			} else if (c.y > 7) {
				c.y = 7;
			}

			const g = c.graphic;
			g.position.x = gs * (c.x - this.x);
			g.position.y = - gs * (c.y - this.y);

			const scale = gs / c.gridSize;
			g.scale.set(scale, scale);
		}
	}

	newChild(): Player {
		const p = new Player(this.gridSize);
		this.c.addChild(p.graphic);
		this.child.push(p);

		console.log(p);
		return p;
	}

	control() {
		const c = Input.get();
		const p = this.me;
		if (c.e) {
			p.x += p.speed;
		} else if (c.w) {
			p.x -= p.speed;
		}

		if (c.jump) {
			if (!p.jumpPress && p.jumpCount) {
				p.jumpCount--;
				p.acceleration = p.jump;
			}
			p.jumpPress = true;
		} else {
			p.jumpPress = false;
		}
	}
}
