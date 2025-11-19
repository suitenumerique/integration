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

For both the website and the widgets projects, it will install dependencies, build, and start the development server, respectively at http://localhost:8930 and http://localhost:8931.

To see dev server outputs, run:
```
$ make logs
```

You can view all available commands with:
```
$ make help
```

### Developing the website

If you want a faster startup than `make bootstrap`, you can run more focused commands. For the website:

```
$ make website-start
```

This will start the development server at [http://localhost:8930](http://localhost:8930).

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
