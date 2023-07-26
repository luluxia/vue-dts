<script setup lang="ts">
import { reactive } from 'vue'
import Message from '../components/Message'
import axios from 'axios'
const formState = reactive({
  showAvatar: false,
  username: '',
  password: '',
  passwordAgain: '',
  gender: 'm',
  chooseAvatar: 0,
  motto: '',
  killMessage: '',
  lastWord: '',
})
// 提交
const submit = async () => {
  const sendData = new FormData()
  sendData.append('cmd', 'post_register')
  sendData.append('username', formState.username)
  sendData.append('npass', formState.password)
  sendData.append('rnpass', formState.passwordAgain)
  sendData.append('gender', formState.gender)
  sendData.append('icon', formState.chooseAvatar.toString())
  sendData.append('motto', formState.motto)
  sendData.append('killmsg', formState.killMessage)
  sendData.append('lastword', formState.lastWord)
  await axios.post('/old/register.php?is_new=1', sendData).then(res => {
    Message({ message: res.data.info || res.data.error })
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center pt-16">
    <p class="text-4xl font-bold text-primary tracking-widest">-账号注册-</p>
    <div class="m-auto w-full border-outlineVariant bg-surface border-t-2 border-b-2 my-4 py-4 flex flex-col">
      <div class="text-onSurface flex flex-1 items-center justify-center">
        <div class="space-y-2 <sm:(w-full pr-4)">
          <!-- 账号 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">账号</p>
            <input v-model="formState.username" placeholder="最长15个英文字符或者汉字，不能出现半角符号" maxlength="15" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="text">
          </div>
          <!-- 密码 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">密码</p>
            <input v-model="formState.password" placeholder="最长24个字符" maxlength="24" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="password">
          </div>
          <!-- 二次密码 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">二次密码</p>
            <input v-model="formState.passwordAgain" placeholder="最长24个字符" maxlength="24" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="password">
          </div>
          <!-- 性别 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">性别</p>
            <div class="py-1">
              <span
                class="bg-surfaceContainer px-2.5 py-1.5 text-sm rounded-sm mr-2 cursor-pointer transition ring-zinc-500"
                :class="formState.gender == 'm' && 'ring-2'"
                @click="formState.gender = 'm'"
              >男生</span>
              <span
                class="bg-surfaceContainer px-2.5 py-1.5 text-sm rounded-sm mr-2 cursor-pointer transition ring-zinc-500"
                :class="formState.gender == 'f' && 'ring-2'"
                @click="formState.gender = 'f'"
              >女生</span>
            </div>
          </div>
          <!-- 头像 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">头像</p>
            <div class="flex justify-center items-center z-1">
              <div
                class="
                  absolute flex justify-start items-start
                  flex-wrap w-147 bg-surfaceContainerHighest p-1 border-2
                  border-outlineVariant rounded transition opacity-0 pointer-events-none
                  <sm:(h-60 w-80 overflow-y-scroll)
                "
                :class="formState.showAvatar && '!opacity-100 !pointer-events-auto'"
              >
                <img
                  @click="formState.showAvatar = false; formState.chooseAvatar = i - 1"
                  v-for="i in 21"
                  class="h-20 rounded m-0.5 cursor-pointer transition ring-zinc-400 hover:ring-2"
                  :src="`/old/img/${formState.gender}_${i - 1}.gif`"
                >
              </div>
              <img
                @click="formState.showAvatar = true"
                class="h-20 border-2 rounded m-auto cursor-pointer border-outlineVariant transition hover:border-outline"
                :src="`/old/img/${formState.gender}_${formState.chooseAvatar}.gif`" alt=""
              >
            </div>
          </div>
          <!-- 口头禅 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">口头禅</p>
            <input v-model="formState.motto" placeholder="写下彰显个性的台词，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="text">
          </div>
          <!-- 杀人宣言 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">杀人宣言</p>
            <input v-model="formState.killMessage" placeholder="写下你杀死对手的留言，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="text">
          </div>
          <!-- 遗言 -->
          <div class="flex items-center space-x-2">
            <p class="font-bold text-sm w-20 mr-2 text-right">遗言</p>
            <input v-model="formState.lastWord" placeholder="写下你不幸被害时的台词，30个字以内" maxlength="30" class="p-2 w-100 bg-surfaceContainerHighest rounded-sm text-sm <sm:flex-1" type="text">
          </div>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div @click="submit()" class="ring-1.5 ring-zinc-300 text-zinc-300 p-0.5 cursor-pointer">
      <p class="text-xl bg-zinc-300 pl-3.5 pr-3 py-1 text-zinc-800 font-bold tracking-widest transition-colors hover:bg-transparent hover:text-zinc-300">提交</p>
    </div>
  </div>
</template>