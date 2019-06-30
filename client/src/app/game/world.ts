import { Application, Container, Text, Graphics, TextStyle } from 'pixi.js';

export class World {

	container = new Container();

	count = 0;

	child = [];

	constructor(private app: Application) {
		app.stage.addChild(this.container);
	}

	run() {
		this.count++;
		if (this.count % 10 === 0) {
			// console.log('world tick', this.count);
		}
	}
}
