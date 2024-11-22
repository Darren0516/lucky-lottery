<template>
  <header class="top-head"></header>
  <SlideComponent ref="winListRef" class="aside-left" :title="win.title.value" :items="winList" @donate="donateClick" />
  <SlideComponent ref="giftListRef" class="aside-right" :title="gift.title.value" :items="gift.items"
    @donate="setLotteryBtn">
    <template #title="{ item }">
      <h3 class="award-title">
        {{ item.title }} ({{ item.last }}位)
      </h3>
    </template>
  </SlideComponent>
  <div class="main">
    <div class="lotterty-infogo">
      <h3>★彡 小幸運尾牙抽獎 彡★</h3>
    </div>
    <div class="lottery-main">
      <h4 v-if="lotteryBtn.key && loading == false">抽獎池人數: {{ poolsCount }}</h4>
      <div class="wrap-border-main" :style="mainStlye">
        <img src="./assets/wrap-border-1.png" class="wrap-border wrap-border-1">
        <img src="./assets/wrap-border-2.png" class="wrap-border wrap-border-2">
        <img src="./assets/wrap-border-3.png" class="wrap-border wrap-border-3">
        <img src="./assets/wrap-border-4.png" class="wrap-border wrap-border-4">
        <div class="wrap-border wrap-border-left"></div>
        <div class="wrap-border wrap-border-right"></div>
      </div>
      <MarqueueComponent :style="marqueueStyle" :awards="awards" :loading="loading" @result="resultComplete"
        @complete="countDownComplete">
        <template #result>
          {{ lotteryBtn.award }}
        </template>
      </MarqueueComponent>
      <div class="dashboard" v-if="lotteryBtn.count">
        <div class="btn btn-red-outline lottery-btn" :style="btnStyle" v-text="btnText" @click="getWin"></div>
      </div>
    </div>
  </div>
  <div id="clear-control" @click="clearIgnore" title="清空捐贈清單"></div>
  <div id="bg-music-control" :class="{ pause: bgPlaying }" @click="bgToggle" title="抽獎背景音樂"></div>
  <footer class="footer"></footer>
  <AlertComponent v-if="alertMsg" @close="closeHandler" :msg="alertMsg" :callBack="alertCallback" />
</template>

<script setup>
import { ref } from 'vue';
import SlideComponent from './components/SlideComponent.vue';
import MarqueueComponent from './components/MarqueueComponent.vue';
import { computed } from 'vue';
import { watch } from 'vue';
import { MainStore } from './store/MainStore';
import { onMounted } from 'vue';
import Tools from './utils/Tools';
import AlertComponent from './components/AlertComponent.vue';

const store = MainStore();
const poolsCount = computed(() => lotteryBtn.value.key == '99' ? store.lastPoolsCount : store.pools.length);
onMounted(async () => {
  try {
    const response = await fetch('/config.json');
    const data = await response.json();
    store.InitialAward(data);
  } catch (error) {
    console.error('載入配置檔案失敗:', error);
  }
});

let alertMsg = ref('');
let alertCallback = ref(null);
const closeHandler = () => {
  alertMsg.value = '';
  alertCallback.value = null;
};
const clearIgnore = () => {
  alertMsg.value = `是否重置所有捐出紀錄？`;
  alertCallback.value = () => {
    store.ClearDonate();
    closeHandler();
  };
};

/**按鍵處理 */
document.addEventListener('keydown', function (event) {
  if (event.key === 'F1' || event.key === 'F2')
    event.preventDefault();  // 阻止 F1 鍵的默認行為（即打開幫助）

  if (event.key === ' ' || event.key === 'Spacebar') {  // 檢查是否是空白鍵
    if (lotteryBtn.value.count) {
      getWin();
    }
    return;
  }

  if (event.key === 'F1') {  // 使用 event.key 判斷是否是 F2 鍵
    bgToggle()
    return;
  }
  if (event.key === 'F2') {  // 使用 event.key 判斷是否是 F2 鍵
    toggleFullScreen()
    return;
  }
});


// 背景音樂
const bgAudio = ref(null);
bgAudio.value = new Audio('bg.mp3');
bgAudio.value.loop = true;
const bgPlaying = ref(false);
const bgToggle = () => {
  if (!bgAudio.value.paused) {
    bgPause();
  } else {
    bgPlay();
  }
}
const bgPlay = () => {
  if (bgAudio.value && bgAudio.value.paused) {
    awardPause();
    awardAudio.value.currentTime = 0;
    Tools.MusicFadeIn(bgAudio.value, 2000);
  }

  bgPlaying.value = true;
};
const bgPause = () => {
  if (bgAudio.value && !bgAudio.value.paused) {
    Tools.MusicFadeOut(bgAudio.value, 2000);
  }

  bgPlaying.value = false;
};

