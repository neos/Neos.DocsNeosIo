<p align="center">
	<a href="http://neos.io">
		<img src="DistributionPackages/Neos.DocsNeosIo/Resources/Public/Frontend/img/neos_primary.svg" width="150">
	</a>
</p>

<h3 align="center"><a href="http://docs.neos.io">Neos Documentation</a></h3>

> The official docs.neos.io website package.

This code is based on the [Neos-Skeleton](https://github.com/code-q-web-factory/Neos-Skeleton) and the [Neos Best-Practices 1.0.0](https://www.neos.io/blog/neos-best-practices-1-0.html).

## Local Setup & Installation (Event-Sourced)

1. Clone the repository: `git clone https://github.com/neos/Neos.DocsNeosIo.git .`
1. Checkout Git branch `git checkout event-sourced`
1. Install composer dependencies: `composer install`
1. Configure your DB credentials in `Configuration/Settings.yaml`
1. Run doctrine migrations: `./flow doctrine:migrate`
1. Import site (legacy import): `./flow site:import --package-key Neos.DocsNeosIo`
1. Convert imported site to corresponding events: `./flow contentrepositorymigrate:run`
1. Replay core projections so that they are up-to-date:
   1. `./flow projection:replay change`
   1. `./flow projection:replay nodehiddenstate`
1. Start the development server: `./flow server:run`

Finally you need to use the latest version of the `neos-ui`:

```
cd Packages/Application/Neos.Neos.Ui
make setup
```

Don't forget to enable the `frontendDevelopmentMode` in `Settings.yaml`:

```yaml
Neos:
  Neos:
    Ui:
      frontendDevelopmentMode: true
```

Now you should be able to navigate the frontend of the site at http://localhost:8081

To get access to the backend, you can create a Neos user account via:

```
./flow user:create --roles Administrator admin password Firstname Lastname
```
