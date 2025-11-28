/**
 *@author ZY
 *@date 2023/6/28 22:36
 *@Description:防抖指令 在指定的延迟时间内，防止频繁触发事件。
 * 使用: v-debounce  这里是防止点击
 */
const debounceDirective = {
    mounted(el, binding) {
        const delay = parseInt(binding.value) || 300
        let timeoutId

        el.addEventListener('click', () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                binding.value()
            }, delay)
        })
    }
}

// 导出自定义指令
export default debounceDirective

