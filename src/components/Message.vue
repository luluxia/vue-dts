<template>
  <div
    ref="dom"
    class="
      w-max mx-auto mb-2 px-3 py-2 rounded bg-surfaceContainerHigh text-onSurface border-2 border-outline shadow-xl transition-all pointer-events-auto
    "
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"

defineProps({
  message: {
    type: String,
    required: true,
  },
})

const dom = ref()

const showMessage = () => {
  const messageElement = dom.value
  messageElement.style.opacity = '0'
  messageElement.style.marginTop = '0px'
  if (document.querySelector('.message-list')) {
    const messageList = document.querySelector('.message-list')
    messageList?.appendChild(messageElement)
  } else {
    const messageList = document.createElement('div')
    messageList.className = 'message-list'
    messageList.appendChild(messageElement)
    document.body.appendChild(messageList)
  }
  setTimeout(() => {
    messageElement.style.opacity = '1'
  }, 10)
  setTimeout(() => {
    messageElement.style.opacity = '0'
    messageElement.style.marginTop = '-52px'
    setTimeout(() => {
      document.querySelector('.message-list')?.removeChild(messageElement)
      if (document.querySelector('.message-list')?.children.length === 0) {
        document.body.removeChild(document.querySelector('.message-list') as Element)
      }
    }, 300)
  }, 3000)
}

onMounted(() => {
  showMessage()
})

</script>

<style lang="postcss">
.message-list {
  @apply fixed top-5 w-full text-center z-1 pointer-events-none;
}
</style>