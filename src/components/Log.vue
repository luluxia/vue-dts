<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import { inject } from 'vue'
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
const haveNewMessage = inject('haveNewMessage') as any
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
      if (res.data.lastcid !== messageState.sendData.lastcid) {
        haveNewMessage.value = true
      }
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
let timer: any
onMounted(() => {
  getMessage()
  timer = setInterval(() => {
    getMessage()
  }, 15000)
})
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<template>
  <div v-if="gameState" class="text-zinc-300 absolute w-full h-full">
    <h1 class="m-4 text-zinc-400 text-xl font-bold tracking-wider border-b-zinc-700 border-b-2 border-dashed mb-1">
      消息<span class="text-base -ml-1 opacity-30">MESSAGE</span>
    </h1>
    <div class="h-[calc(100%-13rem)] overflow-auto mr-4">
      <div v-for="item in message" class="message flex items-end px-2" v-html="item"></div>
    </div>
    <div class="absolute bottom-0 w-full p-4">
      <textarea v-model="messageState.message" class="bg-zinc-700/50 outline-none w-full h-25 p-2 rounded" type="text"></textarea>
      <div class="flex justify-between">
        <div class="flex justify-center items-center">
          <div
            class="absolute bottom-12 bg-zinc-800 border-2 border-zinc-500 rounded p-0.5 transition opacity-0 pointer-events-none"
            :class="messageState.showType && '!opacity-100 !pointer-events-auto'"
          >
            <p @click="messageState.sendData.chattype = '0'; messageState.showType = false" class="px-2.5 py-1 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)">全员</p>
            <p @click="messageState.sendData.chattype = '1'; messageState.showType = false" v-if="gameState.playerState?.team != ''" class="px-2.5 py-1 transition cursor-pointer hover:(bg-zinc-700 ring-2 ring-zinc-500)">队伍</p>
          </div>
          <div class="px-1 py-0.5 flex rounded transition cursor-pointer hover:bg-zinc-800" @click="messageState.showType = !messageState.showType">
            <img class="w-5.5 mr-1" src="/img/menu.svg">
            <span v-if="messageState.sendData.chattype === '0'">全员</span>
            <span v-if="messageState.sendData.chattype === '1'">队伍</span>
          </div>
        </div>
        <div class="flex space-x-2">
          <p @click="getMessage()" class="px-2 py-0.5 rounded text-shadow cursor-pointer">刷新</p>
          <div class="bg-slate-700 rounded text-shadow flex justify-center items-end cursor-pointer">
            <div
              class="
                absolute bottom-12 flex justify-start items-start
                flex-wrap w-171 bg-zinc-800 p-1 border-2
                border-zinc-500 rounded transition opacity-0 pointer-events-none"
              :class="messageState.showEmoji && '!opacity-100 !pointer-events-auto'"
              >
              <img
                v-for="id in emojis"
                class="h-20 m-0.5 cursor-pointer transition ring-zinc-400 hover:ring-2"
                :src="`/old/img/emoticons/${id}.png`"
                @click="messageState.message += `[${id}]`"
              >
            </div>
            <span class="px-3 py-0.5" @click="messageState.showEmoji = !messageState.showEmoji">表情</span>
          </div>
          <p @click="sendMessage()" class="px-3 py-0.5 bg-slate-700 rounded text-shadow cursor-pointer">发送</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="postcss">
.message span {
  @apply !font-normal;
}
</style>