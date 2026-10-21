import { defineStore } from 'pinia';
import { ref } from 'vue';
import { notificationApi } from '@/api';
export const useNotificationStore = defineStore('notification', () => {
    const unreadCount = ref(0);
    const recent = ref([]);
    let pollTimer = null;
    async function fetchUnread() {
        try {
            const data = await notificationApi.unread();
            unreadCount.value = data.count || 0;
        }
        catch { }
    }
    async function fetchRecent() {
        try {
            const list = await notificationApi.list();
            const items = list.items || list.notifications || list || [];
            recent.value = items.slice(0, 5);
        }
        catch { }
    }
    function startPolling() {
        stopPolling();
        fetchUnread();
        fetchRecent();
        pollTimer = setInterval(() => {
            fetchUnread();
        }, 30000);
    }
    function stopPolling() {
        if (pollTimer) {
            clearInterval(pollTimer);
            pollTimer = null;
        }
    }
    async function markRead(id) {
        try {
            await notificationApi.markRead(id);
            if (unreadCount.value > 0)
                unreadCount.value--;
            const n = recent.value.find(x => x.id === id);
            if (n)
                n.isRead = true;
        }
        catch { }
    }
    async function markAllRead() {
        try {
            await notificationApi.markAllRead();
            unreadCount.value = 0;
            recent.value.forEach(n => (n.isRead = true));
        }
        catch { }
    }
    function reset() {
        unreadCount.value = 0;
        recent.value = [];
        stopPolling();
    }
    return {
        unreadCount,
        recent,
        fetchUnread,
        fetchRecent,
        startPolling,
        stopPolling,
        markRead,
        markAllRead,
        reset,
    };
});
