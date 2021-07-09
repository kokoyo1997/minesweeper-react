import Square from './Square';

function Board({boardData,handleLeftClick,handleRightClick,gameState}){
    let rows=boardData.length,cols=boardData[0].length;
    return (
        <div className="board">
            {
                Array(rows).fill(null).map((row,i)=>(
                    <div className="board-row" key={i}>
                        {Array(cols).fill(null).map((col,j)=>(
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