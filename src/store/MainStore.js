import { defineStore } from 'pinia';

export const MainStore = defineStore('MainStore', {
    state: () => ({
        partkey: 55,
        /**摸獎券 */
        tickets: [...Array(107).keys()].map(i => i + 1),
        /**已中獎 */
        awardList: {
            '1': [],
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': [],
            '99': []
        },
        /**捐出排除 */
        ignore: []
    }),
    actions: {
        /**初始化中獎 */
        InitialAward() {
            // 防護驗證
            if (!!!localStorage['award'])
                return;

            const awardList = JSON.parse(localStorage['award']);
            if (awardList)
                this.awardList = awardList;
        },
        /**
         * 設定中獎
         * @param {獎號} key 
         * @param {結果} list 
         */
        SetAward(key, list) {
            // 防護驗證
            if (!this.awardList[key] || !list)
                return;

            this.awardList[key] = this.awardList[key].concat(list).sort((a, b) => a - b);

            // 更新localStorage
            localStorage['award'] = JSON.stringify(this.awardList);
        },
        /**
         * 捐出處理
         * @param {獎項} key 
         * @param {獎號} id 
         */
        SetDonate(key, id) {
            // 防護驗證
            if (!this.awardList[key] || this.ignore.includes(key))
                return;

            this.ignore.push(id);
            // 更新localStorage
            localStorage['ignore'] = JSON.stringify(this.ignore);
            // 移除該中獎者
            this.awardList[key].splice(this.awardList[key].indexOf(id), 1);
            // 更新localStorage
            localStorage['award'] = JSON.stringify(this.awardList);
        },
        /**清除捐出陣列 */
        ClearDonate() {
            this.ignore = [];
            // 更新localStorage
            localStorage['ignore'] = JSON.stringify(this.ignore);
        }
    },
    getters: {
        /**摸獎池: 排除已中獎 */
        pools() {
            return this.tickets.filter(id => !Object.values(this.awardList).flat().includes(id) && !this.ignore.includes(id));
        },
        /**加碼抽獎池數量 */
        lastPoolsCount() {
            return this.tickets.filter(id => !this.ignore.includes(id)).length;
        },
        /**加碼獎抽獎池 */
        lastPools() {
            const fisrt = this.awardList['1'][0];
            if (!fisrt)
                return [];

            return this.tickets.filter(id => !this.ignore.includes(id) && (fisrt >= this.partkey ? id < this.partkey : id >= this.partkey));
        }
    }
});