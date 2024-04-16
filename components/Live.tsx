import { useMyPresence, useOthers } from "@/liveblocks.config"
import LiveCursors from "./Cursor/LiveCursors"
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./Cursor/CursorChat";
import { CursorMode, CursorState, Reaction } from "@/types/type";
import ReactionSelector from "./Reaction/ReactionButton";
import FlyingReaction from "./Reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";

const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any;
    const [reaction, setReaction] = useState<Reaction[]>([])

    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    })

    useInterval(()=>{
        
    }, 100)

    const handlePointerMove = useCallback((event: React.PointerEvent)=>{
        event.preventDefault();

        if(cursor == null || cursorState.mode !== CursorMode.ReactionSelector){
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor:{x, y}}) ;
        }
        
    },[])

    const handlePointerLeave = useCallback((event: React.PointerEvent)=>{
        setCursorState({mode: CursorMode.Hidden});
       
        updateMyPresence({cursor:null, message:null}) ;
    },[])

    const handlePointerDown = useCallback((event: React.PointerEvent)=>{
        
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor:{x, y}}) ;
        setCursorState((state: CursorState) =>{
            cursorState.mode === CursorMode.Reaction ? {...StaticRange, isPressed : true} : state
        })
    },[cursorState.mode, setCursorState])

    const handlePointerUp = useCallback((event: React.PointerEvent)=>{
        setCursorState((state: CursorState) =>{
            cursorState.mode === CursorMode.Reaction ? {...StaticRange, isPressed : true} : state
        })
    },[cursorState.mode, setCursorState])

    useEffect(() => {
    const onKeyUp = (e:KeyboardEvent) =>{
        if(e.key==='/') {
            setCursorState({
                mode: CursorMode.Chat,
                previousMessage: null,
                message:''
            })
        }else if(e.key=== 'Escape'){
            updateMyPresence({message:''})
            setCursorState({
                mode: CursorMode.Hidden
            })
        }else if(e.key === 'e' || e.key === 'E'){
          setCursorState({
            mode: CursorMode.ReactionSelector
          }) 
        }
    }

    const onKeyDown = (e:KeyboardEvent) =>{
        if(e.key === '/'){
            e.preventDefault();
        }
    }

    window.addEventListener('keyup',onKeyUp);
    window.addEventListener('keydown',onKeyDown);

    return () => {
        window.removeEventListener('keydown',onKeyDown);
        window.removeEventListener('keyup',onKeyUp);
    }
    }, [useMyPresence])
    
    const setReactions = useCallback((reation: string) => {
        
            setCursorState({mode: CursorMode.Reaction, reaction, isPressed: false})
        
    },[])

  return (
    <div
    onPointerMove={handlePointerMove}
    onPointerLeave={handlePointerLeave}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    className="h-[100vh] w-full flex justify-center items-center text-center"
    >
        {reactions.map((r)=>{
            <FlyingReaction
            key = {r.timestamp.toString()}
            x = {r.point.x}
            y = {r.point.y}
            timestamp = {r.timestamp}
            value = {r.value}
            />
        })}
        <h1 className="text-xl text-white">Draw-IT</h1>

        {cursor && (
            <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
            />
        )}
        
        {cursorState.mode === CursorMode.ReactionSelector && (
            <ReactionSelector 
            setReaction={setReactions}
            />
        )}
        <LiveCursors others={others}/>
    </div>
  )
}

export default Live