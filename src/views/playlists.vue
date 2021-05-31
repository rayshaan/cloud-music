<template>
    <div class="playlists-container">
        <!-- 顶部卡片 -->
        <div class="top-card" v-loading="loading" element-loading-text="正在加载资源">
            <!-- 左侧图片 -->
            <div class="img-wrap">
                <img :src="topList.coverImgUrl" alt="">
            </div>
            <!-- 右侧信息 -->
            <div class="content-wrap">
                <!-- 标签 -->
                <div class="tag">精品歌单</div>
                <!-- 标题 -->
                <div class="title">
                {{topList.name}}
                </div>
                <!-- 内容 -->
                <div class="info">{{topList.description}}</div>
            </div>
            <!-- 遮罩层 -->
            <img :src="topList.coverImgUrl" alt="" class="bg">
            <div class="bg-mask"></div>
        </div>
        <!-- 中间内容 -->
        <div class="tab-container" >
            <div class="tab-bar">
                <span class="item" :class="{active:tag=='全部'}" @click="tag='全部'">全部</span>
                <span class="item" :class="{active:tag=='欧美'}" @click="tag='欧美'">欧美</span>
                <span class="item" :class="{active:tag=='华语'}" @click="tag='华语'">华语</span>
                <span class="item" :class="{active:tag=='流行'}" @click="tag='流行'">流行</span>
                <span class="item" :class="{active:tag=='说唱'}" @click="tag='说唱'">说唱</span>
                <span class="item" :class="{active:tag=='摇滚'}" @click="tag='摇滚'">摇滚</span>
                <span class="item" :class="{active:tag=='民谣'}" @click="tag='民谣'">民谣</span>
                <span class="item" :class="{active:tag=='电子'}" @click="tag='电子'">电子</span>
                <span class="item" :class="{active:tag=='轻音乐'}" @click="tag='轻音乐'">轻音乐</span>
                <span class="item" :class="{active:tag=='影视原声'}" @click="tag='影视原声'">影视原声</span>
                <span class="item" :class="{active:tag=='ACG'}" @click="tag='ACG'">ACG</span>
                <span class="item" :class="{active:tag=='怀旧'}" @click="tag='怀旧'">怀旧</span>


                <!-- 治愈和旅行暂无数据 -->
                <!-- <span class="item" :class="{active:tag=='治愈'}" @click="tag='治愈'">治愈</span>
                <span class="item" :class="{active:tag=='旅行'}" @click="tag='旅行'">旅行</span> -->
            </div>
            <div class="tab-content" v-loading="loading" element-loading-text="正在加载资源">
                <div class="items">
                    <div class="item" v-for="(item,index) in playList" :key="index">
                        <div class="img-wrap">
                            <!-- 标题 -->
                            <div class="num-wrap">
                                播放量:<span class="num">{{item.playCount|Playcount}}</span>
                            </div>
                            <!-- 配图 -->
                            <img :src="item.coverImgUrl">
                            <!-- 播放按钮 -->
                            <span class="iconfont" @click="toDetails(item.id)">
                                <icon-svg icon-class="bofang"></icon-svg>
                            </span>
                        </div>
                        <p class="name">{{item.name}}</p>
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
import { highquality, topList } from '@/api/playlists';

export default {
    data(){
        return {
            //总条数
            total:0,
            //页码
            page:1,
            //顶部推荐歌单
            topList:{},
            //歌单列表
            playList:[],
            //当前选中分类
            tag:"全部",
            loading:true
        }
    },
    methods:{
        //切换页面
        changePage(val){
            this.page=val;
            this.getData();
        },
        //获取数据
        getData(){
            highquality({ cat: this.tag }).then(res => this.topList=res.data.playlists[0]);
            topList({
                cat: this.tag,
                offset: (this.page - 1) * 10
            }).then(res => {
                this.playList=res.data.playlists;
                //总数
                this.total=res.data.total;
            });
        },
        //跳转歌单详情
        toDetails(id){
            this.$router.push(`/details?id=${id}`);
        }
    },
    created(){
        this.getData();
    },
    watch:{
        //监听tag变化请求不同内容实现分类
        tag(){
            //切换分类将页面设为1
            this.page=1;
            //获取数据
            this.getData();
        },
        topList(){
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