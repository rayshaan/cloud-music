<template>
    <div class="result-container">
        <!-- 搜索信息和数量 -->
        <div class="title-wrap">
            <h2>{{$route.query.q}}</h2>
            <span class="sub-title">找到{{count}}个结果</span>
        </div>
        <!-- 搜索结构 -->
        <el-tabs v-model="activeName">
            <el-tab-pane label="歌曲" name="songs">
                 <el-table  stripe style="width: 100%" 
                 :data="tableData"
                    empty-text=""
                      v-loading="loading"
                    element-loading-text="正在加载歌曲">
                    <el-table-column prop="num"  width="49">
                         <template slot-scope="num">
                            <span>{{num.$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="" width="1"></el-table-column>
                    <el-table-column prop="name" label="音乐标题" width="300">
                        <template slot-scope="title">
                            <span class="title" @click="playMusic(title.row.id)">{{title.row.name}}</span>
                            <span class="source" v-if="title.row.alias[0]?true:false">{{title.row.alias[0]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="artists[0].name" label="歌手" width="200"></el-table-column>
                    <el-table-column prop="album.name" label="专辑" width="450"></el-table-column>
                    <el-table-column prop="duration" label="时长" width="100">
                        <template slot-scope="time">{{time.row.duration|Songduration}}</template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- 歌单 -->
            <el-tab-pane label="歌单" name="songlist">
                
                <div class="songlist-items">
                    <div class="item" v-for="item in playList" :key="item.id">
                        <div class="img-wrap">
                            <div class="num-wrap">
                                <span class="num">播放量:{{ item.playCount|Playcount}}</span>
                            </div>
                            <img :src="item.coverImgUrl" alt="" />
                            <!-- 播放按钮 -->
                            <span class="iconfont" @click="toDetails(item.id)">
                                <icon-svg icon-class="bofang"></icon-svg>
                            </span>
                        </div>
                        <p class="name">{{ item.name }}</p>
                    </div>
                </div>
            </el-tab-pane>
            <!-- mv -->
            <el-tab-pane label="MV" name="mv">
                <div class="mvs">
                    <div class="items">
                        <div class="item" v-for="(item,index) in mvList" :key="index">
                            <div class="img-wrap">
                                <!-- 配图 -->
                                <img :src="item.cover" alt="" />
                                <span class="iconfont" @click="toMv(item.id)">
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
            </el-tab-pane>
        </el-tabs>
        <!-- 分页器 -->
        <el-pagination
            @current-change="changePage"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
            :page-size="5"
        >
        </el-pagination>
    </div>
</template>
<script>
import { search } from '@/api/result';
import { songUrl ,Lyric,songDetail} from '@/api/discovery';
export default {
    data(){
        return{
            //类型
            type:'1',
            //搜索到的数量
            count:0,
            //歌曲列表
            tableData:[],
            //歌单列表
            playList:[],
            //mv列表
            mvList:[],
            //tab切换
            activeName: 'songs',
            //总数
            total:0,
            //分页
            page:1,
            //歌曲取出数量
            limit:10,
            //加载
            loading:true,
        }
    },
    methods:{
        //切换页码
        changePage(val){
            this.page=val;
            this.getData();
        },
        getData(){
            const { limit, type } = this;
            const  keywords  = this.$route.query.q;
            search({
                limit,
                type,
                keywords,
                offset: (this.page - 1) * limit
            }).then(res => {
                // 根据类型不同
                switch (this.type) {
                    case '1':
                    //歌曲
                    this.tableData=res.data.result.songs;
                    this.count=res.data.result.songCount
                    this.total=res.data.result.songCount
                    break;
                    
                    case '1000':
                    //歌单            
                    this.playList=res.data.result.playlists;
                    this.count=res.data.result.playlistCount
                    this.total=res.data.result.playlistCount
                    break;

                    default:
                    //mv
                    this.mvList=res.data.result.mvs;
                    this.count=res.data.result.mvCount;
                    this.total=res.data.result.mvCount
                    break;
                }
            }); 
        },
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
        },
        //跳转mv详情
        toMv(id){
            this.$router.push(`/mvdetails?id=${id}`)
        }
    },
    created(){
        this.getData()
    },
    watch:{
        //更新搜索信息
        "$route"(){
            this.getData()
        },
        //加载效果
        tableData(){
            this.loading=false
        },
        playList(){
            this.loading=false
        },
        mvList(){
            this.loading=false
        },
        //侦听器
        activeName(){
            //判断类型
            switch(this.activeName){
                case 'songs':
                    this.type='1';
                    break;
                case 'songlist':
                    this.type='1000';
                    break;
                case 'mv':
                    this.type='1004';
                    break;
                default:
                    break;
            }
            //默认页面归1
            this.page=1;
            //限制数量
            this.limit=this.type=='1004'?8:10
            //获取数据
            this.getData()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>