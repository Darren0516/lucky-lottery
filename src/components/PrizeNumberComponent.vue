<template>
    <div class="clearfix lottery-list">
        <div class="f-l lottery-content">
            <em class="beauty border-01"></em>
            <em class="beauty border-02"></em>
            <em class="beauty border-03"></em>
            <em class="beauty border-04"></em>
            <div class="border bor-top"></div>
            <div class="border bor-bottom"></div>
            <div class="content-detail">
                <slot><b>抽獎號碼：</b></slot>
                <span v-text="number"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    number: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped>
.f-l {
    float: left;
}

/* 清除浮动 */
.clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
}

/* 
.clearfix {
  *+height: 1%;
} */

.lottery-list {
    position: relative;
    margin: 0 auto 2rem auto;
    width: calc(100% - 10px);
}

.lottery-list:hover {
    cursor: pointer;
}

.lottery-content {
    position: relative;
    margin: 0 8%;
    /* padding: 2rem; */
    width: 80%;
    height: 7rem;
    -webkit-transition: all .4s;
    -moz-transition: all .4s;
    transition: all .4s;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 5px;
    -webkit-box-shadow: 0 2px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.8);
}

.lottery-content .beauty {
    position: absolute;
    display: inline-block;
    width: 50px;
    height: 50px;
    overflow: hidden;
}

.lottery-content .border-01 {
    top: 3px;
    left: 3px;
    background: url("../assets/border-01.png") no-repeat;
    background-size: contain;
}

.lottery-content .border-02 {
    top: 3px;
    right: 3px;
    background: url("../assets/border-02.png") no-repeat;
    background-size: contain;
}

.lottery-content .border-03 {
    bottom: 3px;
    left: 3px;
    background: url("../assets/border-03.png") no-repeat;
    background-size: contain;
}

.lottery-content .border-04 {
    bottom: 3px;
    right: 3px;
    background: url("../assets/border-04.png") no-repeat;
    background-size: contain;
}

/* .lottery-content:after {
    content: "";
    display: block;
    position: absolute;
    top: 40%;
    left: -17px;
    right: auto;
    border: 10px solid transparent;
    border-right-color: #fff; 
}*/

.lottery-content .content-title {
    margin: 0 0 10px;
    text-align: center;
}

.lottery-content .content-title .lottery-name {
    font-size: 2rem;
    color: #2980b9;
    font-weight: bold;
    font-family: 'STKaiti', 'KaiTi ';
}

.lottery-content .content-title .company {
    font-size: 1.4rem;
    font-weight: 500;
    color: #3498db;
    font-family: '微软雅黑', sans-serif, arial;
}

.lottery-content .content-detail {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.lottery-content .content-detail b {
    position: absolute;
    color: #FD361F;
    font-weight: bold;
    font-family: 'STKaiti', 'KaiTi ';
    left: 50px;
    font-size: 2rem;
}

.lottery-content .content-detail span {
    font-size: 4rem;
    font-weight: bold;
    color: #ff0000;
    /*font-family: '微软雅黑', sans-serif, arial;*/
}
</style>