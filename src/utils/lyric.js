//转换歌词
export default{
    lrc(lrc_s){
        if(lrc_s=='暂无歌词'){
            return [{'time':0,'lineLyric':'暂无歌词'}]
        }else{
            var lrcArr=lrc_s;
            var lyric=[];//歌词
            var m,s,ms;
            /*先切割歌词*/
            var arr=lrcArr.split("\n");
            //分别取出时间和歌词
            for (var i=0;i<arr.length;i++){
                var v=arr[i].replace(/[^\[..+\:..+\d+\]]/g,"");
                var lyrictime={};
                v=v.replace(/\]/g,"");
                v=v.replace(/\[/g,"");
                /*转为分和秒*/
                if(v){
                    m=parseInt(v.substr(0, 2))*60;
                    s=parseInt(v.substr(3, 2));
                    v=m+s;
                    if(isNaN(v)){
                        v=0;
                    }
                }
                var v1=arr[i].replace(/\[..+\:..+\d+\]/g,"");
                v1=v1.replace(/(^\s*)|(\s*$)/g,"");
                /*将键和值对应*/
                lyrictime['time']=v;//时间
                lyrictime["lineLyric"]=v1;//歌词
                lyric.push(lyrictime);
            }
            return lyric
        }
    }
}