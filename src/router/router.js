import Vue from 'vue'
import VueRouter from 'vue-router'
//组件
import discovery from '../views/discovery.vue'
import playlists from '../views/playlists.vue'
import songs from '../views/songs.vue'
import mvs from '../views/mvs.vue'
import result from '../views/result.vue'
import details from '../views/details.vue'
import mvdetails from '../views/mv.vue'





const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    //默认推荐音乐
    path:"/",
    redirect:'/discovery'
  },
  {
    //推荐音乐
    path:"/discovery",
    component:discovery,
    name:'discovery'
  },
  {
    //推荐歌单
    path:"/playlists",
    component:playlists
  },
  {
    //最新音乐
    path:"/songs",
    component:songs
  },
  {
    //最新mv
    path:"/mvs",
    component:mvs
  },
  {
    //搜索页面
    path:"/result",
    name:"result",
    component:result
  },
  {
    //歌单详情
    path:"/details",
    component:details
  },
  {
    //mv详情
    path:'/mvdetails',
    component:mvdetails
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
