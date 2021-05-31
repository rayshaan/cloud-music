<template>
    <div class="discovery-container">
        <!-- 轮播图 -->
        <el-carousel :interval="4000" type="card" height="230px"
        v-loading="loading" element-loading-text="正在加载图片"
        >
            <el-carousel-item v-for="(item,index) in banners" :key="index">
                <img :src="item.imageUrl" alt="">
            </el-carousel-item>
        </el-carousel>
        <!-- 推荐歌单 -->
        <div class="recommend" v-loading="loading" element-loading-text="正在加载歌曲">
            <h3 class="title">
                推荐歌单
            </h3>
            <div class="items">
                 <div class="item" v-for="(item,index) in playList" :key="index">
                    <div class="img-wrap">
                        <!-- 标题 -->
                        <div class="desc-wrap">
                            <span class="desc">
                               {{item.copywriter}}
                            </span>
                        </div>
                        <!-- 配图 -->
                        <img :src="item.picUrl" alt="">
                        <!-- 播放按钮 -->
                        <span class="iconfont" @click="toDetails(item.id)">
                            <icon-svg icon-class="bofang"></icon-svg>
                        </span>
                    </div>
                    <p class="name">{{item.name}}</p>
                </div>
            </div>
        </div>
        <!-- 最新音乐 -->
        <div class="newsongs">
            <h3 class="title">
                最新音乐
            </h3>
            <div class="items">
                <div class="item" v-for="(item,index) in newsongs" :key="index">
                    <div class="img-wrap">
                        <!-- 配图 -->
                        <img :src="item.picUrl" alt="" />
                        <span class="iconfont">
                            <icon-svg icon-class="bofang"></icon-svg>
                        </span>
                        <!-- 播放按钮-->
                        <span class="iconfont" @click="playMusic(item.id)">
                            <icon-svg icon-class="bofang"></icon-svg>
                        </span>
                    </div>
                    <!-- 歌名和作者 -->
                    <div class="song-wrap">
                        <div class="song-name">{{item.name}}</div>
                        <div class="singer">{{item.song.artists[0].name}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 最新mv -->
        <div class="newmvs">
            <h3 class="title">推荐MV</h3>
            <div class="items">
                <div class="item" v-for="(item,index) in newmvs" :key="index">
                     <div class="img-wrap">
                         <!-- 配图 -->
                        <img :src="item.picUrl" alt="" />
                        <span class="iconfont">
                            <icon-svg icon-class="bofang"></icon-svg>
                        </span>
                        <!-- 播放按钮和播放量 -->
                        <div class="num-wrap">
                            <icon-svg icon-class="bofang-copy"></icon-svg>
                            <div class="num">{{item.playCount|Playcount}}</div>
                        </div>
                    </div>
                    <!-- 底部歌名和作者 -->
                    <div class="info-wrap">
                        <div class="name">{{item.name}}</div>
                        <div class="singer">{{item.artistName}}</div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import { banner, songlist, newsong,mv,songUrl ,songDetail,Lyric} from '@/api/discovery';

export default {
    name:'discovery',
    data(){
        return{
            //轮播图
            banners:[],
            //推荐歌单
            playList:[],
            //最新音乐
            newsongs:[],
            //推荐mv
            newmvs:[],
            loading:true
        }
    },
    methods:{
        //点击播放歌曲
        playMusic(id){
            //url
            songUrl({id:id}).then(res=>this.$parent.src=res.data.data[0].url)
            //歌词
            Lyric({id:id}).then(res=>{
                this.$parent.lrc=this.lyric.lrc(res.data.nolyric?"暂无歌词":res.data.lrc.lyric);
            })
            //歌曲信息
            songDetail({ids:id}).then(res=>{
                this.$parent.title=res.data.songs[0].name;
                this.$parent.artist=res.data.songs[0].ar[0].name;
                this.$parent.pic=res.data.songs[0].al.picUrl;
            }) 
            this.$parent.autoplay=true
        },
        //跳转歌单详情
        toDetails(id){
            this.$router.push(`/details?id=${id}`);
        }
    },
    created(){
        banner().then(res => this.banners=res.data.banners);
        songlist().then(res => this.playList=res.data.result);
        newsong().then(res => this.newsongs=res.data.result);
        mv().then(res=>this.newmvs=res.data.result)
    },
    watch:{
        banners(){
            this.loading=false;
        },
        playList(){
            this.loading=false;
        }
    }
}
</script>
<style lang="scss" scoped>

</style>