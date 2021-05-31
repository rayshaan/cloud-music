<template>
    <div class="mv-container">
        <!-- mv -->
        <div class="mv-wrap" v-loading="loading" element-loading-text="正在加载歌曲信息">
            <!-- 视频 -->
            <div class="video-wrap">
                <video :src="mv.url" controls autoplay="autoplay"></video>
            </div>
            <!-- mv信息 -->
            <div class="info-wrap">
                <!-- 歌手信息 -->
                <div class="singer-info">
                    <div class="img-wrap">
                        <img :src="artistsCover" alt="">
                    </div>
                    <span class="name">{{artists}}</span>
                </div>
                <!-- mv信息 -->
                <div class="mv-info">
                    <h2 class="title">{{mvInfo.name}}</h2>
                    <span class="date">发布时间：{{mvInfo.publishTime}}</span>
                    <span class="playcount">播放次数：{{mvInfo.playCount|Playcount}}次</span>
                    <p class="desc">{{mvInfo.desc?mvInfo.desc:""}}</p>
                </div>
            </div>
        </div>
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
    </div>
</template>
<script>
import { mvUrl, mvHotComments,mvComments, mvDetail, artistInfo } from '@/api/mv';
export default {
    data(){
        return {
            loading:true,
            mv:{},
            mvInfo:{},
            artists:"",
            artistsCover:"",
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
        this.getMv()
        this.getMvdetails()
        this.getHotcomments()
        this.getComments()
    },
    methods:{
        //切换页码
        changePage(val){
            this.page=val;
            this.getComments()
        },
        //获取mv
        getMv(){
            const id=this.$route.query.id;           
            mvUrl({ id }).then(res => this.mv=res.data.data);
        },
        //获取mv信息
        getMvdetails(){
            const id=this.$route.query.id;
            mvDetail({ mvid: id }).then(res => {
                this.mvInfo=res.data.data
                artistInfo({
                    artistId: this.mvInfo.artists[0].id
                }).then(res => {
                    // 歌手名
                    this.artists=res.data.artist.name
                    this.artistsCover=res.data.artist.picUrl
                });
            });
        },
        //获取热评
        getHotcomments(){
            const id=this.$route.query.id;
            mvHotComments({id,offset: (this.page - 1) * 10 }).then(res=>{
                this.hotComments=res.data.hotComments?res.data.hotComments:""
            })
        },
        //获取所有评论
        getComments(){
            const id=this.$route.query.id;
            mvComments({id,offset: (this.page - 1) * 10 }).then(res=>{
                this.Comments=res.data.comments
                this.total=res.data.total
            })
        }
    },
    watch:{
        //取消加载动画
        mv(){
            this.loading=false
        }
    }
}
</script>
<style lang="scss" scoped>

</style>