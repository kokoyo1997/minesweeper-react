import InfoWrapper from './InfoWrapper';
import Board from './Board';
import { expandOpenedCell, getNextCellCode, initBoard } from '../lib/minesweeper';
import { CODES, GAMESTATE, MIN_HEIGHT, MIN_MINES, MIN_WIDTH } from '../constants';
import { useEffect, useState } from 'react';

function Game(){
    let [boardData,setBoardData]=useState(initBoard(MIN_WIDTH,MIN_HEIGHT,MIN_MINES));
    let [openedCount,setOpenedCount]=useState(0);
    let [gameState,setGameState]=useState(GAMESTATE.READY);
    let [flagCount,setFlagCount]=useState(0);
    let [mineCount,setMineCount]=useState(MIN_MINES);
    let [runtime,setRuntime]=useState(0);
    
    // �Ҽ�
    const handleRightClick=(e,i,j)=>{
        e.preventDefault();
        if(gameState===GAMESTATE.WIN||gameState===GAMESTATE.LOSE) return;
        if(gameState===GAMESTATE.READY) setGameState(GAMESTATE.RUN);
        let cur_boardData=boardData.slice();
        cur_boardData[i][j]=getNextCellCode(cur_boardData[i][j]);
        // ���죬���������ӣ�open��������
        if(cur_boardData[i][j]===CODES.MINE_FLAG||cur_boardData[i][j]===CODES.FLAG){
            setFlagCount(prev=>prev+1);
            // setOpenedCount(prev=>prev+1);
            //�����ȷʵ�����׵ģ�mine��������
            if(cur_boardData[i][j]===CODES.MINE_FLAG) setMineCount(prev=>prev-1);
        }
        // �����ʺţ�����������
        else if(cur_boardData[i][j]===CODES.MINE_QUESTION||cur_boardData[i][j]===CODES.QUESTION){
            setFlagCount(prev=>prev-1);
            // setOpenedCount(prev=>prev-1);
            //�����ȷʵ�����׵ģ�mine�����ָ�һ��
            if(cur_boardData[i][j]===CODES.MINE_QUESTION) setMineCount(prev=>prev+1);
        }
           
        //�ָ��հף�open��������
        // else{
        //     setOpenedCount(prev=>prev-1);
        // }
        setBoardData(cur_boardData);
    };
    // ���
    const handleLeftClick=(i,j)=>{
        if(gameState===GAMESTATE.WIN||gameState===GAMESTATE.LOSE) return;
        if(gameState===GAMESTATE.READY) setGameState(GAMESTATE.RUN);
        let cur_boardData=boardData.slice();
        if(cur_boardData[i][j]===CODES.MINE){
            setGameState(GAMESTATE.LOSE);
            return;
        }
        let r=expandOpenedCell(cur_boardData,j,i);
        setOpenedCount(prev=>prev+r.openedCellCount);
        setBoardData(cur_boardData);
    };
    // ����
    const handleRestart=()=>{
        setBoardData(initBoard(MIN_WIDTH,MIN_HEIGHT,MIN_MINES));
        setOpenedCount(0);
        setGameState(GAMESTATE.READY);
        setFlagCount(0);
        setMineCount(MIN_MINES);
        setRuntime(0);
    }

    //�ж��Ƿ��Ѿ�ȫ����ȷ
    const isWin=(open,mine)=>{
        if(mine===0&&open===MIN_WIDTH*MIN_HEIGHT-MIN_MINES){
            setGameState(GAMESTATE.WIN);
            console.log("WIN!");
        }
    };
    useEffect(()=>{
        isWin(openedCount,mineCount);
    },[openedCount,mineCount])

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

    return (
        <div className="box">
            <main>
                <h1>Minesweeper Game in React</h1>
                <InfoWrapper 
                    mines={MIN_MINES}
                    leftMines={MIN_MINES-flagCount}
                    gameState={gameState}
                    handleRestart={handleRestart}
                    runtime={runtime}
                />
                <Board
                    boardData={boardData}
                    handleLeftClick={handleLeftClick}
                    handleRightClick={handleRightClick}
                    gameState={gameState}
                />
             </main>
        </div>
    );
}

export default Game;