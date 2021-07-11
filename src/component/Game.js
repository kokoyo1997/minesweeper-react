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
        setBoardData(cur_boardData);
    };
    // ���
    const handleLeftClick=(i,j)=>{
        if(gameState===GAMESTATE.WIN||gameState===GAMESTATE.LOSE) return;
        let cur_boardData=boardData.slice();
        
        if(gameState===GAMESTATE.READY) {
            //�����һ�ε���͵㵽�ף���ô���³�ʼ������
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
    // ����
    const handleRestart=()=>{
        setBoardData(initBoard(gameAttr.width,gameAttr.height,gameAttr.mines));
        setOpenedCount(0);
        setGameState(GAMESTATE.READY);
        setFlagCount(0);
        setMineCount(gameAttr.mines);
        setRuntime(0);
    }

    // ��ʾ�������
    const handleShowSet=()=>{
        setShowSet(true);
    }
    // ��������
    const handleSet=(attr)=>{
        setShowSet(false);
        setGameAttr(attr);
    }

    //�ж��Ƿ��Ѿ�ȫ����ȷ
    const isWin=(open,mine)=>{
        if(mine===0&&open===gameAttr.width*gameAttr.height-gameAttr.mines){
            setGameState(GAMESTATE.WIN);
            console.log("WIN!");
        }
    };

    //���µĵ�������ͼ���Ƿ��Ѿ�����
    useEffect(()=>{
        isWin(openedCount,mineCount);
    },[openedCount,mineCount])

    //��Ϸ��ʱ
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

    //�������ø��Ӻ�������������
    useEffect(()=>{
        //��Ϸ�ؿ�
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