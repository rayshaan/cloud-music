<template>
    <div id="top">
        <!-- 左侧 -->
        <div class="leftBox">
            <span class="prepage" title="上一页" @click="prePage">
                <i class="el-icon-arrow-left"></i>
            </span>
            <span class="homepage" title="主页" @click="homePage">
                <i class="el-icon-s-home"></i>
            </span>
            <span class="fullScreen" title="全屏" @click="full" ref="spanscreen">
                <i class="el-icon-full-screen" ref="icon"></i>
            </span>
        </div>
        <!-- 中间搜索框 -->
        <div class="centerInput">
            <div class="search">
                <input class="search-input" 
                placeholder="搜索" 
                v-model="inputValue" 
                @keyup.enter="toSearch"
                @focus="emptyVal()"
                @blur="hide=false"
                >
                <i class="el-icon-search search-btn" @click="toSearch"></i>
            </div>
            <!-- 热搜 -->
            <div class="hotSearch" v-if="hide">
                <p>热门搜索</p>
                <ul>
                    <li v-for="(item,index) in hotSearch" :key='index' @mousedown="hot($event)">
                        {{item.first}}
                    </li>
                </ul>
            </div>
        </div>
        <!-- 右侧隐藏按钮 -->
        <div class="rightBox">
            <el-switch
                v-model="value1"
                active-color="#409EFF"
                inactive-color="#DCDFE6">
            </el-switch>
            <el-switch
                v-model="value2"
                class="reverse"
                active-color="#409EFF"
                inactive-color="#DCDFE6">
            </el-switch>
        </div>
    </div>
</template>
<script>
import {hotSearch} from '@/api/discovery';
import screenfull from 'screenfull'
export default {
    data(){
        return {
            inputValue:"",
            value1:true,
            value2:true,
            fullscreen:false,
            hotSearch:[],
            searching:false,
            hide:false
        }
    },
    methods:{
        //搜索
        toSearch(){
            //如果搜索信息是空提示
            if(this.inputValue==""){
                this.$message({
                    message: '请输入歌曲信息',
                    type: 'warning',
                    center: true,
                    duration:2000
                });
            }else{//不是空就跳转到搜索结果页
                this.hide=true
                this.$router.push(`/result?q=${this.inputValue}`)
            }
        },
        //点击热搜搜索
        hot(a){
            this.inputValue=a.target.innerHTML
            this.$router.push(`/result?q=${this.inputValue}`)
            this.hide=false
        },
        //清空内容
        emptyVal(){
            this.hide=true;
            this.inputValue=''
        },
        //返回上一页
        prePage(){
            this.$router.go(-1)
        },
        //主页
        homePage(){
            this.$router.push('/discovery')
        },
        //全屏
        full(){
            //浏览器不支持全屏
            if(screenfull.enabled){
                this.$message({
                    message: '您的浏览器不支持全屏',
                    type: 'warning',
                    center: true,
                    duration:2000
                });
                return false;
            }
            //切换全屏
            screenfull.toggle();
            //判断是否全屏切换标题和图标
            const isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement
            this.$refs.icon.className=isFullScreen==undefined?'el-icon-close':"el-icon-full-screen"
            this.$refs.spanscreen.title=isFullScreen==undefined?'退出全屏':"全屏"
        }
    },
    mounted() { 
        //热搜
        hotSearch().then(res=>this.hotSearch=res.data.result.hots)
    },
    watch:{
        //切换显示隐藏左侧菜单
        value1(){
            let nav=document.querySelector('.nav');
            let main=document.querySelector('.main')
            let body=document.querySelector('body')
            //控制元素居中
            if(this.value1){
                nav.style.transform='translateX(0px)'
                main.style.marginLeft="0px"
            }else{
                nav.style.transform='translateX(-200px)'
                main.style.marginLeft=`-${(body.clientWidth-main.clientWidth)/2}px`;
            }
        },
        //切换显示隐藏下面播放模块
        value2(){
            let nav=document.querySelector('.nav');
            let index=document.querySelector('.index')
            let player=document.querySelector('.player')
            if(this.value2){
                player.style.transform='translateY(0px)'
                index.style.height='calc(100% - 160px)'
            }else{
                player.style.transform='translateY(100px)'
                index.style.height='calc(100% - 60px)'
            }
        }  
    }
}
</script>
<style lang="scss" scoped>

</style>