import {ref,reactive} from 'vue';
import {defineStore} from 'pinia';
import setting from '@/setting.js'
export const useSearchStore = defineStore('search', () => {
    const searchActive = ref(false);
    const hotkey = reactive({
        open: setting.hotkey.search.open,
        close: setting.hotkey.search.close
    },);

    /**
     * @description 切换激活状态
     * @param {Object} state state
     */
    function toggle(state) {
        searchActive.value = !searchActive.value
    }
    function showSearchPanel(value) {
        searchActive.value = value;
    }

    return {
        hotkey,
        searchActive,
        showSearchPanel,
        toggle,
    };
});
