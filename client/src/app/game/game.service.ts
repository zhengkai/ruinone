import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { World } from './world';
import { Screen } from './screen';
import { Debug } from './debug';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	wasmReady = false;

	app: Application;

	world: World;
	screen: Screen;
	debug: Debug;

	init = false;

	t: Text;

	constructor() {
	}

	tick(delta: number) {

		if (!this.init) {
			this.init = true;
			this.doInit();
			if (this.wasmReady) {
				this.wasmInit();
			}
		}

		this.screen.run();
		if (this.wasmReady) {
			this.world.run();
			this.debug.run();
		}
		// this.t.text('' + this.count);

		// console.log('game tick', this.app, Math.PI / delta);
	}

	wasmInit() {
		this.wasmReady = true;
		if (!this.init) {
			return;
		}
		console.log('wasmInit');
		this.screen.wasmInit();
		this.world.wasmInit();
	}

	doInit() {

		const a = this.app;

		this.screen = new Screen(a);

		this.world = new World(a, this.screen);

		this.debug = new Debug(a);
		this.debug.target = this;

		console.log('game init', a);
	}
}
