import { CODES, GAMESTATE } from "../constants";

function Square({code,handleLeftClick,handleRightClick,state}){
    const parseCode=(code)=>{
        let value="",style="square";
        switch(code){
            case CODES.NOTHING:style+='';break;
            case CODES.OPENED:style+=" plain";break;

            case CODES.FLAG: value='🚩';style+=" flag";break;
            case CODES.MINE_FLAG: 
                if(state===GAMESTATE.LOSE) value='💥';
                else if(state===GAMESTATE.WIN) value='💣';
                else {
                    value='🚩';style+=" flag";
                }
                break;

            case CODES.QUESTION: value='?';style+=" question";break;
            case CODES.MINE_QUESTION: 
                if(state===GAMESTATE.LOSE) value='💥';
                else if(state===GAMESTATE.WIN) value='💣';
                else {
                    value='?';
                    style+=" question";
                }
                break;

            case CODES.MINE:
                switch(state){
                    case GAMESTATE.LOSE: value='💥';break;
                    case GAMESTATE.WIN: value='💣';break;
                    default: value="";
                }
                break;
            default: value=code;style+=" plain";
        }
        return [value,style];
    }

    let [value,style]=parseCode(code);

    return (
        <button 
            className={style}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
        >{value}</button>
    );
}
export default Square;
