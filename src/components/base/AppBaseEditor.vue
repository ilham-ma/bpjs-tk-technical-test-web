<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import Squire from "squire-rte";
import IconBold from "../icon/IconBold.vue";
import IconItalic from "../icon/IconItalic.vue";
import IconUnderline from "../icon/IconUnderline.vue";
import IconStrikethrough from "../icon/IconStrikethrough.vue";
import IconListBullet from "../icon/IconListBullet.vue";
import IconListNumber from "../icon/IconListNumber.vue";
import IconLink from "../icon/IconLink.vue";
import DOMPurify from "dompurify";

export interface AppBaseEditorProps {
  placeholder?: string;
  isError?: boolean;
  usingCounter?: boolean;
  disabled?: boolean;
}
const props = defineProps<AppBaseEditorProps>();

const model = defineModel<string>({ default: "" });

const editor = ref<Squire | null>(null);
const editorElement = useTemplateRef<HTMLElement>("editor");

const isEmpty = ref(true);
const plainTextLength = ref(0);
let isSyncingFromModel = false;

function getEditorHTML(): string {
  if (!editor.value) return "";
  const html = editor.value.getHTML();
  const plain = (editorElement.value?.textContent ?? "").trim();
  return plain === "" ? "" : html;
}

function syncModelToEditor(value: string) {
  if (!editor.value) return;
  if (value === getEditorHTML()) return;
  isSyncingFromModel = true;
  editor.value.setHTML(value ?? "");
  updateEmptyState();
  isSyncingFromModel = false;
}

function onEditorInput() {
  updateEmptyState();
  if (isSyncingFromModel) return;
  if (props.disabled) {
    syncModelToEditor(model.value);
    return;
  }
  const value = getEditorHTML();
  if (props.usingCounter && plainTextLength.value > 200) {
    syncModelToEditor(model.value);
    return;
  }
  model.value = value;
}
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const isStrikethrough = ref(false);
const isOL = ref(false);
const isUL = ref(false);
const isLink = ref(false);

function updateEmptyState() {
  const text = editorElement.value?.textContent ?? "";
  isEmpty.value = text.trim() === "";
  plainTextLength.value = text.length;
}

function selectionContainsTag(tag: string): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);
  const upperTag = tag.toUpperCase();

  let node: Node | null = range.startContainer;
  while (node && node !== editorElement.value) {
    if (node instanceof Element && node.tagName === upperTag) return true;
    node = node.parentNode;
  }

  node = range.endContainer;
  while (node && node !== editorElement.value) {
    if (node instanceof Element && node.tagName === upperTag) return true;
    node = node.parentNode;
  }

  return !!range.cloneContents().querySelector(tag.toLowerCase());
}

function updateFormatState() {
  if (!editor.value) return;
  isBold.value = selectionContainsTag("B");
  isItalic.value = selectionContainsTag("I");
  isUnderline.value = selectionContainsTag("U");
  isStrikethrough.value = selectionContainsTag("S");
  isOL.value = selectionContainsTag("OL");
  isUL.value = selectionContainsTag("UL");
  isLink.value = selectionContainsTag("A");
}

onMounted(() => {
  if (!editorElement.value) return;
  editor.value = new Squire(editorElement.value, {
    blockTag: "P",
    blockAttributes: { style: "font-size: 16px;" },
    sanitizeToDOMFragment: (html: string) =>
      DOMPurify.sanitize(html, {
        RETURN_DOM_FRAGMENT: true,
      }) as DocumentFragment,
  });
  editor.value.addEventListener("pathChange", updateFormatState);
  editor.value.addEventListener("select", updateFormatState);
  editor.value.addEventListener("input", onEditorInput);

  if (model.value) {
    syncModelToEditor(model.value);
  } else {
    updateEmptyState();
  }

  if (editorElement.value) {
    editorElement.value.contentEditable = String(!props.disabled);
  }
});

watch(
  () => props.disabled,
  (disabled) => {
    if (editorElement.value) {
      editorElement.value.contentEditable = String(!disabled);
    }
  },
);

watch(
  () => model.value,
  (newValue) => {
    syncModelToEditor(newValue ?? "");
  },
);

function actionBold() {
  if (!editor.value) return;
  if (editor.value.hasFormat("B")) {
    editor.value.removeBold();
  } else {
    editor.value.bold();
  }
  updateFormatState();
}

function actionItalic() {
  if (!editor.value) return;
  if (editor.value.hasFormat("I")) {
    editor.value.removeItalic();
  } else {
    editor.value.italic();
  }
  updateFormatState();
}

function actionUnderline() {
  if (!editor.value) return;
  if (editor.value.hasFormat("U")) {
    editor.value.removeUnderline();
  } else {
    editor.value.underline();
  }
  updateFormatState();
}

