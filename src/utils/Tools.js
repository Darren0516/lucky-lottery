const Tools = {
    /**
     * 抽獎
     * @param {Array} pools - 抽獎池陣列
     * @param {number} count - 需要抽取的數量
     * @returns {Array} - 返回抽取的結果
     */
    GetTicket(pools, count) {
        // 使用 Web Crypto API 確保隨機性
        const getRandomInt = (min, max) => {
            // 返回一個介於 min 和 max 之間的隨機整數
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array); // 使用加密級隨機數生成器
            return Math.floor(array[0] / (0xFFFFFFFF + 1) * (max - min + 1)) + min;
        };

        // 複製 pools 陣列來防止修改原始資料
        const poolCopy = [...pools];
        const selected = [];

        // 隨機選擇 count 個元素
        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break; // 如果剩餘元素不夠，就提前結束

            const randomIndex = getRandomInt(0, poolCopy.length - 1);  // 基於加密隨機數選擇索引
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