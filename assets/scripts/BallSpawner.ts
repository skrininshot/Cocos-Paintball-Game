import { _decorator, Component, Node, Prefab, instantiate, randomRange, RigidBody2D, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BallSpawner')
export class BallSpawner extends Component {
    @property({
        type: Prefab
    })
    ballPrefab: Prefab = null!;
    @property
    public spawnDistanceRange = 1;
    
    ballInstance: Node = null!;
    ballRigid: RigidBody2D = null!;

    start() {
        this.ballInstance = instantiate(this.ballPrefab);
        this.node.addChild(this.ballInstance);
        this.ballInstance.position.set(0, 0);
        this.ballInstance.active = false;
        
        const rigidBody =  this.ballInstance.getComponent(RigidBody2D);
        if (rigidBody) {
            this.ballRigid = rigidBody;
            this.ballRigid.sleep();
        }
    }
    
    spawn() {
        if (this.ballRigid) {
            this.ballRigid.linearVelocity = new Vec2(0,0);
            this.ballRigid.wakeUp();
        }
        
        const randomPosition = randomRange(-this.spawnDistanceRange, this.spawnDistanceRange);
        this.ballInstance.position.set(randomPosition, 0);
        this.ballInstance.active = true;
    }
    
    despawn() {
        this.ballInstance.active = false;
        
        if (this.ballRigid) {
            this.ballRigid.sleep();
        }
    }
}


