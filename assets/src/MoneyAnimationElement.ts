import { _decorator, Component, Node, Vec2, math, Animation, SpriteRenderer, tween, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoneyAnimationElement')
export class MoneyAnimationElement extends Component {
    private onAnimationCompletedAction: (() => void) | null = null;
    private onHalfAnimationCompletedAction: (() => void) | null = null;
    
    private onAnimationCompleted() {
        if (this.onAnimationCompletedAction) {
            this.onAnimationCompletedAction();
            this.onAnimationCompletedAction = null;
        }
    }

    private onHalfAnimationCompleted() {
        if (this.onHalfAnimationCompletedAction) {
            this.onHalfAnimationCompletedAction();
            this.onHalfAnimationCompletedAction = null;
        }
    }
    
    startMoveAnimation(appearanceDuration: number, movingDuration: number, pauseDuration: number, disappearanceDuration: number, 
                       centerPosition: Vec3, scorePosition: Vec3, targetSize: Vec3, 
                       onHalfComplete?: () => void, onComplete?: () => void) {
        
        this.node.scale = new Vec3(0,0,0);
        this.onHalfAnimationCompletedAction = onHalfComplete;
        this.onAnimationCompletedAction = onComplete;
        
        tween(this.node)
            .delay(appearanceDuration) 
            .parallel(
                tween().to(movingDuration, { worldPosition: centerPosition }),
                tween().to(movingDuration, { rotation: new Quat() }),
                tween().to(movingDuration, { scale: new Vec3(targetSize) })
            )
            .delay(pauseDuration)
            .call(() => {
                this.onHalfAnimationCompleted();
            })
            .parallel(
                tween().to(disappearanceDuration, { worldPosition: scorePosition }),
                tween().to(disappearanceDuration, { scale: new Vec3(0,0,0) })
            )
            .call(() => {
                this.onAnimationCompleted();
            })
            .start();
    }
    
    hide(){
        this.node.scale = new Vec3(0,0,0);
    }
}


