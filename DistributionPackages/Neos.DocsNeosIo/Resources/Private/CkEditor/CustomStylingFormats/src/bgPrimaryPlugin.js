import {Plugin} from 'ckeditor5-exports';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const BG_PRIMARY = 'bgPrimary';

export default class BackgroundPrimary extends Plugin {
    static get pluginName () {
        return 'bgPrimary';
    }
    init () {
        this.editor.model.schema.extend('$text', {allowAttributes: BG_PRIMARY});
        this.editor.conversion.attributeToElement({
            model: BG_PRIMARY,
            view: {
                classes: 'bg-primary'
            },
        });
        this.editor.commands.add(BG_PRIMARY, new AttributeCommand(this.editor, BG_PRIMARY));
    }
}
