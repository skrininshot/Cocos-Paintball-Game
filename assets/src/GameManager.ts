import { _decorator, Component, Node, randomRange } from 'cc';
import {BallSpawner} from "./BallSpawner";
import {UIController} from "./UIController";
import {ScoreManager} from './ScoreManager';
import {LevelObstaclesController} from "./LevelObstaclesController";
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({
        type: BallSpawner
    })
    ballSpawner: BallSpawner = null!;
    
    @property
    ballLifeDuration: number = 5;
    
    private ballLifeTimer: number = 0.5;
    
    private lastMultiplierScore: number = 0;
    
    @property({
        type: UIController
    })
    uiController: UIController = null!;
    
    @property({type: LevelObstaclesController})
    levelObstaclesController = null!;
    
    @property
    fakeWallTimerRandom: number = 3;
    
    private fakeWallTimer: number = 0;
    
    private gameStateIndex: GameStates = GameStates.Menu;
    
    start() {
        this.node.parent?.getChildByName('UIControllerNode')?.on('button-clicked', this.handleButtonClick, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.on('multiplier-score-updated', this.handleAddMultiplierScore, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.on('award-reached', this.handleAddBonusScore, this);
        this.switchGameState(GameStates.Menu);
    }

    onDestroy() {
        this.node.parent?.getChildByName('UIControllerNode')?.off('button-clicked', this.handleButtonClick, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('multiplier-score-updated', this.handleAddMultiplierScore, this);
        this.node.parent?.getChildByName('ScoreManagerNode')?.off('award-reached', this.handleAddBonusScore, this);
    }

    private handleButtonClick() {
        this.switchGameState(GameStates.Play);
    }
    
    private handleAddBonusScore() {
        this.switchGameState(GameStates.Win);
    }
    
    private switchGameState(index: GameStates){
        this.gameStateIndex = index;
        
        switch (this.gameStateIndex) {
            case GameStates.Menu:
                this.uiController.activateButton();
                break;
                
            case GameStates.Play:
                this.uiController.deactivateButton();
                this.ballSpawner.spawn();
                this.ballLifeTimer = 0;
                
                this.levelObstaclesController.setFakeWall(true);
                this.fakeWallTimer = randomRange(-this.fakeWallTimerRandom, this.fakeWallTimerRandom);
                break;

            case GameStates.Win:
                this.ballSpawner.despawn();
                this.uiController.startWinUIAnimation(this.onWinUIAnimationComplete.bind(this))
                break;
                
            case GameStates.Restart:
                ScoreManager.instance.clearScore();
                this.ballSpawner.despawn();
                this.switchGameState(0);
                break;
        }
    }
    
    update(delta: number) {
        switch (this.gameStateIndex) {
            case GameStates.Play: { 
                this.handleBallLifeTimer(delta); 
                this.handleFakeWallTimer(delta);
            }
        }
    }
    
    private handleBallLifeTimer(delta: number){
        this.ballLifeTimer += delta;

        if (this.ballLifeTimer > this.ballLifeDuration){
            this.switchGameState(GameStates.Restart);
        }
    }

    private handleFakeWallTimer(delta: number){
        this.fakeWallTimer -= delta;
        
        if (this.fakeWallTimer <= 0 && this.levelObstaclesController.getFakeWallIsActive()){
            this.levelObstaclesController.setFakeWall(false);
        }
    }
    
    private handleAddMultiplierScore(){
        this.ballLifeTimer = 0;
    }

    private onWinUIAnimationComplete() {
        this.switchGameState(GameStates.Menu);
        ScoreManager.instance.clearScore();
    }

}

enum GameStates
{
    Menu,
    Play,
    Win,
    Restart
}

