import {ref, reactive} from 'vue';
import {defineStore} from 'pinia';
import {useRoute, useRouter} from "vue-router";

export const useTagsViewStore = defineStore('tagsView', () => {
    const showTagsBar = ref(true);
    const currentRoute = useRoute();
    const router = useRouter();
    const state = reactive({
        tagsList: []
    });

    /**
     * @description 添加tags
     * @param {Object} route
     */
    function addTag(route) {

        const isDuplicate = state.tagsList.some(tag => tag.path === route.path);

        if (!isDuplicate) {
            state.tagsList.push(route);
        }
    }

    // 删除标签
    async function removeTag(path) {
        const currentIndex = state.tagsList.findIndex(tag => tag.path === path);
        if (currentIndex !== -1) {
            // 先将标签移除
            state.tagsList = state.tagsList.filter(tag => tag.path !== path);

            if (path === currentRoute.path) {
                // 如果是关闭当前的标签，则跳转到当前位置的后一个标签 如果没有则跳转前一个
                const nextTag = state.tagsList[currentIndex];
                const prevTag = state.tagsList[currentIndex - 1];

                if (nextTag) {
                    await router.push(nextTag.path);
                } else if (prevTag) {
                    await router.push(prevTag.path);
                } else {
                    // 如果前后都没有则跳转首页
                    await router.replace('/')
                    state.tagsList = [{
                        path: currentRoute.path,
                        meta: currentRoute.meta,
                        name: currentRoute.name,
                    }]
                }
            }
        } else {
            state.tagsList = state.tagsList.filter(tag => tag.path !== path);
        }
    }

    // 关闭标签
    async function closeTags(command, tagName) {
        if (tagName) {
            await router.push({path: tagName})
        }
        switch (command) {
            case 'all':
                await router.replace('/')
                state.tagsList = [{
                    path: currentRoute.path,
                    meta: currentRoute.meta,
                    name: currentRoute.name,
                }]
                break;
            case 'right':
                // 找到当前路径标签的索引
                const currentIndex = state.tagsList.findIndex(tag => tag.path === currentRoute.path);
                if (currentIndex !== -1) {
                    // 过滤掉当前路径标签右边的标签
                    state.tagsList = state.tagsList.slice(0, currentIndex + 1);
                }
                break;
            case 'left':
                // 找到当前路径标签的索引
                const currentIdx = state.tagsList.findIndex(tag => tag.path === currentRoute.path);
                if (currentIdx !== -1) {
                    // 过滤掉当前路径标签左边的标签
                    state.tagsList = state.tagsList.slice(currentIdx);
                }
                break;
            case 'other':
                // 保留当前路径标签，过滤掉其他所有标签
                state.tagsList = state.tagsList.filter(tag => tag.path === currentRoute.path);
                break;
        }
    }


    return {
        addTag,
        removeTag,
        closeTags,
        showTagsBar,
        state,
    };
});
