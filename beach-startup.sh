#!/bin/bash

/application/flow cache:flushone Neos_Fusion_Content
/application/flow resource:publish --collection='static'

# generate a new Elasticsearch index every time, since node types might have changed
#./flow nodeindex:build --workspace="live"
