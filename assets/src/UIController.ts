import { _decorator, Component, Node, Button, Sprite } from 'cc';
import {TextWithShadowEffect} from "./TextWithShadowEffect";
import {WinUI} from "./WinUI";
import {ScoreManager} from "./ScoreManager";
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

    @property({type: Node})
    playButtonPressTip: Node = null!;

    @property({type: WinUI})
    winUI: WinUI = null!;
    
    winUIOnAnimationComplete: (() => void) | null = null;

    start() {
        this.playButton.node.on(Button.EventType.CLICK, this.onButtonClicked, this);
        this.winUI.node.on('animation-completed', this.onWinUIAnimationComplete, this);

        ScoreManager.instance?.node.on('multiplier-score-updated', this.updateMultiplierScoreText, this);
        ScoreManager.instance?.node.on('bonus-score-updated', this.updateBonusScoreText, this);

        this.winUI.node.active = false;
    }
    
    onDestroy(){
        this.playButton.node.off(Button.EventType.CLICK, this.onButtonClicked, this);
        this.winUI.node.off('animation-completed', this.onWinUIAnimationComplete, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('multiplier-score-updated', this.updateMultiplierScoreText, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('bonus-score-updated', this.updateBonusScoreText, this);
    }
    
    activateButton() {
        this.playButton.interactable = true;
        this.playButtonPressTip.active = true;
    }
    
    deactivateButton() {
        this.playButton.interactable = false;
        this.playButtonPressTip.active = false;
    }
    
    startWinUIAnimation(onComplete: () => void){
        this.winUIOnAnimationComplete = onComplete;
        this.winUI.node.active = true;
        this.winUI.startAnimation();
        
    }
    
    private onWinUIAnimationComplete(){
        this.winUI.node.active = false;
        
        if (this.winUIOnAnimationComplete) {
            this.winUIOnAnimationComplete();
        }
    }
    
    private updateBonusScoreText(text: any){
        this.bonusScoreText.SetText(this.bonusScorePrefix + text.toString())
    }

    private updateMultiplierScoreText(text: any){
        this.multiplierScoreText.SetText(this.multiplierScorePrefix + text.toString())
    }
    
    private onButtonClicked() {
        this.node.emit('button-clicked');
    }
}


