<template>
  <aside class="aside-ps">
    <transition name="slide">
      <div class="aside-main content" v-show="show">
        <div class="btn btn-red-outline" v-show="show" @click="showToggle" v-text="title">
        </div>
        <div ref="scrollRef" class="roll award-main" v-show="show">
          <div class="roll-div" style="top: 0px;">
            <div class="award-con" :class="{ none: item.last === 0 }" v-for="item in items" :key="item.title"
              v-show="item.contents.length > 0">
              <slot name="title" :item="item">
                <h3 class="award-title" v-text="item.title"></h3>
              </slot>
              <ul class="win">
                <li class="clearfix win-li" v-for="content in item.contents" :key="content">
                  <div class="f-l avatar tickit" @click="clickHandler((content.img ? item : content))">
                    <img :src="`${item.last === 0 ? 'red-envelope-none.png' : content.img || 'ticket.png'}`" />
                  </div>
                  <div class="f-l name" v-text="content.text"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <img src="../assets/lantern.png" :style="imgWidthStyle" id="mingdan" class="switch" @click="showToggle">
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';

const emit = defineEmits();
const show = ref(false);
const showSlide = () => {
  show.value = true;
}
const hideSlide = () => {
  show.value = false;
}
// 提供父組件調用的方法
defineExpose({ showSlide, hideSlide });

// 項目點擊事件
const clickHandler = (item) => {
  emit('donate', item);
};
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  }
});

// 卷軸
const scrollRef = ref(null);
const showToggle = () => {
  show.value = !show.value;
  // 置頂
  if (scrollRef.value)
    scrollRef.value.scrollTop = 0;
}

const imgWidthStyle = computed(() => {
  return show.value ? 'width: 85px' : 'width: 200px';
});
</script>

<style scoped>
.roll {
  overflow-x: hidden;
  position: relative;
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  height: calc(100% - 100px);
}

.roll-div {
  position: absolute;
  top: 0;
  left: 1%;
  width: 100%;
}

/* 清除浮动 */
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden
}


.clearfix {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.f-l {
  float: left;
}

.aside-ps {
  display: flex;
  align-items: center;
  flex-direction: column;
}

aside {
  position: absolute;
  top: 0;
  width: 15%;
  height: 100%;
  z-index: 1;
  text-align: center;
}

.aside-main {
  min-width: 200px;
  width: 100%;
  height: 100%;
  background: #fff;
  padding-top: 4rem;
  box-shadow: 0 4px 8px #aaa;
}

aside .switch {
  margin-top: 1.2rem;
  transform: rotateY(360deg);
  transition: all 2s ease-in-out;
  cursor: pointer;
  -webkit-animation: play 5s linear infinite;
}


.content {
  max-height: 80%;
  /* 选择一个足够大的值，确保容器完全展开 */
}

.slide-enter-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

/* Vue transition 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.5s ease-out;
}

.slide-enter,
.slide-leave-to

/* .slide-leave-active in <2.1.8 */
  {
  max-height: 0;
}

.award-main {
  margin-top: 1.5rem;
}

#award-01,
#award-02,
#award-03 {
  display: none;
}

.award-con {
  margin-top: 4rem;
  margin-left: 2rem;
}

.award-con .award-title {
  width: 80%;
  margin: 0 auto;
  padding-bottom: 1rem;
  color: #FD361F;
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  font-family: 'STKaiti', 'KaiTi ';
  border-bottom: 2px solid #FD361F;
}

#liwu-con .award-title {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.award-con .win {
  min-width: 150px;
  margin-top: 0.6rem;
}

#liwu-con .win .win-li {
  margin: 0.2rem auto 0 auto;
}

.award-con .win .delete {
  display: none;
  padding: 0.2rem;
  margin: 1rem 0 0 2rem;
  font-size: 1.5rem;
  color: #FD361F;
  text-decoration: none;
  border-radius: 5rem;
  border: 1px solid #FD361F;
}

.award-con .win .name {
  line-height: 4rem;
  /*margin-left: 2rem;*/
  color: #2980B9;
  font-size: 2rem;
  font-family: 'STKaiti', 'KaiTi ';
}

#liwu-con .win .name {
  padding-left: 5px;
  font-size: 1.5rem;
}

.award-con .win .avatar img {
  width: 3.5rem;
  height: 3.5rem;
  margin-top: 4px;
  border-radius: 100%;
}

#award-04 {
  display: none;
}

#award-04 .win .name {
  line-height: 3rem;
  font-size: 1.8rem;
}

#award-04 .win .avatar img {
  width: 3rem;
  height: 3rem;
}

#award-04 .win .win-li {
  margin: 0 auto 0 auto;
}

#award04-toggle {
  display: none;
  width: 50%;
  margin: 1rem auto 1rem auto;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  color: #2980B9;
  font-size: 2rem;
  font-family: 'STKaiti', 'KaiTi ';
  border-radius: 2px;
  border: 1px solid #2980B9;
}

.btn {
  padding: 1rem 1.5rem;
  text-align: center;
  border-radius: 0.5rem;
}

.btn-red {
  color: #ffffff;
  background: #FD361F;
  box-shadow: 0 6px #B92C1C;
}

.btn-red-outline {
  width: 40%;
  margin: 15px auto 0 auto;
  cursor: pointer;
  color: #FD361F;
  border: 3px solid #FD361F;
  -webkit-box-shadow: 0 6px rgba(253, 54, 31, 0.5);
  -moz-box-shadow: 0 6px rgba(253, 54, 31, 0.5);
  box-shadow: 0 6px rgba(253, 54, 31, 0.5);
  font-size: 2rem;
  font-weight: 600;
  font-family: 'STKaiti', 'KaiTi ';
}

.tickit {
  cursor: pointer;
  padding-right: 10px;
}

.none .name {
  cursor: not-allowed;
  color: gray !important;
}
</style>
