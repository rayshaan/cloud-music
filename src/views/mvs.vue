<template>
    <div class="mvs-container">
        <!-- 筛选 -->
        <div class="filter-wrap">
            <div class="section-wrap">
                <span>地区:</span>
                <ul>
                    <li><span :class="{active:area=='全部'}" @click="area='全部'">全部</span></li>
                    <li><span :class="{active:area=='内地'}" @click="area='内地'">内地</span></li>
                    <li><span :class="{active:area=='港台'}" @click="area='港台'">港台</span></li>
                    <li><span :class="{active:area=='欧美'}" @click="area='欧美'">欧美</span></li>
                    <li><span :class="{active:area=='日本'}" @click="area='日本'">日本</span></li>
                    <li><span :class="{active:area=='韩国'}" @click="area='韩国'">韩国</span></li>
                </ul>
            </div>
            <div class="type-wrap">
                <span>类型:</span>
                <ul>
                    <li><span :class="{active:type=='全部'}" @click="type='全部'">全部</span></li>
                    <li><span :class="{active:type=='官方版'}" @click="type='官方版'">官方版</span></li>
                    <li><span :class="{active:type=='原声'}" @click="type='原声'">原声</span></li>
                    <li><span :class="{active:type=='现场版'}" @click="type='现场版'">现场版</span></li>
                    <li><span :class="{active:type=='网易出品'}" @click="type='网易出品'">网易出品</span></li>
                </ul>
            </div>
            <div class="order-wrap">
                <span>排序:</span>
                <ul>
                    <li><span :class="{active:order=='上升最快'}" @click="order='上升最快'">上升最快</span></li>
                    <li><span :class="{active:order=='最热'}" @click="order='最热'">最热</span></li>
                    <li><span :class="{active:order=='最新'}" @click="order='最新'">最新</span></li>
                </ul>
            </div>
        </div>
        <!-- mv -->
        <div class="mvs">
            <div class="items" v-loading="loading">
                <div class="item" v-for="(item,index) in mvList" :key='index'>
                    <div class="img-wrap">
                        <img :src="item.cover" alt="">
                        <span class="iconfont" @click="toMv(item.id)">
                            <icon-svg icon-class="bofang"></icon-svg>
                        </span>
                        <!-- 播放按钮和播放量 -->
                        <div class="num-wrap">
                            <icon-svg icon-class="bofang-copy"></icon-svg>
                            <div class="num">{{item.playCount|Playcount}}</div>
                        </div>
                    </div>
                    <!-- 歌曲信息 -->
                    <div class="info-wrap">
                        <p class="name">{{item.name}}</p>
                        <p class="singer">{{item.artistName}}</p>
                    </div>
                </div>
            </div>
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
    </div>
</template>
<script>
import { allMvs } from '@/api/mvs';

export default {
    data(){
        return {
            area:'全部',
            type:'全部',
            order:'最热',
            // 每页数据
            limit: 8,
            // 页码
            page: 1,
            // 总条数
            total: 0,
            // mv列表数据
            mvList: [],
            //加载
            loading:true
        }
    },
    components:{
        
    },
    methods:{
        //切换页码
        changePage(val){
            this.page=val;
            this.getData();
        },
        getData(){
            const { area, type, order } = this;
            allMvs({
                area,
                type,
                order,
                offset: (this.page - 1) * this.limit
            }).then(res => {
                //mv列表
                this.mvList=res.data.data;
                //mv总数
                if(res.data.count){
                    this.total=res.data.count
                }
            });
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
        //加载效果
        mvList(){
            this.loading=false
        },
        //分类切换
        area(){
            this.page=1
            this.getData()
        },
        type(){
            this.page=1
            this.getData()
        },
        order(){
            this.page=1
            this.getData()
        }
    }
}
</script>
<style lang="scss" scoped>

</style>