// 摸彩中背景音樂
const loadingAudio = ref(null);
loadingAudio.value = new Audio('loading.mp3');
loadingAudio.value.loop = true;
const loadingPlay = () => {
  if (loadingAudio.value) {
    loadingAudio.value.play();
  }
};
const loadingPause = () => {
  if (loadingAudio.value) {
    loadingAudio.value.pause();
  }
};

// 中獎背景音樂
const awardAudio = ref(null);
awardAudio.value = new Audio('award.mp3');
awardAudio.value.loop = true;
const awardPlay = () => {
  if (awardAudio.value && awardAudio.value.paused) {
    awardAudio.value.currentTime = 0;
    awardAudio.value.play();
  }
};
const awardPause = () => {
  if (awardAudio.value && !awardAudio.value.paused) {
    awardAudio.value.pause();
  }
};


const win = {
  title: ref('中獎清單')
};
const winList = computed(() => {
  return [{
    title: '加碼獎(1名)', key: '99', contents: (store.awardList['99'] || []).map(id => ({ id: id, key: '99', text: `中獎號碼: 0${id}` }))
  }, {
    title: '頭獎(1名)', key: '1', contents: (store.awardList['1'] || []).map(id => ({ id: id, key: '1', text: `中獎號碼: 0${id}` }))
  },
  {
    title: '二獎(2名)', key: '2', contents: (store.awardList['2'] || []).map(id => ({ id: id, key: '2', text: `中獎號碼: 0${id}` }))
  },
  {
    title: '三獎(3名)', key: '3', contents: (store.awardList['3'] || []).map(id => ({ id: id, key: '3', text: `中獎號碼: 0${id}` }))
  },
  {
    title: '四獎(15名)', key: '4', contents: (store.awardList['4'] || []).map(id => ({ id: id, key: '4', text: `中獎號碼: 0${id}` }))
  },
  {
    title: '五獎(25名)', key: '5', contents: (store.awardList['5'] || []).map(id => ({ id: id, key: '5', text: `中獎號碼: 0${id}` }))
  },
  {
    title: '六獎(32名)', key: '6', contents: (store.awardList['6'] || []).map(id => ({ id: id, key: '6', text: `中獎號碼: 0${id}` }))
  }]
});
// 捐出處理
const donateClick = (item) => {
  alertMsg.value = `<font style="font-size: 3rem; color: #2980B9; font-weight: bold;">中獎號碼: 0${item.id}</font></br>確定要捐出獎金嗎？`;
  alertCallback.value = () => {
    store.SetDonate(item.key, item.id);
    closeHandler();
  };
};

const gift = computed(() => ({
  title: ref('尾牙獎項'),
  items: ((store.awardList['1'] || []).length == 1 && loading.value == false ? [
    {
      title: '加碼獎', last: 1 - (store.awardList['99'] || []).length, total: 1, key: '99', count: 1, contents: [{ text: '獎金: ??????', img: 'red-envelope.png' }]
    }] : []).concat([{
      title: '頭獎', last: 1 - (store.awardList['1'] || []).length, total: 1, key: '1', count: 1, contents: [{ text: '獎金: 100000', img: 'red-envelope.png' }]
    },
    {
      title: '二獎', last: 2 - (store.awardList['2'] || []).length, total: 2, key: '2', count: 1, contents: [{ text: '獎金: 80000', img: 'red-envelope.png' }]
    },
    {
      title: '三獎', last: 3 - (store.awardList['3'] || []).length, total: 3, key: '3', count: 1, contents: [{ text: '獎金: 60000', img: 'red-envelope.png' }]
    },
    {
      title: '四獎', last: 15 - (store.awardList['4'] || []).length, total: 15, key: '4', count: 5, contents: [{ text: '獎金: 30000', img: 'red-envelope.png' }]
    },
    {
      title: '五獎', last: 25 - (store.awardList['5'] || []).length, total: 25, key: '5', count: 5, contents: [{ text: '獎金: 20000', img: 'red-envelope.png' }]
    },
    {
      title: '六獎', last: 32 - (store.awardList['6'] || []).length, total: 32, key: '6', count: 10, contents: [{ text: '獎金: 12000', img: 'red-envelope.png' }]
    },
    {
      title: '參加獎', last: 28, total: 28, contents: [{ text: '獎金: 6000', img: 'red-envelope.png' }]
    }])
}));

const lotteryBtn = ref({
  key: '',
  award: '',
  title: '',
  count: 0
});
const setLotteryBtn = (item) => {
  // 防護驗證
  if (!item.key || store.awardList[item.key] === undefined) {
    lotteryBtn.value.key = '';
    lotteryBtn.value.award = '';
    lotteryBtn.value.title = '';
    lotteryBtn.value.count = 0;
    return;
  }

  const lastCount = item.total - (store.awardList[item.key] || []).length;
  // 已中獎數量驗證
  if (isNaN(lastCount) || lastCount <= 0)
    return;

  if (!item.count)
    return;

  // 若剩餘的名額不足下次抽滿，則直接抽完
  const count = (lastCount >= item.count * 2) ? item.count : lastCount;
  lotteryBtn.value.key = item.key;
  lotteryBtn.value.award = item.title;
  lotteryBtn.value.count = count
  lotteryBtn.value.title = `開始抽獎 (${item.title} ${count} 位)`;
};
const marqueueStyle = computed(() => lotteryBtn.value.key ? 'height: calc(100% - 200px);' : 'height: calc(100% - 100px);');
const mainStlye = computed(() => lotteryBtn.value.key ? 'height: calc(100% - 100px);' : 'height: calc(100% - 50px);');

