/**
 *@author ZY
 *@date 2023/6/28 22:36
 *@Description:复制文本指令
 * 使用: v-copy='内容'
 */
import {ZyMessage} from "../../utils/util.toast";

const copyTextDirective = {
    mounted(el, binding) {
        // 添加点击事件监听器
        el.addEventListener('click', () => {
            // 动态创建 textarea 标签
            const textarea = document.createElement('textarea');
            // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
            textarea.readOnly = 'readonly';
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            // 将要 copy 的值赋给 textarea 标签的 value 属性
            textarea.value = binding.value
            // 将 textarea 插入到 body 中
            document.body.appendChild(textarea);
            // 选中值并复制
            textarea.select();

            // 尝试执行复制操作
            try {
                const successful = document.execCommand('copy')
                const message = successful ? '复制成功' : '复制失败'
                successful ? ZyMessage.success(message) : ZyMessage.error(message)
            } catch (error) {
                ZyMessage.error('复制操作失败')
                console.log('复制操作失败:', error)
            }

            // 移除临时创建的textarea元素
            document.body.removeChild(textarea)
        })
    }
}

// 导出自定义指令
export default copyTextDirective

