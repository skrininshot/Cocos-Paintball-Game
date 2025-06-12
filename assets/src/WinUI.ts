import { _decorator, Component, Animation, AudioSource } from 'cc';
import {TextWithShadowEffect} from "./TextWithShadowEffect";
import {ScoreManager} from "./ScoreManager";
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
    
    @property({ type: Animation })
    animation: Animation = null!;

    @property({ type: TextWithShadowEffect })
    totalBonusText: TextWithShadowEffect = null!;

    @property([AudioSource])
    audioSources: AudioSource[] = [];
    
    @property
    firstPrefix = '€';

    @property
    lastPrefix = '.00';

    start() {
        this.animation.on(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    }
    
    onDestroy(){
        this.animation.off(Animation.EventType.FINISHED, this.onAnimationFinished, this);
    }
    
    private onAnimationFinished(){
        this.playStopSound(false);
        this.node.emit('animation-completed');
    }
    
    startAnimation(){
        this.animation.play();
        this.playStopSound(true);
        this.totalBonusText.SetText(this.firstPrefix + ScoreManager.instance.getTotalScore().toString() + this.lastPrefix);
    }
    
    private playStopSound(play: boolean){
        for (let i = 0; i < this.audioSources.length; ++i) {
            let audioSource = this.audioSources[i];
            
            if (play) {
                audioSource.play();
            }
            else{
                audioSource.stop()
            }
        }
    }
}


