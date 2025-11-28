export const ZyConfirm = function (content, title = '提示') {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            content,
            title,
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                resolve(true)
            })
            .catch(() => {
                resolve(false)
            })
    })
}

class Message {
    info(content = '提示信息', duration) {
        return this.showMessage('', content, duration);
    }

    success(content = '成功信息', duration) {
        return this.showMessage('success', content, duration);
    }

    warning(content = '警告信息', duration) {
        return this.showMessage('warning', content, duration);
    }

    error(content = '错误信息', duration) {
        return this.showMessage('error', content, duration);
    }

    showMessage(type, content, duration) {
        return ElMessage({
            message: duration,
            type: type,
        })
    }
}

class Notification {
    info(description, message = '提示',position) {
        return this.showNotification('info', description, message,position);
    }

    success(description, message = '成功',position) {
        return this.showNotification('success', description, message,position);
    }

    warning(description, message = '警告',position) {
        return this.showNotification('warning', description, message,position);
    }

    error(description, message = '错误',position) {
        return this.showNotification('error', description, message,position);
    }

    showNotification(type, description, message,position='top-right') {
        return ElNotification({
            title: message,
            message: description,
            type: type,
            position,
        })

    }
}

export const ZyMessage = new Message();
export const ZyNotification = new Notification();
