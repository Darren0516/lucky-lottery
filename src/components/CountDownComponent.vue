<template>
    <div class="loading" v-if="loading"></div>
    <transition name="fade">
        <div class="stop-main" v-if="loading">
            <div id="stop-time" v-text="countDownText" v-show="visible && countDownText"></div>
        </div>
    </transition>
</template>

<script setup>

import { watch, defineEmits, computed, ref } from 'vue';
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits();

const textMapping = {
    1: '壹',
    2: '貳',
    3: '叁',
    4: '肆',
    5: '伍'
}

let visible = ref(false);
let timer = null;
let count = ref(5);
const countDownText = computed(() => textMapping[count.value] || '');
const countDownProcess = () => {
    clearTimeout(timer);
    timer = null;

    if (count.value == 0) {
        emit('complete');
        return;
    }

    visible.value = true;
    timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;

        visible.value = false;
        timer = setTimeout(() => {
            count.value--;
            countDownProcess();
        }, 1000);
    }, 500);
};
watch(() => props.loading, () => {
    if (!props.loading) {
        count.value = 5;
        visible.value = false;
        return;
    }

    //倒數
    countDownProcess();
});
</script>

<style scoped>
.stop-main {
    align-items: center;
    justify-content: center;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
}

.stop-main #stop-time {
    display: grid;
    place-items: center;
    width: 300px;
    height: 300px;
    font-size: 160px;
    color: #FD361F;
    font-family: 'STKaiti', 'KaiTi ';
    border: 4px solid #FD361F;
    border-radius: 100%;
    background: url("../assets/bg.jpg") repeat;
}

.stop-main .back:after {
    content: '';
    width: 100%;
}

.stop-main .back {
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
}

/* vue animantion (transition) */
/* <transition name="fade"> */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .8s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave {
    opacity: 1;
}

.loading {
    background: black;
    opacity: .5;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 8;
}
</style>