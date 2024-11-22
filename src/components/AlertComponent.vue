<template>
    <div class="mask"></div>
    <div class="alert-container">
        <div class="alert-contain">
            <div class="title">系统讯息<div class="btn_closeSM" @click="closeHandler"></div>
            </div>
            <div class="alert_In" v-html="msg"></div>
            <div class="alert_btn"><input type="button" value="確　定" @click="clickHandler"></div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close']);
const props = defineProps({
    msg: {
        type: String,
        default: ''
    },
    callBack: {
        typeof: Function,
        default: null
    }


})

const clickHandler = () => {
    if (props.callBack == null)
        return;

    props.callBack();
};

const closeHandler = () => {
    emit('close');
};
</script>

<style scoped>
.mask {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 30;
    background: black;
    opacity: .5;
}

.alert-container {
    top: 0;
    left: 0;
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 31;
    display: flex;
    justify-content: center;
    align-items: center;
}

.alert-contain {
    width: 30rem;
    height: 20rem;
    background-color: white;
    border-radius: 5%;
    background: url("../assets/bg.jpg") repeat;
}

.title {
    height: 20%;
    background-color: #D43E44;
    /* 背景圖片填充容器 */
    border-radius: 5% 5% 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    position: relative;
}

.btn_closeSM {
    position: absolute;
    right: 0;
    background: url('../assets/btn_close_w.svg') no-repeat center;
    background-size: 1.5rem;
    width: 40px;
    height: 40px;
    cursor: pointer;
}

.alert_In {
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: black;
    font-size: 2.5rem;
}

.alert_btn {
    height: 20%;
    text-align: center;
    font-size: 0;
    padding: 0 15px 20px;
}

.alert_btn input {
    width: 50%;
    min-width: 120px;
    max-width: 150px;
    height: 33px;
    border-radius: 3px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: #D43E44;
    font-family: Arial, ReviseText, Microsoft JhengHei, Microsoft YaHei, sans-serif;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: 0;
    border: 0;
    padding: 0;
    font-size: 1.5rem;
    margin: 0;
}
</style>