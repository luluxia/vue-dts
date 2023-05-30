import { createVNode, render } from "vue"
import MessageComponent from "./Message.vue"

const Message = (props: { message: string }) => {
  const messageComponent = createVNode(MessageComponent, props)
  render(messageComponent, document.createElement("div"))
}

export default Message