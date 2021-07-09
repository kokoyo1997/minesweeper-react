import { GAMESTATE } from "../constants";

function InfoWrapper({mines,leftMines,gameState,handleRestart,runtime,handleShowSet}){
  
  const transformStatus=(state)=>{
    switch(state){
      case GAMESTATE.WIN: return "😎";
      case GAMESTATE.LOSE: return "😢";
      default: return "😄";
    }
  }

  let status=transformStatus(gameState);
  let runtimeStr=""+runtime;
  if(runtimeStr.length<3) runtimeStr="0".repeat(3-runtimeStr.length)+runtimeStr;

  return (
      <div className="info">
        <div className="count"><span>💣</span>{leftMines}/{mines}</div>
        <div className="status"><button onClick={handleRestart}>{status}</button><button onClick={handleShowSet}>⚙️</button></div>
        <div className="time"><span>🕙</span>{runtimeStr}</div>
      </div>
  );
    
}
export default InfoWrapper;