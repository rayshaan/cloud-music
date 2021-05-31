<template>
    <div class="index">
        <!-- 导航 -->
        <div class="nav">
            <ul>
                <li>
                    <router-link to="/discovery"><icon-svg icon-class="yinle" class="icon"/>发现音乐</router-link>
                </li>
                <li>
                    <router-link to="/playlists"><icon-svg icon-class="gedan" class="icon"/>推荐歌单</router-link>
                </li>
                <li>
                    <router-link to="/songs"><icon-svg icon-class="icon-" class="icon"/>最新音乐</router-link>
                </li>
                <li>
                    <router-link to="/mvs"><icon-svg icon-class="26shipin" class="icon" style="margin-right:11px"/>最新mv</router-link>
                </li>
            </ul>
        </div>
        <!-- 主体 -->
        <div class="main">
            <router-view></router-view>
        </div>
        <!-- 底部播放器 -->
        <div class="player">
            <!-- 歌曲封面 -->
            <div class="pic">
                <img :src="pic" alt="">               
            </div>
            <div class="music">
                <div class="wrap">
                    <!-- 歌曲信息 -->
                    <div class="detail">
                        <span>{{title}}</span>
                        <span>{{artist}}</span>
                    </div>
                    <!-- 歌词 -->
                    <div class="lyric" :style="{transform:`translateY(${-this.currentIndex * 30}px)`}">
                        <p v-for="(item, index) of lrc"
                            :key="index" :class="{currentLine:currentIndex==index}">
                            {{item.lineLyric}}
                        </p>
                    </div>
                </div>
                <!-- 音频 -->
                <audio 
                :src='src' ref="audio"  @play="play" @timeupdate="lyricroll"
                controls loop :autoplay="autoplay"></audio>
            </div>         
        </div>
    </div>
</template>
<script>
import discovery from '../views/discovery.vue'
import playlists from '../views/playlists.vue'
import songs from '../views/songs.vue'
import mvs from '../views/mvs.vue'
import { songUrl ,Lyric,songDetail} from '@/api/discovery';
import {common} from '../utils/lyric.js'

export default {
    data(){
        return {
            title:"",
            src:"",
            artist:"",
            pic:"",
            lrc:"",
            currentIndex:0,
            autoplay:false,
            audio:"",
        }
    },
    components:{
        discovery,
        playlists,
        songs,
        mvs
    },
    methods:{
        play(){//设置音量
            this.$refs.audio.volume=0.1;
        },
        lyricroll(){  
            //遍历当前播放时间,和歌词时间一致就滚动  
            if(this.$refs.audio){
                let currentTime=parseInt(this.$refs.audio.currentTime)
                for(let i=0;i<this.lrc.length;i++){
                    if(currentTime==this.lrc[i].time&&currentTime!==0&&currentTime!=this.lrc.length-1){
                        this.currentIndex=i;
                    }
                } 
            }
        },
        getData(){
            //默认音乐
            //url
            songUrl({id:500392422}).then(res=>this.src=res.data.data[0].url)
            //歌词
            Lyric({id:500392422}).then(res=>{
                this.lrc=this.lyric.lrc(res.data.nolyric?"暂无歌词":res.data.lrc.lyric);
            })
            //歌曲信息
            songDetail({ids:500392422}).then(res=>{
                this.title=res.data.songs[0].name;
                this.artist=res.data.songs[0].ar[0].name;
                this.pic=res.data.songs[0].al.picUrl;
            })    
        }
    },
    created(){
        this.getData()      
    },
    mounted(){
        this.song=document.querySelector('audio')
    }
}
</script>
<style lang="scss" scoped>

</style>