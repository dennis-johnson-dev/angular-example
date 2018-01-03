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

The master branch contains the "deep imports" method (`rxjs/operators/map`) which results in a small bundle size.

The "operators" branch refers to using `rxjs/operators` and this results in a larger bundle.

The usage of these imports is located in `src/client/app/services/data.service.ts`.
