import React, {PureComponent} from 'react';
import manifest from '@neos-project/neos-ui-extensibility';
import CodeFormating from './codePlugin';
import {IconButton} from '@neos-project/react-ui-components';

class IconButtonComponent extends PureComponent {
    render() {
        const {formattingRule, inlineEditorOptions, i18nRegistry, tooltip, isActive, ...finalProps} = this.props;
        return (<IconButton {...finalProps} isActive={Boolean(isActive)} title={tooltip} />);
    }
}

const addPlugin = (Plugin, isEnabled) => (ckEditorConfiguration, options) => {
    if (!isEnabled || isEnabled(options.editorOptions, options)) {
        return {
            ...ckEditorConfiguration,
            plugins: [
                ...(ckEditorConfiguration.plugins || []),
                Plugin
            ]
        };
    }
    return ckEditorConfiguration;
};

manifest("main", {}, globalRegistry => {
    const richtextToolbar = globalRegistry.get('ckEditor5')?.get('richtextToolbar')
    const config = globalRegistry.get('ckEditor5')?.get('config')

    config.set('code', addPlugin(CodeFormating, editorOptions => editorOptions?.formatting?.code));

    richtextToolbar.set('code', {
        commandName: 'code',
        component: IconButtonComponent,
        callbackPropName: 'onClick',
        icon: 'code',
        hoverStyle: 'brand',
        tooltip: 'Code',
        isVisible: editorOptions => editorOptions?.formatting?.code,
        isActive: formattingUnderCursor => formattingUnderCursor?.code
    });
});
