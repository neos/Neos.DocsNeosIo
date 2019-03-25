import React, {PureComponent} from 'react';
import manifest from "@neos-project/neos-ui-extensibility";
import {IconButton} from '@neos-project/react-ui-components';
import {$get, $add} from 'plow-js';
import {neos} from '@neos-project/neos-ui-decorators';

import BgPrimaryPlugin from './bgPrimaryPlugin';

const addPlugin = (Plugin, isEnabled) => (ckEditorConfiguration, options) => {
	if (!isEnabled || isEnabled(options.editorOptions, options)) {
		ckEditorConfiguration.plugins = ckEditorConfiguration.plugins || [];
		return $add('plugins', Plugin, ckEditorConfiguration);
	}
	return ckEditorConfiguration;
};

manifest("main", {}, globalRegistry => {
	const ckEditorRegistry = globalRegistry.get("ckEditor5");
	const richtextToolbar = ckEditorRegistry.get("richtextToolbar");
	const config = ckEditorRegistry.get('config');

	config.set('bgPrimary', addPlugin(BgPrimaryPlugin, $get('formatting.bgSecondary')));

	richtextToolbar.set('bgPrimary', {
		commandName: 'bgPrimary',
		component: IconButton,
		callbackPropName: 'onClick',
		icon: 'code',
		hoverStyle: 'brand',
		tooltip: 'Format as code',
		isVisible: $get('formatting.bgPrimary'),
		isActive: $get('bgPrimary')
	});
});

