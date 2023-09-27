 # Cambaz
Cambaz is new SPA framework.
Cambaz's syntax is like class-based React.

**Table of Contents**:
+ [Get Started](#get-started)
+ [Contributing](#contributing)
  + [Contributers](#contributers)
+ [License](#license)

## Get Started

```js
import { CambazComponent, App } from 'cambaz'

class AppComponent extends CambazComponent{

  count= 0;

  increseCount(){
    this.count++;
  }

  template(){
    return `
      <h1>Welcome To Cambaz</h1>
      <p> count is <strong> {{ count }} </strong> </p>
      <button onclick="increseCount"> count++ </button>
    `;
  }
};

// entry point selector(id), main component
App.init('app', AppComponent);

```

> [!WARNING]
> This is an expremental project
> **DO NOT** use in real world.

## Contributing
> TODO

### Contributers
> TODO

## License
This project is under the [MIT license](./LICENSE).

