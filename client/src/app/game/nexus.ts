import { Injectable } from '@angular/core';
import { GamePart } from './game.part';
import { Application } from 'pixi.js';
import { Camera } from './camera';
import { Control } from './control';
import { Debug } from './debug';
import { Editor } from './editor';
import { Menu } from './menu';
import { Screen } from './screen';
import { UI } from './ui';
import { World } from './world';

@Injectable({
	providedIn: 'root'
})
export class Nexus {

	app: Application;

	control = new Control();
	debug   = new Debug();
	editor  = new Editor();
	menu    = new Menu();
	screen  = new Screen();
	ui      = new UI();
	world   = new World();

	mode = 'world';

	list = [];

	constructor() {
		for (const k in this) {
			if (!(this[k] instanceof GamePart)) {
				continue;
			}
			this.list.push(this[k]);
		}
	}

	switch(name: string) {
		this.mode = name;
		for (const s of ['world', 'editor']) {
			const o = this[s];
			if (name === s) {
				o.show();
			} else {
				o.hide();
			}
		}
	}

	tick(delta: number) {

		Camera.calc();

		this.list.forEach((o) => {
			o.run();
		});

		this.sortChildren();
	}

	setApp(app: Application) {
		this.app = app;

		this.list.forEach((o) => {
			o.setNexus(this);
		});
	}

	init() {
		const a = this.app;

		this.list.forEach((o) => {
			o.initGame();
		});

		this.sortChildren();

		console.log('game init', this, Camera.resize);

		this.switch(this.mode);

		this.app.ticker.add((delta) => {
			this.tick(delta);
		});
	}

	sortChildren() {
		if (Camera.resize) {
			this.app.stage.sortChildren();
		}
	}
}
