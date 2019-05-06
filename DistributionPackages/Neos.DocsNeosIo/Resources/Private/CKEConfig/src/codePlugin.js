import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const CODE = 'code';

export default class SubSup extends Plugin {
    static get pluginName() {
        return 'Code';
    }
    init() {
        this.editor.model.schema.extend('$text', {allowAttributes: CODE});
        this.editor.conversion.attributeToElement({
            model: CODE,
            view: CODE
        });
        this.editor.commands.add(CODE, new AttributeCommand(this.editor, CODE));
    }
}
