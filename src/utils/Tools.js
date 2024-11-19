const Tools = {
    /**
     * 抽獎
     * @param {Array} pools - 抽獎池陣列
     * @param {number} count - 需要抽取的數量
     * @returns {Array} - 返回抽取的結果
     */
    GetTicket(pools, count) {
        // 使用當前時間的 ticks 作為隨機種子
        const seed = Date.now();

        // 使用 Math.random() 根據種子來生成隨機數
        const random = (seed) => {
            // 設置隨機種子為當前時間 (可以將種子改為更具體的時間數值進行混合)
            const pseudoRandom = Math.sin(seed) * 10000;
            return pseudoRandom - Math.floor(pseudoRandom);  // 轉換為 0-1 之間的浮點數
        };

        // 用於隨機選擇元素的輔助函數
        const getRandomIndex = (arr, seed) => {
            return Math.floor(random(seed) * arr.length);
        };

        // 複製 pools 陣列來防止修改原始資料
        const poolCopy = [...pools];
        const selected = [];

        // 隨機選擇 count 個元素
        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break; // 如果剩餘元素不夠，就提前結束

            const randomIndex = getRandomIndex(poolCopy, seed + i);  // 基於種子選擇元素
            selected.push(poolCopy.splice(randomIndex, 1)[0]);  // 選擇並刪除已選元素
        }

        return selected;
    },
    /**音樂淡入 */
    MusicFadeIn(audio, duration) {
        // 設定初始音量為 0
        audio.volume = 0;
        audio.play();  // 開始播放音頻

        let step = 0.05;  // 每次增長的音量步長
        let interval = duration / (1 / step);  // 每個步驟的時間

        // 使用 setInterval 改變音量
        let fadeInterval = setInterval(function () {
            if (audio.volume < 1) {
                audio.volume = Math.min(1, audio.volume + step);  // 增加音量，並確保不超過 1
            } else {
                clearInterval(fadeInterval);  // 停止淡入
            }
        }, interval);
    },
    /**音樂淡出 */
    MusicFadeOut(audio, duration) {
        let step = 0.05;  // 每次減少的音量步長
        let interval = duration / (1 / step);  // 每個步驟的時間

        // 使用 setInterval 改變音量
        let fadeInterval = setInterval(function () {
            if (audio.volume > 0) {
                audio.volume = Math.max(0, audio.volume - step);  // 減少音量，並確保不低於 0
            } else {
                audio.pause();  // 音量減到 0 後停止播放
                clearInterval(fadeInterval);  // 停止淡出
            }
        }, interval);
    },
    /**音樂切換 */
    SwitchMusic(currentAudio, newAudio, fadeOutDuration, fadeInDuration) {
        this.MusicFadeOut(currentAudio, fadeOutDuration);  // 淡出當前音樂

        // 等待淡出完成後，開始淡入新音樂
        setTimeout(function () {
            newAudio.play();  // 播放新音樂
            MusicFadeIn(newAudio, fadeInDuration);  // 淡入新音樂
        }, fadeOutDuration);  // 等待淡出結束的時間後執行
    }
};

export default Tools;