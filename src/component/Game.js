import InfoWrapper from './InfoWrapper';
import Board from './Board';

function Game(){
    return (
        <div class="box">
            <main>
                <h1>Minesweeper Game in React</h1>
                <InfoWrapper />
                <Board />
             </main>
        </div>
    );
}

export default Game;