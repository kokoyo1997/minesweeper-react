import { useState } from "react";
import { MIN_HEIGHT, MIN_MINES, MIN_WIDTH, MAX_WIDTH, MAX_HEIGHT } from "../constants";

function Setting({show,handleSet}){
    const [attr,setAttr]=useState({
        width:MIN_WIDTH,
        height:MIN_HEIGHT,
        mines:MIN_MINES
    })

    const handleWidthChange=({target})=>{
        const {name,value}=target;
        let num_value=parseInt(value);
        setAttr((prev)=>({...prev,[name]:num_value}));
        if(name!=="mines"){
            setAttr((prev)=>({...prev,"mines":Math.min(attr.mines, Math.floor(attr.width*attr.height*0.8))}));
        }
        
    }

    return (
        <>
        {show&&<>
            <div className="mask"></div>
            <div className="set-box">
            <h3>SETTING</h3>
            <div className="set-bd">
                <label>Width: {attr.width}<br /> <input type="range" name="width" id="width" min={MIN_WIDTH} max={MAX_WIDTH} onChange={(e)=>handleWidthChange(e)} value={attr.width}/></label>
                <label>Height: {attr.height}<br /><input type="range" name="height" id="height" min={MIN_HEIGHT} max={MAX_HEIGHT} onChange={(e)=>handleWidthChange(e)} value={attr.height}/></label>
                <label>Mines: {attr.mines}<br /><input type="range" name="mines" id="mines" min={MIN_MINES} max={Math.floor(attr.width*attr.height*0.8)} onChange={(e)=>handleWidthChange(e)} value={attr.mines}/></label>
                <button onClick={()=>handleSet(attr)}>SET</button>
            </div>
            </div>
        </>}
        </>
    )
};

export default Setting;