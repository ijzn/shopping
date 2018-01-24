<template>
    <div class="nav-breadcrumb-wrap">
        <div class="container">
            <nav class="nav-breadcrumb">
                <router-link to="/">首页</router-link>
                <slot></slot>
                <!-- <span>商品列表</span> -->
            </nav>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NavBread',
    data() {
        return {

        }
    },
    created() {

    },
    methods: {

    },
    components: {

    }
}
</script>

<style>
    
</style>
