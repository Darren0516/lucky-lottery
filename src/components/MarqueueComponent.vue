<template>
    <div class="wrap-main">
        <div class="lottery-wrap">
            <Vue3Marquee vertical="true" :duration="duration" :pause="result">
                <PrizeNumberComponent v-for="item in items" :key="item" :number="item" />
            </Vue3Marquee>
        </div>
        <CountDownComponent :loading="loading" @complete="countDownComplete" />
        <ResultComponent :awards="awards" :result="result" @complete="resultComplete">
            <template #title>
                <slot name="result"></slot>
            </template>
        </ResultComponent>
    </div>
</template>

<script setup>
import { Vue3Marquee } from 'vue3-marquee';
import PrizeNumberComponent from './PrizeNumberComponent.vue';
import { computed, defineEmits, ref } from 'vue';
import CountDownComponent from './CountDownComponent.vue';
import ResultComponent from './ResultComponent.vue';
import { MainStore } from '../store/MainStore';
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    awards: {
        type: Array,
        default: () => []
    }
});

const store = MainStore();
const items = computed(() => store.pools);
const emit = defineEmits();
const result = ref(false);
const duration = computed(() => props.loading ? 10 : 100);
const countDownComplete = () => {
    result.value = true;
    emit('result');
};
const resultComplete = () => {
    result.value = false;
    emit('complete');
}

</script>

<style scoped>
.wrap-main .stop-time {
    position: absolute;
    top: 40%;
    height: 11rem;
    font-size: 11rem;
    font-family: 'STKaiti', 'KaiTi ';
    color: #CB141D;
}

.wrap-main #stop_left {
    padding-left: 2%;
}

.wrap-main #stop_right {
    right: -1%;
    padding-right: 2%;
}

.lottery-arrow {
    position: absolute;
    right: 0;
    top: 50%;
}

.wrap-main {
    position: relative;
    top: 2%;
    /*height: 640px*/
    /*height: 71%;*/
    overflow: hidden;
    /*border: 3px solid #CB141D;*/
}

.lottery-wrap {
    position: absolute;
    top: 20px;
    width: 100%;
    height: 100%;
}

.lottery-wrap .sure-active {
    border-top: 5px solid #CB141D;
    border-bottom: 5px solid #CB141D;
    -webkit-transition: all 1s;
    -moz-transition: all 1s;
    -ms-transition: all 1s;
    -o-transition: all 1s;
    transition: all 1s;
    padding: 15px 0;
}

.vue3-marquee.vertical {
    width: 100%;
}
</style>