// 抽獎按鈕處理
const loading = ref(false);
const btnText = computed(() => result.value ? '恭喜中獎!' : loading.value ? '抽獎中。。。' : lotteryBtn.value.title);
const btnStyle = computed(() => loading.value ? 'background: rgb(255, 191, 183);' : '');
watch(() => loading.value, (val) => {
  if (val) {
    bgPause();
    loadingPlay();
  }
});

// 抽獎處理
const awards = ref([]);
const winListRef = ref(null);
const giftListRef = ref(null);
const getWin = () => {
  // 防護驗證
  if (loading.value)
    return;

  // 隱藏清單
  winListRef.value && winListRef.value.hideSlide();
  giftListRef.value && giftListRef.value.hideSlide();

  loading.value = true;
  const list = [].concat(lotteryBtn.value.key === '99' ? store.lastPools : store.pools);
  awards.value = Tools.GetTicket(list, lotteryBtn.value.count).sort((a, b) => a - b);
  // 設定中獎
  store.SetAward(lotteryBtn.value.key, awards.value);
};
// 領獎結束觸發
const countDownComplete = () => {
  loading.value = false;
  result.value = false;
  lotteryBtn.value.key = '';
  lotteryBtn.value.award = '';
  lotteryBtn.value.title = '';
  lotteryBtn.value.count = 0;
  awards.value = [];
  awardPause();
  bgPlay();
  winListRef.value && winListRef.value.hideSlide();
  giftListRef.value && giftListRef.value.showSlide();
};
const result = ref(false);
// 領獎彈窗觸發
const resultComplete = () => {
  result.value = true;
  winListRef.value && winListRef.value.showSlide();
  loadingPause();
  awardPlay();
};

//全螢幕處理
const isFullScreen = ref(false);
const toggleFullScreen = () => {
  // 檢查是否已經處於全螢幕
  if (!isFullScreen.value) {
    // 嘗試進入全螢幕模式
    const element = document.documentElement;

    if (element.requestFullscreen) {
      // 普通瀏覽器
      element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
      // Safari 或 Webkit 瀏覽器
      element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
      // Firefox
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      // IE/Edge
      element.msRequestFullscreen();
    }

    isFullScreen.value = true;
  } else {
    // 退出全螢幕模式
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    isFullScreen.value = false;
  }
};
</script>

<style scoped>
.top-head {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
  background: url("./assets/top_border.png") repeat-x;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2rem;
  z-index: 3;
  background: url("./assets/langhua.png") repeat-x;
  background-size: contain;
}

.main {
  width: 62%;
  height: calc(100% - 60px);
  margin: 4rem auto 0 auto;
}

aside.aside-left {
  left: 0;
}

aside.aside-right {
  right: 0;
}


.lotterty-infogo {
  display: block;
  margin: 6rem auto 0 auto;
  text-align: center
}

.lotterty-infogo h3 {
  display: inline-block;
  color: #D43E44;
  font-size: 5rem;
  font-weight: bold;
  font-family: 'Fantasy', 'STKaiti', 'KaiTi ';
}

.lottery-main {
  position: relative;
  margin: 0 auto;
  width: 100%;
  margin-top: 25px;
  height: calc(100% - 50px);
}

.wrap-border-main {
  position: absolute;
  width: 100%;
  z-index: -5;
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

.dashboard {
  margin-top: 40px;
}

.none h3 {
  cursor: not-allowed;
  color: gray;
  border-color: gray;
}

.lottery-main h4 {
  color: #D43E44;
  font-size: 3rem;
  font-weight: bold;
  font-family: 'Fantasy', 'STKaiti', 'KaiTi ';
}

#clear-control {
  z-index: 2;
  position: fixed;
  bottom: 3%;
  right: 0.5%;
  width: 3rem;
  height: 3rem;
  background: url("./assets/clear.png") 0 0 no-repeat;
  background-size: contain;
  cursor: pointer;
}

#bg-music-control {
  z-index: 2;
  position: fixed;
  bottom: 3%;
  left: 0.5%;
  width: 3rem;
  height: 3rem;
  background: url("./assets/music.png") 0 0 no-repeat;
  background-size: contain;
  cursor: pointer;
}

#bg-music-control.pause {
  background: url("./assets/bell.png") 0 0 no-repeat;
  background-size: contain;
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
</style>
