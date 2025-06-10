import { _decorator, Component, Node, Prefab, instantiate, randomRange, RigidBody2D, Vec2, ERigidBody2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallSpawner')
export class BallSpawner extends Component {
    @property({ type: Prefab })
    ballPrefab: Prefab = null!;

    @property({ type: Node })
    spawnContainer: Node = null!;
    
    @property
    public spawnDistanceRange = 1;
    
    @property
    public startVelocity: Vec2 = null!;
    
    ballInstance: Node = null!;
    ballRigid: RigidBody2D = null!;

    spawn() {
        this.ballInstance = instantiate(this.ballPrefab);
        this.spawnContainer.addChild(this.ballInstance);
        
        const rigidBody =  this.ballInstance.getComponent(RigidBody2D);
        if (rigidBody) {
            this.ballRigid = rigidBody;
            this.ballRigid.linearVelocity = new Vec2(this.startVelocity);
        }

        const randomPosition = randomRange(-this.spawnDistanceRange, this.spawnDistanceRange);
        console.log(`random position: ${randomPosition}`);
        
        this.ballInstance.setPosition(randomPosition, 0);
        console.log(`ballInstance position: ${this.ballInstance.position}`);
    }

    despawn() {
        if (this.ballInstance){
            this.ballInstance.destroy();
        }
    }
    
/*
    start() {
        this.ballInstance = instantiate(this.ballPrefab);
        this.node.addChild(this.ballInstance);
        this.ballInstance.position.set(0, 0);
        this.ballInstance.active = false;
        
        const rigidBody =  this.ballInstance.getComponent(RigidBody2D);
        if (rigidBody) {
            this.ballRigid = rigidBody;
        }
    }

    spawn(): void {
        this.ballInstance.active = true;
        
        if (this.ballRigid) {
            this.ballRigid.wakeUp();
            this.ballRigid.linearVelocity = new Vec2(this.startVelocity);
        }

        const randomPosition = randomRange(-this.spawnDistanceRange, this.spawnDistanceRange);
        this.ballInstance.position.set(randomPosition, 0);
    }

    despawn() {
        this.ballInstance.active = false;
        
        if(this.ballRigid){
            
            this.ballRigid.linearVelocity = new Vec2(0, 0);
            this.ballRigid.angularVelocity = 0;
            this.ballRigid.sleep();
        }
    }
    */
}


