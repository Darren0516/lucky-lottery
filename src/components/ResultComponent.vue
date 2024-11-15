<template>
    <div class="modal fade in" v-show="result" @click="closeHandler">
        <div class="modal-backdrop fade in" style="opacity: 0.5;"></div>
        <div class="modal-dialog">
            <div class="modal-content">
                <canvas ref="canvasRef"></canvas>
            </div>
            <div class="award-list">
                <div class="wrap-border-main">
                    <img src="../assets/wrap-border-1.png" class="wrap-border wrap-border-1">
                    <img src="../assets/wrap-border-2.png" class="wrap-border wrap-border-2">
                    <img src="../assets/wrap-border-3.png" class="wrap-border wrap-border-3">
                    <img src="../assets/wrap-border-4.png" class="wrap-border wrap-border-4">
                    <div class="wrap-border wrap-border-left"></div>
                    <div class="wrap-border wrap-border-right"></div>
                </div>
                <div class="award-title">
                    <slot name="title"></slot> 中獎名單
                </div>
                <div class="award-content" :style="contentStyle">
                    <PrizeNumberComponent :style="subStyle" class="child" v-for="item in awards" :key="item"
                        :number="item">
                        <template>
                            <b>中獎號碼：</b>
                        </template>
                    </PrizeNumberComponent>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, onUnmounted, computed } from 'vue';
import PrizeNumberComponent from './PrizeNumberComponent.vue';

const emit = defineEmits();
const props = defineProps({
    result: {
        type: Boolean,
        default: false
    },
    awards: {
        type: Array,
        default: () => []
    }
});

const contentStyle = computed(() => {
    return props.awards.length > 6 ? ' display: flex' : ' display: block';
})
const subStyle = computed(() => {
    return props.awards.length > 6 ? ' flex: 1 1 48%;' : ' flex: 1 1 100%;';
})
// 用来保存图片列表
const sparkImages = [];
const canvasRef = ref(null); // 用于绑定canvas元素
let animationFrameId = null; // 用来保存 requestAnimationFrame 的 id
let intervalId = null; // 用来保存 setInterval 的 id

// 用来存储粒子
const particles = [];

watch(() => props.result, (newValue) => {
    if (newValue) {
        startFireworks();
    }
});

const closeHandler = () => {
    stopFireworks();
    emit('complete');
};

// 初始化图片
const loadImages = () => {
    for (let i = 1; i <= 10; i++) {
        const img = new Image();
        img.src = `/images/spark${i}.png`;  // 使用 public/images/ 下的路径
        sparkImages.push(img);
    }
};

// 创建粒子对象
const createParticle = (x, y) => {
    return {
        x,
        y,
        size: Math.random() * 20 + 15, // 增加火花的大小
        speedX: (Math.random() - 0.5) * 8, // 增加火花速度
        speedY: (Math.random() - 0.5) * 8, // 增加火花速度
        life: 150, // 增加生命周期
        img: sparkImages[Math.floor(Math.random() * sparkImages.length)], // 随机选择火花图片
    };
};

// 更新粒子的状态
const updateParticle = (particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.life -= 1;
};

// 绘制粒子
const drawParticle = (ctx, particle) => {
    if (particle.img) {
        ctx.drawImage(particle.img, particle.x, particle.y, particle.size, particle.size);
    } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }
};

// 创建烟火爆炸
const createFireworks = (x, y) => {
    for (let i = 0; i < 150; i++) { // 增加粒子数量
        particles.push(createParticle(x, y));
    }
};

// 动画函数
const animate = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height); // 清除画布
    for (let i = particles.length - 1; i >= 0; i--) {
        updateParticle(particles[i]);
        drawParticle(ctx, particles[i]);
        if (particles[i].life <= 0) {
            particles.splice(i, 1); // 移除生命周期结束的火花
        }
    }
    animationFrameId = requestAnimationFrame(() => animate(ctx, width, height));
};

