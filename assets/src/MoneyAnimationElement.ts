import { _decorator, Component, Node, Vec2, math, Animation, SpriteRenderer, tween, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoneyAnimationElement')
export class MoneyAnimationElement extends Component {
    private onAnimationCompletedAction: (() => void) | null = null;
    
    private onAnimationCompleted() {
        if (this.onAnimationCompletedAction) {
            this.onAnimationCompletedAction();
            this.onAnimationCompletedAction = null;
        }
    }
    
    startMoveAnimation(appearanceDuration: number, movingDuration: number, disappearanceDuration: number, 
                       targetPosition: Vec3, targetSize: Vec3, onComplete?: () => void) {
        this.node.scale = new Vec3(0,0,0);
        this.onAnimationCompletedAction = onComplete;
        
        tween(this.node)
            .delay(appearanceDuration) 
            .parallel(
                tween().to(movingDuration, { worldPosition: targetPosition }),
                tween().to(movingDuration, { rotation: new Quat() }),
                tween().to(movingDuration, { scale: new Vec3(targetSize) })
            )
            .delay(disappearanceDuration)
            .to(0.5, { scale: new Vec3(0, 0, 0) })
            .call(() => {
                this.onAnimationCompleted();
            })
            .start();
    }
}


