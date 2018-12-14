<p align="center">
	<a href="http://neos.io">
		<img src="DistributionPackages/Neos.DocsNeosIo/Resources/Public/Frontend/img/neos_primary.svg" width="150">
	</a>
</p>

<h3 align="center"><a href="http://docs.neos.io">Neos Documentation</a></h3>

> The official docs.neos.io website package.

## Setup & Installation

Clone the repository, and setup Neos as always.

For Elaticsearch you need to configure the default client, see [Settings.Search.yaml](https://github.com/neos/Neos.DocsNeosIo/blob/master/DistributionPackages/Neos.DocsNeosIo/Configuration/Development/Settings.Search.yaml#13).
Then run `./flow nodeindex:build --workspace="live"`. On Flownative Beach this is done automatically.