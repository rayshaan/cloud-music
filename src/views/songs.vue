<template>
    <div class="songs-container">
        <!-- 歌曲分类 -->
        <div class="tab-bar">
            <span class="item" :class="{active:tag==0}" @click="tag=0">全部</span>
            <span class="item" :class="{active:tag==7}" @click="tag=7">华语</span>
            <span class="item" :class="{active:tag==8}" @click="tag=8">日本</span>
            <span class="item" :class="{active:tag==16}" @click="tag=16">韩国</span>
            <span class="item" :class="{active:tag==96}" @click="tag=96">欧美</span>
        </div>
        <!-- 下面表格 -->
        <el-table  stripe style="width: 100%" 
        empty-text=""
        :data="tableData"  v-loading="loading"
        element-loading-text="正在加载歌曲"
        >
            <el-table-column prop="num"  width="50">
                <template slot-scope="num">
                    <span>{{num.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="album.picUrl"  width="150">
                <template slot-scope="img">
                    <img :src="img.row.album.picUrl" width="70" height="70"/>
                    <!-- 播放按钮 -->
                    <span class="iconfont" @click="playMusic(img.row.id)">
                        <icon-svg icon-class="bofang"></icon-svg>
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="音乐标题" width="300">
                <template slot-scope="title">
                    <span class="title">{{title.row.name}}</span>
                    <span class="source">{{title.row.alias[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="artists[0].name" label="歌手" width="200"></el-table-column>
            <el-table-column prop="album.name" label="专辑" width="300"></el-table-column>
            <el-table-column prop="duration" label="时长">
                <template slot-scope="time">{{time.row.duration|Songduration}}</template>
            </el-table-column>
        </el-table>
        <!-- 回到顶部按钮 -->
        <div class="content-area" title="回到顶部" @click="backTop" v-show="hide">
	        
        </div>
    </div>
</template>
<script>
import { topSongs } from '@/api/songs';
import { songUrl ,Lyric,songDetail} from '@/api/discovery';
export default {
    data(){
        return {
            //分类标签
            tag:0,
            tableData:[],
            loading:true,
            hide:false,
            scrollTop:0
        }
    },
    created(){
        this.getData();
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
        getData(){
            //歌曲列表
            topSongs({
                type: this.tag
            }).then(res => this.tableData=res.data.data.splice(0,50));
        },
        //回到顶部
        backTop(){
            const timer=setInterval(()=>{
                document.querySelector('.main').scrollTop=this.scrollTop=0;
                if(this.scrollTop<=0){
                    clearInterval(timer)
                }
            },10)
        },
        //监听显示按钮
        handleScroll(){
            //获取距离顶部的距离
            this.scrollTop = document.querySelector('.main').scrollTop;
            //控制显示隐藏
            this.hide=this.scrollTop>=700?true:false;
        }
    },
    mounted(){
        //监听页面加载显示
        window.addEventListener('scroll',this.handleScroll,true)
    },
    watch:{
        //取消加载
        tableData(){
            this.loading=false
        },
        //切换分类
        tag(){
            this.getData();
        }
    },
    //离开销毁
    destroyed(){
        window.removeEventListener('scroll',this.handleScroll,true)
    }
}
</script>
<style lang="scss" scoped>

</style>