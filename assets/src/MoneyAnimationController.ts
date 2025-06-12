import { _decorator, Component, Node, instantiate, Vec3, Prefab, CCInteger, tween, AudioSource } from 'cc';
import {MoneyAnimationElement} from './MoneyAnimationElement';
const { ccclass, property } = _decorator;

@ccclass('MoneyAnimationController')
export class MoneyAnimationController extends Component {

    @property(AudioSource)
    scoreUpSound: AudioSource = null!;
    
    @property(AudioSource)
    jackpotSound: AudioSource = null!;
    
    //actual nodes on the scene
    @property({type: Node})
    eur500LeftInstance: Node = null!;

    @property({type: Node})
    eur100LeftInstance: Node = null!;

    @property({type: Node})
    eur50CenterInstance: Node = null!;

    @property({type: Node})
    eur100RightInstance: Node = null!;

    @property({type: Node})
    eur500RightInstance: Node = null!;
    
    //prefabs to instantiate
    @property({type: Prefab})
    eur500Prefab: Prefab = null!;

    @property({type: Prefab})
    eur100Prefab: Prefab = null!;

    @property({type: Prefab})
    eur50Prefab: Prefab = null!;

    //center where to move money at first
    @property({type: Node})
    screenCenter: Node = null!;

    //center where to move money at last
    @property({type: Node})
    scorePosition: Node = null!;
    
    @property({type: Vec3})
    elementTargetSize: Vec3 = null!;

    @property({type: Node})
    elementContainer: Node = null!;
    
    @property
    elementMovingDuration: number = 0.2;

    @property
    elementPauseDuration: number = 1;
    
    //time before disappear
    @property
    elementDisappearanceDuration: number = 0.2;
    
    //money count for animation
    @property({type: CCInteger})
    animationElementsCount: number = 0;
    
    @property
    distanceBetweenElements: number = 0.1;
    
    //pool arrays
    private eur500Pool: MoneyAnimationElement[] = [];
    private eur100Pool: MoneyAnimationElement[] = [];
    private eur50Pool: MoneyAnimationElement[] = [];
    
    private activeMoneyPool: MoneyAnimationElement[] = [];
    
    private currentAnimationType: MoneyAnimationType = MoneyAnimationType.None;
    
    private onHalfAnimationCompleteAction: (() => void) | null = null;
    private onAnimationCompleteAction: (() => void) | null = null;
    
