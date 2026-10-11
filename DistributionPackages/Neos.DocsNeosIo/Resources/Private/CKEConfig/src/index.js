import manifest from '@neos-project/neos-ui-extensibility';

manifest("Neos.DocsNeosIo:CKEConfig", {}, globalRegistry => {
    const config = globalRegistry.get('ckEditor5').get('config');

    config.set('codeBlockLanguages', (config, {editorOptions}) => {
        if (!editorOptions?.formatting) {
            return config;
        }
        const {formatting} = editorOptions;

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

