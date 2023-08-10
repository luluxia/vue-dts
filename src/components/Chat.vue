<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, inject } from 'vue'
import tippy, { hideAll } from 'tippy.js'
import axios from 'axios'
import type { GameState } from '../types/interface'
const gameState = inject<GameState>('state') as GameState
const emojis = ['Azure_1', 'Azure_2', 'Azure_3', 'Azure_4', 'Crimson_1', 'Crimson_2', 'Crimson_3', 'Crimson_4', 'Fleur_1', 'Fleur_2', 'Fleur_3', 'Fleur_4', 'Gothic_1', 'Gothic_2', 'Gothic_3', 'Gothic_4', 'Lilac_1', 'Lilac_2', 'Lilac_3', 'Lilac_4', 'Marylin_1', 'Marylin_2', 'Marylin_3', 'Marylin_4', 'Sanma_1', 'Sanma_2', 'Sanma_3', 'Sanma_4', 'Vivian_1', 'Vivian_2', 'Vivian_3', 'Vivian_4', 'example']
const messageState = reactive<{
  messageList: any,
  message: string,
  showEmoji: boolean,
  showType: boolean,
  sendData: {
    lastcid: string,
    teamID: string,
    sendmode: string,
    chattype: string,
    chatmsg: string,
  }
}>({
  messageList: {},
  message: '',
  showEmoji: false,
  showType: false,
  sendData: {
    lastcid: '',
    teamID: '',
    sendmode: 'ref',
    chattype: '0',
    chatmsg: '',
  }
})
const message = computed(() => {
  return Object.values(messageState.messageList).reverse()
})
const getMessage = () => {
  const sendData = new FormData()
  sendData.append('lastcid', messageState.sendData.lastcid)
  sendData.append('teamID', messageState.sendData.teamID)
  sendData.append('sendmode', 'ref')
  sendData.append('chattype', messageState.sendData.chattype)
  sendData.append('chatmsg', messageState.sendData.chatmsg)
  axios.post('/old/chat.php', sendData).then(res => {
    if (res.data) {
      messageState.sendData.lastcid = res.data.lastcid
      const message = res.data.msg
      Object.keys(message).forEach(index => {
        messageState.messageList[index] = message[index]
      })
    }
  })
}
const sendMessage = () => {
  const sendData = new FormData()
  sendData.append('lastcid', messageState.sendData.lastcid)
  sendData.append('teamID', messageState.sendData.teamID)
  sendData.append('sendmode', 'send')
  sendData.append('chattype', messageState.sendData.chattype)
  sendData.append('chatmsg', messageState.message)
  axios.post('/old/chat.php', sendData).then(res => {
    messageState.message = ''
    if (res.data) {
      messageState.sendData.lastcid = res.data.lastcid
      const message = res.data.msg
      Object.keys(message).forEach(index => {
        messageState.messageList[index] = message[index]
      })
    }
  })
}
const targetRef = ref()
const targetListRef = ref()
const emojiRef = ref()
const emojiListRef = ref()
let timer: any
onMounted(() => {
  getMessage()
  timer = setInterval(() => {
    getMessage()
  }, 15000)
  tippy(targetRef.value, {
    content: targetListRef.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
  })
  tippy(emojiRef.value, {
    content: emojiListRef.value,
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    arrow: false,
  })
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div>
    <div v-if="gameState" class="relative bg-surfaceContainerHigh/50 text-onSurface text-sm rounded">
      <!-- 消息框 -->
      <input @keypress.enter="sendMessage()" v-model="messageState.message" class="bg-transparent !ring-0 w-full p-2"/>
      <!-- 功能 -->
      <div class="flex justify-between pt-0 p-1">
        <!-- 目标 -->
        <div ref="targetRef" class="px-1 py-0.5 flex rounded-sm transition cursor-pointer hover:(bg-primary text-onPrimary)">
          <span v-if="messageState.sendData.chattype === '0'">全员</span>
          <span v-if="messageState.sendData.chattype === '1'">队伍</span>
        </div>
        <!-- 目标选项 -->
        <div ref="targetListRef" class="">
          <p @click="messageState.sendData.chattype = '0'; messageState.showType = false" class="px-2.5 py-1 transition cursor-pointer hover:(bg-primary text-onPrimary)">全员</p>
          <p @click="messageState.sendData.chattype = '1'; messageState.showType = false" v-if="gameState.playerState?.team != ''" class="px-2.5 py-1 transition cursor-pointer hover:(bg-primary text-onPrimary)">队伍</p>
        </div>
        <!-- 表情与发送 -->
        <div class="flex space-x-1.5 items-center">
          <p @click="getMessage()" class="px-2 py-0.5 cursor-pointer">刷新</p>
          <p ref="emojiRef" class="px-3 py-0.5 bg-primary text-onPrimary rounded-sm cursor-pointer transition hover:bg-primary/80">表情</p>
          <p @click="sendMessage()" class="px-3 py-0.5 bg-primary text-onPrimary rounded-sm cursor-pointer transition hover:bg-primary/80">发送</p>
        </div>
        <!-- 表情列表 -->
        <div ref="emojiListRef" class="flex justify-start items-start flex-wrap w-171 p-1">
          <img
            v-for="id in emojis"
            class="h-20 m-0.5 cursor-pointer transition ring-outlineVariant rounded hover:ring-2"
            :src="`/old/img/emoticons/${id}.png`"
            @click="messageState.message += `[${id}]`"
          >
        </div>
      </div>
    </div>
    <div class="message overflow-auto mt-1 max-h-140 space-y-1 text-onSurface text-sm font-bold <md:max-h-[calc(100vh-12rem)]">
      <p v-for="item in message" class="break-all break-words" v-html="item"></p>
    </div>
  </div>
</template>
<style lang="postcss">
.message img {
  @apply inline-block align-bottom;
}
</style>