
const n=20;
const array=[];

let audioCtx=null;

init();

function init(){
    for(let i=0;i<n;i++){
        array[i]=Math.random();
    }
    showBars();
}

function play(){
    const moves=bubbleSort([...array]);
    animate(moves);
}

function animate(moves){
    if(moves.length==0){
        showBars();
        return;
    }
    const move=moves.shift();
    const [i,j]=move.indices;
    if(move.type=="swap")
{
    [array[i],array[j]]=[array[j],array[i]];
}
    showBars(move);
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);
    setTimeout(function(){
        animate(moves);
    },200);
}


function bubbleSort(array){
    const moves=[];
    let j=0;
    while(j<array.length)
    {
        for(let i=j+1;i<array.length;i++){
            max=j;
            moves.push({indices:[max,i],type:"comp"});
            if(array[max]>array[i]){
                moves.push({indices:[max,i],type:"swap"});

                [array[max],array[i]]=[array[i],array[max]];
            }
        }
        j=j+1;
    };
    return moves;
};


function showBars(move){
    container.innerHTML="";
    for(let i=0;i<array.length;i++){
        const bar=document.createElement("div");
        bar.style.height=array[i]*100+"%";
        bar.classList.add("bar");
        if(move && move.indices.includes(i)){
            bar.style.backgroundColor=move.type=="swap"?"red":"blue";
        }
        container.appendChild(bar);
    }   
}

function playNote(freq){
    if(audioCtx==null){
        audioCtx=new(
            AudioContext || 
            webkitAudioContext || 
            window.webkitAudioContext
        )();
    }
    const dur=0.1;
    const osc=audioCtx.createOscillator();
    osc.frequency.value=freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node=audioCtx.createGain();
    node.gain.value=0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}