let waitTimer = setTimeout(() => {
  state.loading = true
}, 200)
await command({ mode: 'command', command: '' }).then(res => {
  window.clearTimeout(waitTimer)
  state.loading = false
  const data = res as any
  state.playerState = data.playerState
  state.actionLog = data.actionLog
})