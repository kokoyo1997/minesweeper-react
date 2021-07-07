import Square from './Square';
import { MIN_HEIGHT, MIN_WIDTH } from '../constants';

function Board({boardData,handleLeftClick,handleRightClick,gameState}){
    return (
        <div className="board">
            {
                Array(MIN_HEIGHT).fill(null).map((row,i)=>(
                    <div className="board-row" key={i}>
                        {Array(MIN_WIDTH).fill(null).map((col,j)=>(
                            <Square 
                                key={j}
                                code={boardData[i][j]}
                                handleLeftClick={()=>handleLeftClick(i,j)}
                                handleRightClick={(e)=>handleRightClick(e,i,j)}
                                state={gameState}
                            />
                        ))}
                    </div>
                ))
            }
         
        </div>
    );
}
export default Board;