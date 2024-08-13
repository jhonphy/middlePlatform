<template>
  <codemirror
    v-model="code"
    placeholder="Code goes here..."
    :style="{ height: '400px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="log('change', $event)"
    @focus="log('focus', $event)"
    @blur="log('blur', $event)"
  />
</template>

<script>
  import { defineComponent, ref, shallowRef } from 'vue'
  import { Codemirror } from 'vue-codemirror'
  import { python, pythonLanguage } from '@codemirror/lang-python'
  import { oneDark } from '@codemirror/theme-one-dark'
  import {completeFromList, ifNotIn } from "@codemirror/autocomplete"

  export default defineComponent({
    components: {
      Codemirror
    },
    setup() {
      const code = ref('')
      const allKeyList = [
        { label: "@match", type: "keyword", apply: "match", detail: "match" },
        { label: "@hello", type: "variable", apply: "hello", detail: "hellodetail" },
        { label: "@magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
        { label: "main", type: "keyword", apply: "⠁main:", detail: "main fn" },
        { label: "defc", type: "keyword", apply: "⠁def c", detail: "c++" },
      ]
      const selfCompletion = /*@__PURE__*/ifNotIn([], /*@__PURE__*/completeFromList(/*@__PURE__*/[].concat(allKeyList)));
      const pythonSnippets = pythonLanguage.data.of({
        autocomplete: selfCompletion
      })
      const extensions = [python(), oneDark, pythonSnippets]

      // Codemirror EditorView instance ref
      const view = shallowRef()
      const handleReady = (payload) => {
        view.value = payload.view
      }

      return {
        code,
        extensions,
        handleReady,
        log: console.log,
        allKeyList
      }
    }
  })
</script>