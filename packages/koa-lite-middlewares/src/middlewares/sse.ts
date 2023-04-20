import { log } from 'console'
import { Middleware } from 'koa'
import { PassThrough } from 'stream'

export interface SSE {
  write: (data: string, cb?: () => void) => void
  end: (cb?: () => void) => void
  onClose: () => void
}

export const initSSE: Middleware = async (ctx, next) => {
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  const stream = new PassThrough()
  stream.on('close', () => {
    log('==stream closed by client==')
    ctx.sse.onClose()
  })
  ctx.body = stream
  const sseWrite = (data: string, cb = () => {}) => {
    stream.write(`data: ${data}\n\n`)
    cb()
  }
  const sseEnd = (cb = () => {}) => {
    log('==stream end==')
    stream.end()
    stream.destroy()
    cb()
  }
  ctx.sse = {
    write: sseWrite,
    end: sseEnd,
    onClose: () => {}
  }
  await next()
}

// #region ======================= 测试sse =======================
// let i = 0
// const timer = setInterval(() => {
//   if (i >= 2) {
//     ctx.sse.end()
//     clearInterval(timer)
//   } else {
//     ctx.sse.write(`index:${i}`)
//     i++
//   }
// }, 1000)
// #endregion ==================== 测试sse =======================
