<template>
    <div class="details-container">
        <!-- 歌单封面 -->
        <div class="top-wrap"  v-loading="loading"
                element-loading-text="正在加载歌曲信息">
            <div class="img-wrap">
                <img :src="details.coverImgUrl" alt="">
            </div>
            <!-- 右边歌单信息 -->
            <div class="info-wrap">
                 <!-- 标题 -->
                <p class="title">{{details.name}}</p>
                <!-- 作者 -->
                <div class="author-wrap">
                    <img :src="avatarUrl" alt="">
                    <span class="author">{{nickname}}</span>
                    <span class="time">{{details.createTime|Date}}</span>
                </div>
                <!-- 播放 -->
                <div class="play-wrap">
                    <div class="btn">
                        <span class="iconfont">
                            <icon-svg icon-class="bofang-copy"></icon-svg>
                        </span>
                        <span class="playcontrol">播放全部</span>
                    </div>
                </div>
                <!-- 标签 -->
                <div class="tag-wrap">
                    <span class="title">标签：</span>
                    <ul>
                        <li v-for="(item,index) in details.tags" :key="index">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <!-- 简介 -->
                <div class="desc-wrap">
                    <span class="title">简介：</span>
                    <span class="desc">{{details.description}}</span>
                </div>
            </div>
        </div>
        <!-- 歌曲和评论 -->
        <el-tabs v-model="activeName">
             <el-tab-pane label="歌单列表" name="songlist">
                 <!-- 歌曲列表 -->
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
                            <img :src="img.row.al.picUrl" width="70" height="70"/>
                            <!-- 播放按钮 -->
                            <span class="iconfont" @click="playMusic(img.row.id)">
                                <icon-svg icon-class="bofang"></icon-svg>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="音乐标题" width="300">
                        <template slot-scope="title">
                            <span class="title">{{title.row.al.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ar[0].name" label="歌手" width="200"></el-table-column>
                    <el-table-column prop="al.name" label="专辑" width="300"></el-table-column>
                    <el-table-column prop="duration" label="时长">
                        <template slot-scope="time">{{time.row.dt|Songduration}}</template>
                    </el-table-column>
                </el-table>
             </el-tab-pane>

             <!-- 评论 -->
            <el-tab-pane :label="`评论`" name="comments">
                <!-- 热门评论 -->
                <div class="hotcomments-wrap" v-if="hotComments.length!=0">
                    <p class="title">热门评论({{hotComments.length}})</p>
                    <div class="comments">
                        <!-- 每条热评 -->
                        <div class="item" v-for="(item,index) in hotComments" :key="index">
                            <!-- 左边头像 -->
                            <div class="img-wrap">
                                <img :src="item.user.avatarUrl" alt="">
                            </div>
                            <!-- 右边信息和评论 -->
                            <div class="content-wrap">
                                <div class="content">
                                    <span class="name">{{item.user.nickname}}：</span>
                                    <span class="comment">{{item.content}}</span>
                                </div>
                                 <!-- 回复 -->
                                <div class="reply" v-if="item.beReplied!=0">
                                    <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                                    <span class="reply-comment">{{item.beReplied[0].content}}</span>
                                </div>
                                <!-- 时间 -->
                                <div class="date">{{item.time|CommentDate}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 全部评论 -->
                <div class="comments-wrap">
                    <p class="title">最新评论({{total}})</p>
                    <div class="comments">
                        <!-- 每条热评 -->
                        <div class="item" v-for="(item,index) in Comments" :key="index">
                            <!-- 左边头像 -->
                            <div class="img-wrap">
                                <img :src="item.user.avatarUrl" alt="">
                            </div>
                            <!-- 右边信息和评论 -->
                            <div class="content-wrap">
                                <div class="content">
                                    <span class="name">{{item.user.nickname}}：</span>
                                    <span class="comment">{{item.content}}</span>
                                </div>
                                 <!-- 回复 -->
                                <div class="reply" v-if="item.beReplied!=0">
                                    <span class="name">{{item.beReplied[0].user.nickname}}：</span>
                                    <span class="reply-comment">{{item.beReplied[0].content}}</span>
                                </div>
                                <!-- 时间 -->
                                <div class="date">{{item.time|CommentDate}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分页器 -->
                <el-pagination
                background
                @current-change="changePage"
                layout="prev, pager, next"
                :total="total"
                :current-page="page"
                :page-size="10"
                >
                </el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { playlistDetail, listComments, hotComments } from '@/api/details';
import { songUrl ,Lyric,songDetail} from '@/api/discovery';
export default {
    data(){
        return {
            activeName:'songlist',
            loading:true,
            //歌曲详情
            details:{},
            //作者信息
            avatarUrl:"",
            nickname:"",
            //歌曲列表
            tableData:[],
            // 热门评论
            hotComments: [],
            //全部评论
            Comments:[],
            //是否有回复
            reply:true,
            //分页器
            total:0,
            page:1,
            limit:10,
        }
    },
    created(){
        this.getDetails();
        this.getHotcomments();
        this.getComments();
    },
    methods:{
        //切换页面
        changePage(val){
            this.page=val;
            this.getComments()
        },
        getDetails(){
            const  id  = this.$route.query.id; 
            playlistDetail({
                id
            }).then(res => {
                // 歌曲信息
                this.details=res.data.playlist
                this.tableData=res.data.playlist.tracks
                this.avatarUrl=res.data.playlist.creator.avatarUrl
                this.nickname=res.data.playlist.creator.nickname
            });
        },
        //获取热门评论
        getHotcomments(){     
            const  id  = this.$route.query.id;     
            hotComments({
                id
            }).then(res => this.hotComments=res.data.hotComments);
        },
        //获取全部评论
        getComments(){
            const  id  = this.$route.query.id;
            // 获取歌曲评论
            listComments({
                id,
                offset: (this.page - 1) * 5
            }).then(res => {
               this.Comments=res.data.comments
                this.number=res.data.total
                this.total=res.data.total
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
    },
    watch:{
        //取消加载动画
        tableData(){
            this.loading=false
        }
    }
}
</script>
<style lang="scss" scoped>

</style>
