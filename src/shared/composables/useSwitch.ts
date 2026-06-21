import { ref } from "vue";

export function useSwitch() {
  const state = ref(false);

  function open() {
    state.value = true;
  }

  function close() {
    state.value = false;
  }

  function toggle() {
    state.value = !state.value;
  }

  return { state, open, close, toggle };
}
