<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    Vue + Trpc + Koa
  </header>
  <article>content:{{ content }}</article>
</template>
<script setup lang="ts">
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../demo-trpc/src/trpc-router'
import { ref } from 'vue'

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://127.0.0.1:3000/trpc'
    })
  ]
})

const content = ref('')

client.getUser.query({ id: 1 }).then(res => {
  console.log('===res 1', res)
  content.value = JSON.stringify(res)
})
client.getUser.query({ id: 2 }).then(res => {
  console.log('===res 2', res)
})
client.addUser.mutate({ name: 'Tom' })
client.addUser.mutate({ name: 'Jerry' })
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
