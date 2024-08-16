console.log(YT);
window.addEventListener("load",()=>{
    videoPlayer()
})
function videoPlayer(id){
    let videoId="8b0ubLO2MUE"
    if(YT){
        new YT.Player("video-player",{
            height:"500",
            width:"1000",
            videoId,
            events:{
                onReady:(e)=>{
                    e.target.playVideo()
                }
            }
        })
    }
}