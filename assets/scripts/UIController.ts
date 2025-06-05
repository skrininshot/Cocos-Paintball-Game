import { _decorator, Component, Node, Button, Sprite } from 'cc';
import {TextWithShadowEffect} from "db://assets/scripts/TextWithShadowEffect";
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {
    @property({type: Button})
    playButton: Button = null!;

    @property({type: TextWithShadowEffect})
    bonusScoreText: TextWithShadowEffect = null!;

    @property
    bonusScorePrefix = '€';

    @property({type: TextWithShadowEffect})
    multiplierScoreText: TextWithShadowEffect = null!;

    @property
    multiplierScorePrefix = 'X';
    
    start() {
        this.playButton.node.on(Button.EventType.CLICK, this.onButtonClicked, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.on('multiplier-score-updated', this.updateMultiplierScoreText, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.on('bonus-score-updated', this.updateBonusScoreText, this);
    }
    
    onDestroy(){
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('multiplier-score-updated', this.updateMultiplierScoreText, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('bonus-score-updated', this.updateBonusScoreText, this);
    }
    
    showPlayButton() {
        this.playButton.node.active = true;
    }
    
    hidePlayButton() {
        this.playButton.node.active = false;
    }
    
    private updateBonusScoreText(text: any){
        this.bonusScoreText.SetText(this.bonusScorePrefix + text.toString())
    }

    private updateMultiplierScoreText(text: any){
        this.multiplierScoreText.SetText(this.multiplierScorePrefix + text.toString())
    }
    
    onButtonClicked() {
        console.log('Кнопка нажата!');
        this.node.emit('button-clicked');
    }
}


