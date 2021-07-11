import InfoWrapper from './InfoWrapper';
import Board from './Board';
import Setting from './Setting';
import { expandOpenedCell, getNextCellCode, initBoard } from '../lib/minesweeper';
import { CODES, GAMESTATE, MIN_HEIGHT, MIN_MINES, MIN_WIDTH } from '../constants';
import { useEffect, useState } from 'react';

function Game(){
    let [gameAttr,setGameAttr]=useState({
        width:MIN_WIDTH,
        height:MIN_HEIGHT,
        mines:MIN_MINES
    });
    let [boardData,setBoardData]=useState(initBoard(MIN_WIDTH,MIN_HEIGHT,MIN_MINES));
    let [openedCount,setOpenedCount]=useState(0);
    let [gameState,setGameState]=useState(GAMESTATE.READY);
    let [flagCount,setFlagCount]=useState(0);
    let [mineCount,setMineCount]=useState(MIN_MINES);
    let [runtime,setRuntime]=useState(0);
    let [showSet,setShowSet]=useState(false);
    
    // 右键
    const handleRightClick=(e,i,j)=>{
        e.preventDefault();
        if(gameState===GAMESTATE.WIN||gameState===GAMESTATE.LOSE) return;
        if(gameState===GAMESTATE.READY) setGameState(GAMESTATE.RUN);
        let cur_boardData=boardData.slice();
        cur_boardData[i][j]=getNextCellCode(cur_boardData[i][j]);
        // 插旗，旗数量增加，open数量增加
        if(cur_boardData[i][j]===CODES.MINE_FLAG||cur_boardData[i][j]===CODES.FLAG){
            setFlagCount(prev=>prev+1);
            // setOpenedCount(prev=>prev+1);
            //如果这确实是有雷的，mine数量减少
            if(cur_boardData[i][j]===CODES.MINE_FLAG) setMineCount(prev=>prev-1);
        }
        // 旗变成问号，旗数量减少
        else if(cur_boardData[i][j]===CODES.MINE_QUESTION||cur_boardData[i][j]===CODES.QUESTION){
            setFlagCount(prev=>prev-1);
            // setOpenedCount(prev=>prev-1);
            //如果这确实是有雷的，mine数量恢复一个
            if(cur_boardData[i][j]===CODES.MINE_QUESTION) setMineCount(prev=>prev+1);
        }
        setBoardData(cur_boardData);
    };
    // 左键
    const handleLeftClick=(i,j)=>{
        if(gameState===GAMESTATE.WIN||gameState===GAMESTATE.LOSE) return;
        let cur_boardData=boardData.slice();
        
        if(gameState===GAMESTATE.READY) {
            //如果第一次点击就点到雷，那么重新初始化生成
            while(cur_boardData[i][j]==CODES.MINE){
                cur_boardData=initBoard(gameAttr.width,gameAttr.height,gameAttr.mines);
            }
            setGameState(GAMESTATE.RUN);
        }
        
        if(cur_boardData[i][j]===CODES.MINE){
            setGameState(GAMESTATE.LOSE);
            return;
        }
        let r=expandOpenedCell(cur_boardData,j,i);
        setOpenedCount(prev=>prev+r.openedCellCount);
        setBoardData(cur_boardData);
    };
    // 重置
    const handleRestart=()=>{
        setBoardData(initBoard(gameAttr.width,gameAttr.height,gameAttr.mines));
        setOpenedCount(0);
        setGameState(GAMESTATE.READY);
        setFlagCount(0);
        setMineCount(gameAttr.mines);
        setRuntime(0);
    }

    // 显示设置面板
    const handleShowSet=()=>{
        setShowSet(true);
    }
    // 更改设置
    const handleSet=(attr)=>{
        setShowSet(false);
        setGameAttr(attr);
    }

    //判断是否已经全部正确
    const isWin=(open,mine)=>{
        if(mine===0&&open===gameAttr.width*gameAttr.height-gameAttr.mines){
            setGameState(GAMESTATE.WIN);
            console.log("WIN!");
        }
    };

    //有新的点击操作就检查是否已经结束
    useEffect(()=>{
        isWin(openedCount,mineCount);
    },[openedCount,mineCount])

    //游戏计时
    useEffect(()=>{
        let timer=null;
        if(gameState===GAMESTATE.RUN) 
            timer=setInterval(() => {
                setRuntime(prev=>prev+1);
            }, 1000);
        else clearInterval(timer);

        return ()=>{
            clearInterval(timer);
        }

    },[gameState]);

    //重新设置格子后立即更新棋盘
    useEffect(()=>{
        //游戏重开
        handleRestart();
    },[gameAttr]);

    return (
        <>
            <div className="box">
                <main>
                    <h1>Minesweeper Game in React</h1>
                    <InfoWrapper 
                        mines={gameAttr.mines}
                        leftMines={gameAttr.mines-flagCount}
                        gameState={gameState}
                        handleRestart={handleRestart}
                        runtime={runtime}
                        handleShowSet={handleShowSet}
                    />
                    <Board
                        boardData={boardData}
                        handleLeftClick={handleLeftClick}
                        handleRightClick={handleRightClick}
                        gameState={gameState}
                    />
                </main>
            </div>
            <Setting 
                show={showSet}
                handleSet={handleSet}
            />
        </>
    );
}

export default Game;