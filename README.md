# La Suite: integration

Repo containing code of:

- [@gouvfr-lasuite/integration npm package](https://www.npmjs.com/package/@gouvfr-lasuite/integration) in [`packages/integration`](./packages/integration/)
- Frontend widgets in [`packages/widgets`](./packages/widgets/)
- [La Suite: integration docs and API](https://integration.lasuite.numerique.gouv.fr/) in [`website`](./website/)


## Local development

After checking out the repository, run:
```
$ make bootstrap
```

### Developing the website

```
$ make website-start
```

This will start the development server at [http://localhost:8930](http://localhost:8930).

View all available commands with:
```
$ make help
```

### Developing Widgets

We currently develop some embeddable widgets in the `packages/widgets` directory in this repository.

```
$ make widgets-start
```

This will start the development server at [http://localhost:8931](http://localhost:8931).

You can then build them with:

```
$ make widgets-build
```

And deploy them to an S3 bucket, with `.aws/{config|credentials}` files in the root of the repository.
```
$ WIDGETS_S3_PATH=xxx make widgets-deploy
```


## Licenses

Source code is released under the [MIT](LICENSES/MIT.txt) and other
contents are released under the [Open Licence 2.0](LICENSES/Etalab-2.0.txt).
