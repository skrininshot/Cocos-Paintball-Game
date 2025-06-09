import { _decorator, Component, Collider2D, Contact2DType, AudioSource, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BouncyBall')
export class BouncyBall extends Component {
    
    @property ({type: AudioSource})
    audio: AudioSource = null!;

    ballRigid: RigidBody2D = null!;
    
    onLoad() {
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        
        this.ballRigid = this.getComponent(RigidBody2D);
    }
    
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        this.audio.play();
    }
}