function actionStrikethrough() {
  if (!editor.value) return;
  if (editor.value.hasFormat("S")) {
    editor.value.removeStrikethrough();
  } else {
    editor.value.strikethrough();
  }
  updateFormatState();
}

function actionListNumber() {
  if (!editor.value) return;
  if (isOL.value) {
    editor.value.removeList();
  } else {
    editor.value.makeOrderedList();
  }
  updateFormatState();
}

function actionListBullet() {
  if (!editor.value) return;
  if (isUL.value) {
    editor.value.removeList();
  } else {
    editor.value.makeUnorderedList();
  }
  updateFormatState();
}

function actionLink() {
  if (!editor.value) return;
  if (isLink.value) {
    editor.value.removeLink();
    updateFormatState();
    return;
  }
  const url = window.prompt("URL:");
  if (!url) return;
  editor.value.makeLink(url);
  updateFormatState();
}

const NAVIGATION_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Tab",
  "Escape",
  "Shift",
  "Control",
  "Meta",
  "Alt",
];

function onEditorKeyDown(event: KeyboardEvent) {
  if (props.disabled) {
    if (NAVIGATION_KEYS.includes(event.key)) return;
    if ((event.ctrlKey || event.metaKey) && (event.key === "c" || event.key === "a")) return;
    event.preventDefault();
    return;
  }
  if (props.usingCounter && plainTextLength.value >= 200) {
    if (event.ctrlKey || event.metaKey) return;
    if (NAVIGATION_KEYS.includes(event.key)) return;
    if (event.key === "Backspace" || event.key === "Delete") return;
    event.preventDefault();
  }
}

function onEditorPaste(event: ClipboardEvent) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  if (props.usingCounter && plainTextLength.value >= 200) {
    event.preventDefault();
  }
}

function onEditorClick(event: MouseEvent) {
  if (!event.ctrlKey) return;
  const target = event.target as Element;
  const link = target.closest("a");
  if (!link) return;
  const href = link.getAttribute("href");
  if (!href) return;
  event.preventDefault();
  window.open(href, "_blank");
}

const lengthValue = computed(() => plainTextLength.value);

const actions = computed(() => [
  [
    { icon: IconBold, action: actionBold, isActive: isBold.value },
    { icon: IconItalic, action: actionItalic, isActive: isItalic.value },
    {
      icon: IconUnderline,
      action: actionUnderline,
      isActive: isUnderline.value,
    },
    {
      icon: IconStrikethrough,
      action: actionStrikethrough,
      isActive: isStrikethrough.value,
    },
  ],
  [
    {
      icon: IconListNumber,
      action: actionListNumber,
      isActive: isOL.value,
    },
    {
      icon: IconListBullet,
      action: actionListBullet,
      isActive: isUL.value,
    },
  ],
  [
    {
      icon: IconLink,
      action: actionLink,
      isActive: isLink.value,
    },
  ],
]);
</script>

<template>
  <div class="space-y-2">
    <section
      class="bg-app-field-backgroud rounded p-3 space-y-3"
      :class="[
        props.isError ? 'bg-red-100' : 'bg-app-field-backgroud',
        props.disabled ? 'opacity-60 cursor-not-allowed' : '',
      ]"
    >
      <header class="flex items-center space-x-2">
        <template v-for="(action, index) in actions" :key="index">
          <button
            v-for="(a, idx) in action"
            :key="idx"
            type="button"
            :disabled="props.disabled"
            class="flex items-center justify-center rounded p-1"
            :class="[
              { 'bg-gray-300': a.isActive },
              props.disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:bg-gray-300',
            ]"
            @click="a.action"
          >
            <component :is="a.icon" />
          </button>

          <hr
            v-if="index < actions.length - 1"
            class="h-5 border-r border-r-app-label"
          />
        </template>
      </header>

      <div class="relative">
        <div>
          <div
            ref="editor"
            :class="[
              props.isError ? 'text-red-500' : 'text-app-black',
              props.disabled ? 'cursor-not-allowed' : '',
            ]"
            class="editor-content min-h-40 outline-none px-3"
            @click="onEditorClick"
            @keydown="onEditorKeyDown"
            @paste="onEditorPaste"
          ></div>
        </div>
        <span
          v-if="isEmpty && props.placeholder"
          class="absolute top-0 left-3 pointer-events-none select-none text-gray-400"
          style="font-size: 16px"
          >{{ props.placeholder }}</span
        >
      </div>
    </section>

    <section
      v-if="props.usingCounter"
      class="flex items-center justify-between"
    >
      <span class="text-app-label"
        >Recruiter tip: write 200+ characters to increase interview
        chances</span
      >

      <span class="flex items-center text-app-label">
        <span class="text-app-black">{{ lengthValue }}</span> / 200+
      </span>
    </section>
  </div>
</template>

<style scoped>
.editor-content :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}

.editor-content :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}

.editor-content :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
}
</style>
