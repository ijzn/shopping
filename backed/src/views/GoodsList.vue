<template>
    <div>
        <NavHeader></NavHeader>
        <NavBread>
            <span>商品列表</span>
        </NavBread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">排序:</span>
                    <a href="javascript:void(0)" class="default cur">默认</a>
                    <a href="javascript:void(0)" class="price"  @click="sortGoods">价格
                        <svg class="icon icon-arrow-short" :class="{'sort-up':sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showfilterby">价格区间</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" :class="{'filterby-show':filterbyShow}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)" :class="{cur: priceLevel === 'all'}" @click="setPriceFilter('all')">All</a>
                            </dd>
                            <dd v-for="(item,index) in priceFiter" :key="index" @click="setPriceFilter(index)">
                                <a href="javascript:void(0)" :class="{cur: index === priceLevel}" >{{item.startPrice}} - {{item.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>
    
                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsList" :key="index">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'/static/'+item.productImage" :alt="item.productName"></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
                                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">
                请先登录,否则无法加入到购物车中!
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
            </div>
        </modal>
        <modal :mdShow="mdShowCart" @close="closeModal">
            <p slot="message">
            <svg class="icon-status-ok">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
            </svg>
            <span>加入购物车成!</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <NavFooter></NavFooter>
    </div>
</template>

<script>


export default {
    name: 'GoodsList',
    data() {
        return {
            mdShow:false,
            mdShowCart:false,
            goodsList: [],
            priceFiter: [
                {
                    startPrice: '0.00',
                    endPrice: '100.00',
                },
                {
                    startPrice: '100.00',
                    endPrice: '500.00',
                },
                {
                    startPrice: '500.00',
                    endPrice: '1000.00',
                },
                {
                    startPrice: '1000.00',
                    endPrice: '5000.00',
                },
            ],
            priceLevel: 'all',
            filterbyShow: false,
            overLayFlag: false,
            sortFlag: true,// 默认升序    false降序
            page : 1,
            pageSize : 8,
            busy : true,
            loading:false,
        }
    },
    created() {
        this.init();
    },
    methods: {
        init(flag){
            let parem = {
                page : this.page,
                pageSize : this.pageSize,
                sort : this.sortFlag?1:-1,
                priceLevel: this.priceLevel,
            }
            this.loading = true;
            this.$axios.get('/goods/list',{
                    params : parem                  
                }
            ).then((res)=>{
                this.loading = false;
                let data = res.data;
                if (data.statue == '0') {
                    this.goodsList = [];
                }else{
                    if (flag) {
                        this.goodsList = this.goodsList.concat(data.result.list);
                        if (res.data.result.count == 0 || res.data.result.count < 8) {
                            this.busy = true;
                        } else {
                            this.busy = false;                            
                        }                       
                    } else {
                        this.goodsList = data.result.list;
                        this.busy = false;                   
                    }
                }
            })
        },
        // 滚动加载
        loadMore() {
            this.busy = true;
            setTimeout(() => {
                this.page++;                        
                this.init(true);
            }, 1000);
        },
        // 价格排序
        sortGoods() {
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.init()
        },
        showfilterby() {
            this.filterbyShow = true;
            this.overLayFlag = true;
        },
        setPriceFilter(idnex) {
            if (idnex == 'all') {
                this.priceLevel = 'all'
            }else{
                this.priceLevel = idnex;
            }
            this.page = 1;
            this.filterbyShow = false;
            this.overLayFlag = false;
            this.init();
        },
        closePop(){
            this.filterbyShow = false;
            this.overLayFlag = false;
        },
        // 加入购物车
        addCart(item) {
            this.$axios.post('/goods/addCart',{
                productId:item.productId
            })
            .then((res)=>{
                if (res.data.statue == '1') {
                    this.mdShowCart = true;
                } else {
                    this.mdShow = true;
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        // 关闭弹框
        closeModal(){
            this.mdShow = false;
        }

    },
}
</script>

<style scoped>
.icon-arrow-short{
    transition: all 0.3s ease-out;    
}
.sort-up{
    transform: rotate(180deg);
    transition: all 0.3s ease-out;
}
.btn:hover{
    background: #ffe5e6;
    transition: all  .3s ease-out;
}
</style>
