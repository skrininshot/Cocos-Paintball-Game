import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelObstaclesController')
export class LevelObstaclesController extends Component {
    
    @property({ type: Node })
    fakeWall: Node = null!;
    
    private fakeWallIsActive: boolean;
    
    start() {
        this.setFakeWall(false);
    }
    
    setFakeWall(active: boolean) {
        this.fakeWall.active = active;
        this.fakeWallIsActive = active;
    }
    
    getFakeWallIsActive(): boolean {
        return this.fakeWallIsActive;
    }
}


