import { Injectable } from '@angular/core';
import { Application, Graphics, Text } from 'pixi.js';
import { World } from './world';
import { Editor } from './editor';
import { Screen } from './screen';
import { Debug } from './debug';
import { Menu } from './menu';

@Injectable({
	providedIn: 'root'
})
export class GameService {

	app: Application;

	world: World;
	screen: Screen;
	debug: Debug;
	menu: Menu;
	editor: Editor;

	constructor() {
		// console.log('abc', a);
	}

	switch(name: string) {
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
		this.screen.run();
		this.world.run();
		this.debug.run();
		this.menu.run();
		this.editor.run();
	}

	setApp(app: Application) {
		this.app = app;
		this.screen = new Screen(app);
	}

	init() {
		const a = this.app;

		this.world = new World();

		this.debug = new Debug(a);
		this.debug.target = this;

		this.menu = new Menu();
		this.menu.init(this);

		this.editor = new Editor();
		this.editor.init(this);

		this.screen.init();
		this.world.init(this);

		console.log('game init', a);

		this.switch('world');
	}
}
