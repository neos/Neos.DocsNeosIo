import manifest from '@neos-project/neos-ui-extensibility';

manifest("Neos.DocsNeosIo:CKEConfig", {}, globalRegistry => {
    const config = globalRegistry.get('ckEditor5').get('config');

    config.set('codeBlockLanguages', (config, {editorOptions}) => {
        if (!editorOptions?.formatting) {
            return config;
        }
        const {formatting} = editorOptions;

        // TODO once https://github.com/neos/neos-ui/pull/4185 is merged removed this plugin and use the natively supported option
        return {
            ...config,
            codeBlock: {
                languages: formatting.codeBlockLanguages || [{
                    language: 'plaintext',
                    label: 'Plain text',
                    class: ''
                }]
            }
        }
    });
});

