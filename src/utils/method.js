import moment from 'moment'
//转换歌曲时间
let Songduration=duration=>{
    let min=parseInt((duration%(60*60*1000))/(60*1000));
    let sec=parseInt((duration%(60*1000))/1000);
    min=min<10?`0${min}`:min;
    sec=sec<10?`0${sec}`:sec;
    let time=`${min}:${sec}`;
    return time
};
//简化播放量
let Playcount=count=>{
    if (count / 10000 > 10) {
        return parseInt(count / 10000) + '万';
    } else {
        return count;
    }
};
//转换日期
let Date=time=>{
    return moment(time).format('YYYY-MM-DD');
}
//转换评论日期
let CommentDate=time=>{
    return moment(time).format('YYYY-MM-DD hh:mm:ss');
}

export {Songduration,Playcount,Date,CommentDate}