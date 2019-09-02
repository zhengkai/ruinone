export interface InputData {
	n: boolean;
	s: boolean;
	e: boolean;
	w: boolean;
	jump: boolean;
	pause: boolean;
	debug: boolean;
}

export class Input {

	static cache: any = false;

	static stat: InputData = {
		n: false,
		s: false,
		e: false,
		w: false,
		jump: false,
		pause: false,
		debug: false,
	};

	static keyMap = {

		65: 'w', // a
		87: 'n', // w
		68: 'e', // d
		83: 's', // s

		37: 'w', // ⬅️
		38: 'n', // ⬆️
		39: 'e', // ➡️
		40: 's', // ⬇️

		32: 'jump', // space

		80: 'pause', // p

		220: 'debug', // \
	};

	static key(code: number, down: boolean) {

		// console.log('key', code, down);

		const k = this.keyMap[code];
		if (!k) {
			return;
		}
		this.stat[k] = down;
		this.cache = null;
	}

	static get(): InputData {

		if (this.cache) {
			return this.cache;
		}

		const s = this.stat;
		const re: InputData = {
			s: s.s,
			n: s.n,
			w: s.w,
			e: s.e,
			jump: s.jump,
			pause: s.pause,
			debug: s.debug,
		};

		if (re.s && re.n) {
			re.s = false;
			re.n = false;
		}

		if (re.w && re.e) {
			re.w = false;
			re.e = false;
		}

		this.cache = re;

		return re;
	}
}
