import { _decorator, Component, Node, Button, Sprite, tween } from 'cc';
import {TextWithShadowEffect} from "./TextWithShadowEffect";
import {WinUI} from "./WinUI";
import {ScoreManager} from "./ScoreManager";
import {MoneyAnimationController} from "./MoneyAnimationController";
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

    @property({type: MoneyAnimationController})
    moneyAnimationController: MoneyAnimationController = null!;

    @property({type: WinUI})
    winUI: WinUI = null!;

    onAnimationCompleteAction: (() => void) | null = null;

    start() {
        this.playButton.node.on(Button.EventType.CLICK, this.onButtonClicked, this);
        this.winUI.node.on('animation-completed', this.onAnimationComplete, this);

        ScoreManager.instance?.node.on('multiplier-score-updated', this.updateMultiplierScoreText, this);
        this.winUI.node.active = false;
    }
    
    onDestroy(){
        this.playButton.node.off(Button.EventType.CLICK, this.onButtonClicked, this);
        this.winUI.node.off('animation-completed', this.onAnimationComplete, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('multiplier-score-updated', this.updateMultiplierScoreText, this);
    }
    
    activateButton() {
        this.playButton.interactable = true;
        this.playButtonPressTip.active = true;
    }
    
    deactivateButton() {
        this.playButton.interactable = false;
        this.playButtonPressTip.active = false;
    }
    
    startAnimation(onComplete: () => void){
        this.onAnimationCompleteAction = onComplete;
        this.moneyAnimationController.startAnimation(this.startWinUIAnimation.bind(this), 
            this.startTotalScoreAnimation.bind(this));
    }
    
    startWinUIAnimation() {
        this.winUI.node.active = true;
        this.winUI.startAnimation();
    }

    startTotalScoreAnimation() {
        const temp = { score: 0 };

        tween(temp)
            .to(1, { score: ScoreManager.instance.getTotalScore() }, {
                onUpdate: () => {
                    this.updateBonusScoreText(Math.floor(temp.score));
                }
            })
            .start();
    }
    
    private onAnimationComplete(){
        this.winUI.node.active = false;
        
        if (this.onAnimationCompleteAction) {
            this.onAnimationCompleteAction();
            this.onAnimationCompleteAction = null;
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


