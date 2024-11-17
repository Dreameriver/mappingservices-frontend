import { defineStore } from 'pinia'

export const useOptionStore = defineStore('options', {
    state: () => ({
        currentTag: null, // 用于存储当前选中的 tag
        search_tag_now: false,
    }),
    actions: {
        setCurrentTag(tag, search_tag_now) {
            this.currentTag = tag;
            this.search_tag_now = search_tag_now;
        },
    },
    getters: {
        getCurrentTag() {
            return {
                currentTag: this.currentTag,
                search_tag_now: this.search_tag_now,
            };
        }
    }
});
