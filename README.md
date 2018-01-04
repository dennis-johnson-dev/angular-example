# Tree Shaking Example

This _repro_-sitory demonstrates challenges in properly "tree shaking" RxJS [lettable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/lettable-operators.md).

In this example repo, we have a couple of branches to demonstrate the different cases.

The idea we are after is to be able to import operators like the following:

```js
import { map } from "rxjs/operators";
```

instead of:

```js
import { map } from "rxjs/operators/map";
```

While NOT affecting build size.

The master branch contains the "deep imports" method (`rxjs/operators/map`) which results in a smaller bundle size.

The "operators" branch refers to using `rxjs/operators` and this results in a larger bundle.

The usage of these imports is located in `src/client/app/services/data.service.ts`.

### Running Example

```js
yarn install
```

You can run a prod build:

```js
yarn build
```

Then inspect the bundle

```js
npx source-map-explorer ./lib/resources/app<some-hash>.js
```

On the master branch, you shouldn't see a significant RxJS source.

![Alt text](doc/deep_import.png?raw=true)

On the operators branch, you should see a significant RxJS source (operators branch).

![Alt text](doc/operators.png?raw=true)

Without vendor chunking at all, we see the same issue (no_chunking branch):

![Alt text](doc/no_chunking.png?raw=true)

Without vendor chunking and with AOT compilation, we see the same issue (aot branch):

![Alt text](doc/aot.png?raw=true)

Without vendor chunking and with AOT compilation, but with using deep imports, we see a 40Kb drop in size related to RxJS. This is using the `import { map } from 'rxjs/operators/map'` import syntax.

![Alt text](doc/aot_deep_imports.png?raw=true)

### Webpack

For setting up tree shaking, I've done the following:

* utilized the rxjs path mapping (es5)
* output "esnext" module format from TypeScript compiler
* added webpack.optimize.ModuleConcatenationPlugin()
* using new (ES friendly) uglifyjs-webpack-plugin
* using @angular-devkit/build-optimizer/webpack-loader
* using PurifyPlugin
* am NOT using explicit vendor chunking (am using commons chunk though)