// 启动烟火效果
const startFireworks = () => {
    const canvas = canvasRef.value;  // 访问 canvas 元素

    if (!canvas)
        return;
    const ctx = canvas.getContext('2d');

    // 设置 canvas 大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 每隔 1 秒触发一次烟火爆炸
    intervalId = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        createFireworks(x, y);
    }, 1000);

    animate(ctx, canvas.width, canvas.height); // 开始动画
};

// 停止烟火效果
const stopFireworks = () => {
    // 清除定时器和动画
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // 清空粒子数组
    particles.length = 0;

    // 清空 canvas
    const canvas = canvasRef.value;

    if (!canvas)
        return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// 设置 canvas 尺寸并初始化
onMounted(() => {
    loadImages(); // 加载图片
});

// 在组件销毁时清理动画
onUnmounted(() => {
    stopFireworks();
});
</script>

<style scoped>
.modal-open {
    overflow: hidden
}

.modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0
}

.modal.fade .modal-dialog {
    -webkit-transition: -webkit-transform .3s ease-out;
    -o-transition: -o-transform .3s ease-out;
    transition: transform .3s ease-out;
    -webkit-transform: translate(0, -25%);
    -ms-transform: translate(0, -25%);
    -o-transform: translate(0, -25%);
    transform: translate(0, -25%);
    /*top: 15%;*/
}

.modal.in .modal-dialog {
    margin: 0;
    width: 100%;
    height: 100%;
    left: 0;
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0)
}

.modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto
}

.modal-dialog {
    /*position: relative;*/
    width: auto;
    height: 90%;
    margin: 10px;
    position: absolute;
    top: 0;
    left: calc(50% - 150px);
}

.modal-content {
    position: relative;
    top: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    outline: 0;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000;
}

.modal-backdrop.fade {
    filter: alpha(opacity=0);
    opacity: 0
}

.modal-backdrop.in {
    filter: alpha(opacity=50);
    opacity: .5
}

.award-list {
    height: 80%;
    width: 50%;
    background: url(/src/assets/bg.jpg) repeat;
    position: fixed;
    top: 10%;
    left: 25%
}

.wrap-border-main {
    position: absolute;
    width: 100%;
    z-index: -5;
    height: 100%
}

.wrap-border {
    position: absolute;
    width: 21.5rem;
    height: 21.5rem;
    background-size: contain;
}

.wrap-border-top {
    top: 0.2%;
    left: 9%;
    bottom: 0;
    height: 97.4%;
    width: 81%;
    margin: 0 auto;
    border-top: 4px solid #CB141D;
    border-bottom: 4px solid #CB141D;
}

.wrap-border-left {
    left: 0;
    right: 0;
    bottom: 7%;
    height: 80%;
    width: 98.7%;
    border-left: 4px solid #CB141D;
}

.wrap-border-right {
    top: 10%;
    right: 0;
    height: 80%;
    width: 4.3px;
    background: #CB141D;
}

.wrap-border-1 {
    top: 0;
    left: 0;
}

.wrap-border-2 {
    top: 0;
    right: 0;
}

.wrap-border-3 {
    bottom: 0;
    left: 0;
}

.wrap-border-4 {
    bottom: 0;
    right: 0;
}

.award-title {
    margin: 4rem auto 0 auto;
    display: inline-block;
    color: #D43E44;
    font-size: 4rem;
    font-weight: bold;
    font-family: 'Fantasy', 'STKaiti', 'KaiTi ';
}

.award-content {
    overflow: hidden;
    margin-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    flex-wrap: wrap;
    /* 允許子元素換行 */
    justify-content: space-between;
    /* 均勻分布子元素 */
    gap: 10px;
    /* 子元素之間的間距 */
    width: 100%;
    /* 父容器寬度為 100% */
    height: 80%;
    /* 父容器高度為 100% */
    box-sizing: border-box;
}

.child {
    /* 每個子元素的基礎寬度是父元素的 48%，並且可以縮放 */
    box-sizing: border-box;
    margin-bottom: 10px;
    width: auto;
}

.child .lottery-content {
    width: 100%;
}

@media (max-width: 600px) {
    .child {
        flex: 1 1 100%;
        /* 在小屏幕下，讓子元素寬度占滿整行 */
    }
}

.lottery-content .content-detail b {
    display: hidden;
}
</style>