import Logger from './logger';

const Attributes = {
	OnClick: 'clicked',
};

const ReservedComponentKeys = {
	Template: 'template',
	render: 'render'
}

interface ProxyDataType {
	[key: string | symbol]: any
	value: any;
}

class Component {
	[key: string | symbol]: any;
	html: HTMLElement;

	constructor() {

		// chech component has reserved keys

		// this.html = this.render();
		this.html = document.createElement('div'); 

		let props = this.data();
		for (const key in props) {
			this[key] = new Proxy({ value: props[key], toPrimitive() { return this.value } } as ProxyDataType, {
				get(target, key) {
					let data = undefined;
					if (typeof key === 'symbol') {
						data = target.toPrimitive;
					} else {
						data = key === 'value' ? target.value : target.value[key]()
					}
					console.log('get', { type: typeof key, target, key, data });
					return data;
				},
				set(target, key, value) {
					console.log(arguments);
					target[key].value = value;

					App.rerender();
					return true
				}
			});
		}
		console.log(this);

	}

	render() {
		let el = document.createElement('div');
		el.innerHTML = this.#replaceValues(this.template());
		this.#addEvents(el);
		return el
	}

	#addEvents(el: HTMLElement) {
		let onClicks = el.querySelectorAll(`[${Attributes.OnClick}]`);

		onClicks.forEach(el => {
			let methodName = el.getAttribute(Attributes.OnClick);
			if (!methodName || methodName === 'null') {
				return;
			}

			el.addEventListener('click', () => {
				// @ts-ignore
				if (typeof this[methodName] !== 'function') {
					return;
				}
				// @ts-ignore
				this[methodName]();
			});
		});

		return el
	}

	addListeners(el: HTMLElement) {
		return this.#addEvents(el)
	}

	replaceValues(code: string) {
		return this.#replaceValues(code)
	}

	#replaceValues(code: string): string {
		const regex = /{{(.*?)}}/g;
		const propNames = [];
		let match;

		while ((match = regex.exec(code)) !== null) {
			propNames.push(match[1]);
		}

		propNames.forEach(prop => {
			//@ts-ignore
			console.log({ prop, t: this, tp: this[prop.trim()] });

			code = code.replaceAll(`{{${prop}}}`, this[prop.trim()])
		});
		return code;
	}

	template(): string {
		throw new Error('Method not implemented.');
	}
};

class AppComponent extends Component {

	constructor() {
		super();
		this.data.count = 25;
	}


	increseCount() {
		console.log('increseCount girdi')
		this.data.count++;


	}

	goToAbout() {
		App.goTo('/about')
	}

	goToHome() {
		App.goTo('/home')
	}
	template() {
		return `
      <h1>Welcome To Cambaz</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button clicked="increseCount"> count++ </button>
			<button clicked="goToAbout"> About </button>
      <button clicked="goToHome"> Home </button>
    `;
	}
};


class AppComponent2 extends Component {

	constructor() {
		super();
	}

	data() {
		return {
			count: 25
		}
	}

	increseCount() {
		console.log('increseCount girdi')
		console.log(this);
	}

	goToAbout() {
		App.goTo('/about')
	}

	goToHome() {
		App.goTo('/home')
	}
	template() {
		return `
      <h1>Welcome To Cambaz</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button clicked="increseCount"> count++ </button>
			<button clicked="goToAbout"> About </button>
      <button clicked="goToHome"> Home </button>
    `;
	}
};

class Home extends Component {
	constructor() {
		super();
	}
	count = 31;

	increseCount() {
		console.log('increseCount girdi')
		this.count++;

	}

	goToAbout() {
		App.goTo('/about')
	}



	template() {
		return `
      <h1>Home</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button clicked="increseCount"> count++ </button>
      <button clicked="goToAbout"> About </button>
    `;
	}
};

class About extends Component {
	constructor() {
		super();
	}
	count = 31;

	increseCount() {
		console.log('increseCount girdi')
		this.count++;

	}

	goToHome() {
		App.goTo('/home')
	}


	template() {
		return `
      <h1>About</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button clicked="increseCount"> count++ </button>
      <button clicked="goToHome"> Home </button>
    `;
	}
};

class App {
	static rootSelector: string;
	static routes = []
	static rootComp: Component | undefined;
	static init(selector: string, componentCtor: typeof Component) {
		if (!selector) {
			Logger.error(`Entry selector cant be empty!`)
			return;
		}
		if (!componentCtor) {
			Logger.error(`Entry component cant be empty!`)
			return;
		}
		this.rootSelector = selector;
		let app = document.getElementById(selector) as HTMLElement;
		if (!app) {
			Logger.error(`Entry component not found wit this selector: "${selector}"`)
			return;
		}

		let component = new componentCtor();
		this.rootComp = component;
		component.html = component.render();

		app.appendChild(component.html);
	}
	static rerender() {
		if (!this.rootComp) {
			Logger.log('Root is empty')
			return;
		}

		let entry = document.getElementById(this.rootSelector) as HTMLElement;
		entry.innerHTML = '';
		entry.appendChild(this.rootComp.render())
	}

	static registerRoutes(routes: any) {
		this.routes = routes
	}

	static goTo(route: string) {
		// @ts-ignore
		this.rootComp = new ((this.routes.find((r) => r.path == route)).component)()

		// document.location.pathname = route;
		this.rerender()
	}
}
// @ts-ignore
window.onload = () => {
	setTimeout(() => {
		App.registerRoutes([{
			path: '/home',
			component: Home,
		}, {
			path: '/about',
			component: About,
		},])
		App.init('app', AppComponent2);
	}, 100)
}
