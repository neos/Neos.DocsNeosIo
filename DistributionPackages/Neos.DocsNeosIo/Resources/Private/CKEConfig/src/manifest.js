import manifest from '@neos-project/neos-ui-extensibility';
import {$get} from 'plow-js'

manifest("main", {}, globalRegistry => {
    const ckEditorRegistry = globalRegistry.get("ckEditor5");
    const richtextToolbar = ckEditorRegistry.get("richtextToolbar");
    const config = ckEditorRegistry.get("config");

    //
    // @see https://docs.ckeditor.com/ckeditor5/latest/features/headings.html#configuring-heading-levels
    // The element names for the heading dropdown are coming from richtextToolbar registry
    //
    config.set("addCodeToHeading", (ckeConfig, {editorOptions}) => {
        if ($get("formatting.code", editorOptions)) {
            ckeConfig.heading.options.push({
				model: "code",
				view: {
					name: "code"
				},
				converterPriority: "high"
			});
        }
        return ckeConfig;
    });

    richtextToolbar.set("style/code", {
        commandName: "heading",
        commandArgs: [
            {
                value: "code"
            }
        ],
        label: "Code",
        isVisible: $get("formatting.code"),
        isActive: formattingUnderCursor =>
            $get("heading", formattingUnderCursor) === "code"
    });
});
