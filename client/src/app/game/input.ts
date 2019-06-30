export interface InputData {
	n: boolean;
	s: boolean;
	e: boolean;
	w: boolean;
	jump: boolean;
}

export class Input {

	static cache: any = false;

	static stat: InputData = {
		n: false,
		s: false,
		e: false,
		w: false,
		jump: false,
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
	};

	static key(code: number, down: boolean) {

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
