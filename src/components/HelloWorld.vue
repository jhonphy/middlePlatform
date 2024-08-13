<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (key) => {
  router.push({
    path: `/template/${key}`,
  });
};

defineProps({
  msg: {
    type: String,
    required: true
  }
})

const value = ref();
const data1 = reactive([{
  value: 'beijing',
  label: 'Beijing',
  other: 'extra'
}, {
  value: 'shanghai',
  label: 'Shanghai',
  other: 'extra'
}, {
  value: 'guangzhou',
  label: 'Guangzhou',
  other: 'extra'
}, {
  value: 'chengdu',
  label: 'Chengdu',
  other: 'extra'
}])

</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div id="coder">
      <Codemirror/>
    </div>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
    <a-space>
      <a-button type="primary"  @click="goTo(1)">模板查看1</a-button>
      <a-button type="primary"  @click="goTo(2)">模板查看2</a-button>
      <a-button type="dashed">Dashed</a-button>
      <a-button type="outline">Outline</a-button>
      <a-button type="text">Text</a-button>
      <a-select v-model="value" :style="{width:'320px'}" placeholder="Please select ...">
        <a-option v-for="item in data1" :value="item.value" :label="item.label" :key="item.value" />
      </a-select>
    </a-space>
  </div>
</template>
<style scoped>
#coder{
  margin-top: 10px;
  width: 100%;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
