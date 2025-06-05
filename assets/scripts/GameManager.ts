import { _decorator, Component, Node } from 'cc';
import {BallSpawner} from "db://assets/scripts/BallSpawner";
import {UIController} from "db://assets/scripts/UIController";
import {ScoreManager} from 'db://assets/scripts/ScoreManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({
        type: BallSpawner
    })
    ballSpawner: BallSpawner = null!;

    @property({
        type: UIController
    })
    uiController: UIController = null!;
    
    private gameStateIndex: number = 0;
    
    start() {
        this.node.parent?.getChildByName('UIControllerNode')?.on('button-clicked', this.handleButtonClick, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.on('bonus-score-updated', this.handleAddBonusScore, this);
        this.switchGameState(0);
    }

    onDestroy() {
        this.node.parent?.getChildByName('UIControllerNode')?.off('button-clicked', this.handleButtonClick, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('bonus-score-updated', this.handleAddBonusScore, this);
    }

    private handleButtonClick() {
        console.log('Событие "button-clicked" получено!');
        this.switchGameState(1);
    }
    
    private handleAddBonusScore() {
        console.log('Событие "bonus-score-added" получено!');
        this.switchGameState(2);
    }
    
    private switchGameState(index: number){
        this.gameStateIndex = index;
        
        switch (this.gameStateIndex) {
            //menu
            case 0:
                this.uiController.showPlayButton();
                break;
            //game
            case 1:
                this.uiController.hidePlayButton();
                this.ballSpawner.spawn();
                break;
            //win
            case 2:
                ScoreManager.instance.clearScore();
                this.ballSpawner.despawn();
                this.switchGameState(0);  //replace
                break;
        }
    }
}