    start() {
        this.eur500Pool = new Array(this.animationElementsCount);
        this.eur100Pool =  new Array(this.animationElementsCount);
        this.eur50Pool=  new Array(this.animationElementsCount);
        
        for (let i = 0; i < this.animationElementsCount; i++) {
            const eur500Instance = instantiate(this.eur500Prefab);
            eur500Instance.parent = this.elementContainer;
            eur500Instance.active = false;
            this.eur500Pool[i] = eur500Instance.getComponent(MoneyAnimationElement);
            
            const eur100Instance = instantiate(this.eur100Prefab);
            eur100Instance.parent = this.elementContainer;
            eur100Instance.active = false;
            this.eur100Pool[i] = eur100Instance.getComponent(MoneyAnimationElement);
            
            const eur50Instance = instantiate(this.eur50Prefab);
            eur50Instance.parent = this.elementContainer;
            eur50Instance.active = false;
            this.eur50Pool[i] = eur50Instance.getComponent(MoneyAnimationElement);
        }

        this.eur500LeftInstance?.on('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Left500), this);
        this.eur100LeftInstance?.on('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Left100), this);
        this.eur50CenterInstance?.on('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Center50), this);
        this.eur100RightInstance?.on('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Right100), this);
        this.eur500RightInstance?.on('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Right500), this);
    }
    
    onDestroy()
    {
        this.eur500LeftInstance?.off('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Left500), this);
        this.eur100LeftInstance?.off('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Left100), this);
        this.eur50CenterInstance?.off('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Center50), this);
        this.eur100RightInstance?.off('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Right100), this);
        this.eur500RightInstance?.off('award-collider-triggered', ()=> this.setAnimationType(MoneyAnimationType.Right500), this);
    }
    
    setAnimationType(animationType: MoneyAnimationType){
        this.currentAnimationType = animationType;
    }
    
    startAnimation(onComplete: () => void, onHalfComplete?: () => void){
        this.onAnimationCompleteAction = onComplete;
        this.onHalfAnimationCompleteAction = onHalfComplete;
        
        this.jackpotSound.play();
        
        let startPosition: Vec3;
        
        switch (this.currentAnimationType){
            case MoneyAnimationType.None:
                this.onHalfAnimationCompleted();
                return;
                
            case MoneyAnimationType.Left500:
                this.activeMoneyPool = Array.from(this.eur500Pool);
                startPosition = this.eur500LeftInstance.worldPosition;
                break;
                
            case MoneyAnimationType.Left100:
                this.activeMoneyPool = Array.from(this.eur100Pool);
                startPosition = this.eur500LeftInstance.worldPosition;
                break;
                
            case MoneyAnimationType.Center50:
                this.activeMoneyPool = Array.from(this.eur50Pool);
                startPosition = this.eur50CenterInstance.worldPosition;
                break;
                
            case MoneyAnimationType.Right100:
                this.activeMoneyPool = Array.from(this.eur100Pool);
                startPosition = this.eur100RightInstance.worldPosition;
                break;
                
            case MoneyAnimationType.Right500:
                this.activeMoneyPool = Array.from(this.eur500Pool);
                startPosition = this.eur500RightInstance.worldPosition;
                break;
        }

        let offsetY = 0.5 * (this.animationElementsCount * this.distanceBetweenElements);

        for (let i = 0; i < this.activeMoneyPool.length; i++) {
            this.activeMoneyPool[i].node.active = true;
            this.activeMoneyPool[i].node.setWorldPosition(startPosition.x, startPosition.y, startPosition.z);
            this.activeMoneyPool[i].node.eulerAngles.set(this.eur500LeftInstance.eulerAngles);
            this.activeMoneyPool[i].node.setSiblingIndex(i - this.activeMoneyPool.length);
            
            let offsetPosition = new Vec3(0, offsetY - (i * this.distanceBetweenElements));
            let screenCenterPosition = new Vec3(this.screenCenter.worldPosition).add(offsetPosition);
            let scorePosition = new Vec3(this.scorePosition.worldPosition);
            
            let valueOffset = (i + 1);

            let onHalfComplete: () => void = null;
            let onComplete: () => void = null;
            
            if (i == 0){
                onHalfComplete = this.onHalfAnimationCompleted.bind(this);
            }
            
            if (i == this.activeMoneyPool.length - 1) {
                onComplete = this.onAnimationCompleted.bind(this);
            }
            
            this.activeMoneyPool[i].startMoveAnimation(
                this.elementMovingDuration * valueOffset,
                this.elementMovingDuration,
                this.elementPauseDuration,
                this.elementDisappearanceDuration * valueOffset,
                screenCenterPosition, 
                scorePosition, 
                this.elementTargetSize,
                onHalfComplete,
                onComplete);
        }
    }
    
    private onAnimationCompleted(){
        for (let i = 0; i < this.activeMoneyPool.length; i++) {
            this.activeMoneyPool[i].hide();
            this.activeMoneyPool[i].node.active = false;
        }
        
        if (this.onAnimationCompleteAction) {
            this.onAnimationCompleteAction();
            this.onAnimationCompleteAction = null;
        }
    }

    private onHalfAnimationCompleted(){
        this.scoreUpSound.play();

        if (this.onHalfAnimationCompleteAction) {
            this.onHalfAnimationCompleteAction();
            this.onHalfAnimationCompleteAction = null;
        }
    }
}

enum MoneyAnimationType
{
    None,
    Left500,
    Left100,
    Center50,
    Right100,
    Right500
}