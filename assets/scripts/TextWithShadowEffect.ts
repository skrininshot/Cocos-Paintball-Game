import { _decorator, Component, Node, RichText } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TextWithShadowEffect')
export class TextWithShadowEffect extends Component {
    @property({type: RichText})
    text: RichText = null!;

    @property({type: RichText})
    shadowText: RichText = null!;
    
    SetText(text: string) {
        this.text.string = text;
        this.shadowText.string = text;
    }
}


