import Square from './Square';
function Board(){
    return (
        <div class="board">
            {
                Array(9).fill(null).map((row,i)=>(
                    <div class="board-row">
                        {Array(9).fill(null).map((col,j)=>(
                            <Square />
                        ))}
                    </div>
                ))
            }
         
        </div>
    );
}
export default Board;