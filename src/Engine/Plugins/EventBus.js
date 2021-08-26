/**
 * 事件订阅管理
 * 支持模式：
 * 一、map 模式
 * 该模式下所有的事件都是映射关系存在的，要操作指定事件，必须需要先知道订阅的 topic
 * 1、on 订阅并置入map
 * 2、emit 执行map中的一个事件
 * 3、off 取消订阅map中的一个事件
 * 4、clear 清空所有订阅
 * 二、queue 模式
 * 该模式下的所有事件都是按顺序执行的，且每个事件要求为同步执行的事件
 * 1、push 订阅并置入队列的最后面
 * 2、pop 执行队列最前面的事件
 * 3、shift 执行队列最后面的事件
 * 4、unshift 订阅并置入队列的最前面
 */
import { CallWithIllegalParamsError, TypeError } from '../errors'

const CHANNAL_SIZE_LIMIT = 1000

class Channel {
  topicHanlders = {}
  constructor(channelName, bus, subject) {
    this.name = channelName
    this.bus = bus
    this.subject = subject
  }
  on(topic, handler) {
    if (!topic || !handler) {
      throw new CallWithIllegalParamsError(
        'Both "topic" and "handler" are required when call on '
      )
    }
    if (typeof topic !== 'string' || typeof handler !== 'function') {
      throw new TypeError(
        '"topic" should be a "string" and "handler" should be a function '
      )
    }
    if (!this.topicHanlders[topic]) {
      this.topicHanlders[topic] = []
    }
    this.topicHanlders[topic].push(handler)
    return () => this.off(topic, handler)
  }
  off(topic, handler) {
    if (typeof topic !== 'string') {
      throw new TypeError('"topic" should be a "string"')
    }
    if (this.topicHanlders[topic]) {
      this.topicHanlders[topic] = this.topicHanlders[topic].filter(
        h => h !== handler
      )
    }
  }
  emit(topic, payload) {
    if (typeof topic !== 'string' && !(topic instanceof RegExp)) {
      throw new TypeError(
        '"topic" should be a "string" or an instance of RegExp'
      )
    }
    this.bus.dispatchTopic(this.name, topic, payload)
  }
  push(topic, payload) {
    if (typeof topic !== 'string') {
      throw new TypeError('"topic" should be a "string"')
    }
    this.bus.enqueue(this.name, topic, payload)
  }
  pull(topic, handler) {
    if (typeof topic !== 'string' || typeof handler !== 'function') {
      throw new TypeError(
        '"topic" should be a "string" and "handler" should be a function '
      )
    }
    const payload = this.bus.dequeue(this.name, topic)
    handler(payload)
  }
  close() {
    this.bus.close(this.name, this.subject)
  }
}

export class Bus {
  channels = {
    /* [channelName]: Map<subject, Channel> */
  }

  messageQueue = {
    /* [channelName]: { [topic]: Array<Payload> } */
  }

  getChannels = () => this.channels

  connect(channelName, subject) {
    if (!channelName || !subject) {
      throw new CallWithIllegalParamsError(
        'Both "channelName" and "subject" are required when call connect '
      )
    }

    if (!this.channels[channelName]) {
      this.channels[channelName] = new Map()
    }
    const channels = this.channels[channelName]
    if (!channels.get(subject)) {
      channels.set(subject, new Channel(channelName, this, subject))
    }
    if (channels.size > CHANNAL_SIZE_LIMIT) {
      console.error(
        `Too many connections on "${channelName}". You may suffer memeory leak risk. Don't forget to close the channel that wouldn't be used.`
      )
    }
    return channels.get(subject)
  }

  dispatchTopic(channelName, topic, payload) {
    const channels = this.channels[channelName]
    if (channels) {
      channels.forEach((channel, subject) => {
        if (topic instanceof RegExp) {
          Object.keys(channel.topicHanlders)
            .filter(t => topic.test(t))
            .map(t => channel.topicHanlders[t])
            .forEach(handlers => handlers.forEach(handler => handler(payload)))
        } else if (channel.topicHanlders[topic]) {
          channel.topicHanlders[topic].forEach(handler => handler(payload))
        }
      })
    }
  }

  enqueue(channelName, topic, payload) {
    if (!this.messageQueue[channelName]) {
      this.messageQueue[channelName] = {}
    }
    const seletedChannel = this.messageQueue[channelName]
    if (!seletedChannel[topic]) {
      seletedChannel[topic] = []
    }
    seletedChannel[topic].unshift(payload)
  }

  dequeue(channelName, topic) {
    if (
      this.messageQueue[channelName] &&
      this.messageQueue[channelName][topic]
    ) {
      return this.messageQueue[channelName][topic].pop()
    }
  }

  close(channelName, subject) {
    const channels = this.channels[channelName]
    if (channels) {
      channels.delete(subject)
    }
  }
}

class BusPlugin {
  apply(app) {
    app.bus = new Bus()
  }
}

export default BusPlugin
