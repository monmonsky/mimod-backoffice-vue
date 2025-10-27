<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

const props = defineProps<{
    modelValue: string;
    placeholder?: string;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit.configure({
            // Disable bold & italic from StarterKit to avoid conflicts
            // We'll use the individual extensions instead
        }),
        Underline,
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                class: 'text-primary underline',
            },
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Color,
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
        },
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
});

// Watch for external changes
watch(
    () => props.modelValue,
    (value) => {
        if (editor.value && editor.value.getHTML() !== value) {
            editor.value.commands.setContent(value, false);
        }
    }
);

// Link modal
const showLinkModal = ref(false);
const linkUrl = ref('');

const setLink = () => {
    if (!editor.value) return;

    if (linkUrl.value === '') {
        editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
        editor.value.chain().focus().extendMarkRange('link').setLink({ href: linkUrl.value }).run();
    }

    showLinkModal.value = false;
    linkUrl.value = '';
};

const openLinkModal = () => {
    if (!editor.value) return;
    const previousUrl = editor.value.getAttributes('link').href;
    linkUrl.value = previousUrl || '';
    showLinkModal.value = true;
};

// Color picker
const showColorPicker = ref(false);
const colors = [
    '#000000', '#DC2626', '#EA580C', '#D97706', '#CA8A04', '#65A30D',
    '#16A34A', '#059669', '#0D9488', '#0891B2', '#0284C7', '#2563EB',
    '#4F46E5', '#7C3AED', '#9333EA', '#C026D3', '#DB2777', '#E11D48',
];

const setColor = (color: string) => {
    if (!editor.value) return;
    editor.value.chain().focus().setColor(color).run();
    showColorPicker.value = false;
};

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<template>
    <div class="border border-base-300 rounded-lg overflow-hidden bg-base-100">
        <!-- Toolbar -->
        <div v-if="editor" class="border-b border-base-300 bg-base-200 p-2 flex flex-wrap gap-1">
            <!-- Text Formatting -->
            <div class="join">
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'btn-active': editor.isActive('bold') }"
                    class="btn btn-xs join-item"
                    title="Bold (Ctrl+B)">
                    <span class="iconify lucide--bold size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'btn-active': editor.isActive('italic') }"
                    class="btn btn-xs join-item"
                    title="Italic (Ctrl+I)">
                    <span class="iconify lucide--italic size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleUnderline().run()"
                    :class="{ 'btn-active': editor.isActive('underline') }"
                    class="btn btn-xs join-item"
                    title="Underline (Ctrl+U)">
                    <span class="iconify lucide--underline size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'btn-active': editor.isActive('strike') }"
                    class="btn btn-xs join-item"
                    title="Strikethrough">
                    <span class="iconify lucide--strikethrough size-4" />
                </button>
            </div>

            <!-- Headings -->
            <div class="join">
                <button
                    type="button"
                    @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'btn-active': editor.isActive('heading', { level: 1 }) }"
                    class="btn btn-xs join-item"
                    title="Heading 1">
                    <span class="iconify lucide--heading-1 size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'btn-active': editor.isActive('heading', { level: 2 }) }"
                    class="btn btn-xs join-item"
                    title="Heading 2">
                    <span class="iconify lucide--heading-2 size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'btn-active': editor.isActive('heading', { level: 3 }) }"
                    class="btn btn-xs join-item"
                    title="Heading 3">
                    <span class="iconify lucide--heading-3 size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'btn-active': editor.isActive('paragraph') }"
                    class="btn btn-xs join-item"
                    title="Paragraph">
                    <span class="iconify lucide--pilcrow size-4" />
                </button>
            </div>

            <!-- Lists -->
            <div class="join">
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'btn-active': editor.isActive('bulletList') }"
                    class="btn btn-xs join-item"
                    title="Bullet List">
                    <span class="iconify lucide--list size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'btn-active': editor.isActive('orderedList') }"
                    class="btn btn-xs join-item"
                    title="Numbered List">
                    <span class="iconify lucide--list-ordered size-4" />
                </button>
            </div>

            <!-- Alignment -->
            <div class="join">
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('left').run()"
                    :class="{ 'btn-active': editor.isActive({ textAlign: 'left' }) }"
                    class="btn btn-xs join-item"
                    title="Align Left">
                    <span class="iconify lucide--align-left size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('center').run()"
                    :class="{ 'btn-active': editor.isActive({ textAlign: 'center' }) }"
                    class="btn btn-xs join-item"
                    title="Align Center">
                    <span class="iconify lucide--align-center size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('right').run()"
                    :class="{ 'btn-active': editor.isActive({ textAlign: 'right' }) }"
                    class="btn btn-xs join-item"
                    title="Align Right">
                    <span class="iconify lucide--align-right size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().setTextAlign('justify').run()"
                    :class="{ 'btn-active': editor.isActive({ textAlign: 'justify' }) }"
                    class="btn btn-xs join-item"
                    title="Justify">
                    <span class="iconify lucide--align-justify size-4" />
                </button>
            </div>

            <!-- Link & Color -->
            <div class="join">
                <button
                    type="button"
                    @click="openLinkModal"
                    :class="{ 'btn-active': editor.isActive('link') }"
                    class="btn btn-xs join-item"
                    title="Insert Link">
                    <span class="iconify lucide--link size-4" />
                </button>
                <div class="dropdown dropdown-end">
                    <button
                        type="button"
                        tabindex="0"
                        class="btn btn-xs join-item"
                        title="Text Color">
                        <span class="iconify lucide--palette size-4" />
                    </button>
                    <div tabindex="0" class="dropdown-content z-[1] p-2 shadow-lg bg-base-100 rounded-lg w-48 border border-base-300">
                        <div class="grid grid-cols-6 gap-1">
                            <button
                                v-for="color in colors"
                                :key="color"
                                type="button"
                                @click="setColor(color)"
                                class="w-6 h-6 rounded border border-base-300 hover:scale-110 transition-transform"
                                :style="{ backgroundColor: color }"
                                :title="color">
                            </button>
                        </div>
                        <button
                            type="button"
                            @click="editor.chain().focus().unsetColor().run()"
                            class="btn btn-xs btn-ghost w-full mt-2">
                            Reset Color
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quote & Code -->
            <div class="join">
                <button
                    type="button"
                    @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'btn-active': editor.isActive('blockquote') }"
                    class="btn btn-xs join-item"
                    title="Blockquote">
                    <span class="iconify lucide--quote size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleCode().run()"
                    :class="{ 'btn-active': editor.isActive('code') }"
                    class="btn btn-xs join-item"
                    title="Inline Code">
                    <span class="iconify lucide--code size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'btn-active': editor.isActive('codeBlock') }"
                    class="btn btn-xs join-item"
                    title="Code Block">
                    <span class="iconify lucide--code-2 size-4" />
                </button>
            </div>

            <!-- Divider -->
            <button
                type="button"
                @click="editor.chain().focus().setHorizontalRule().run()"
                class="btn btn-xs"
                title="Horizontal Rule">
                <span class="iconify lucide--minus size-4" />
            </button>

            <!-- Undo/Redo -->
            <div class="join ml-auto">
                <button
                    type="button"
                    @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().undo()"
                    class="btn btn-xs join-item"
                    title="Undo (Ctrl+Z)">
                    <span class="iconify lucide--undo size-4" />
                </button>
                <button
                    type="button"
                    @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().redo()"
                    class="btn btn-xs join-item"
                    title="Redo (Ctrl+Y)">
                    <span class="iconify lucide--redo size-4" />
                </button>
            </div>
        </div>

        <!-- Editor Content -->
        <EditorContent :editor="editor" />

        <!-- Link Modal -->
        <dialog :open="showLinkModal" class="modal" @click.self="showLinkModal = false">
            <div class="modal-box">
                <h3 class="font-bold text-lg mb-4">Insert Link</h3>
                <div class="form-control">
                    <label class="label">
                        <span class="label-text">URL</span>
                    </label>
                    <input
                        v-model="linkUrl"
                        type="url"
                        placeholder="https://example.com"
                        class="input input-bordered w-full"
                        @keyup.enter="setLink"
                    />
                </div>
                <div class="modal-action">
                    <button type="button" class="btn btn-ghost" @click="showLinkModal = false">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary" @click="setLink">
                        Insert
                    </button>
                </div>
            </div>
            <div class="modal-backdrop" @click="showLinkModal = false"></div>
        </dialog>
    </div>
</template>

<style>
/* TipTap Editor Styles */
.ProseMirror {
    outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: oklch(var(--bc) / 0.4);
    pointer-events: none;
    height: 0;
}

.ProseMirror h1 {
    font-size: 2em;
    font-weight: bold;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.ProseMirror h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.ProseMirror h3 {
    font-size: 1.25em;
    font-weight: bold;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.ProseMirror ul,
.ProseMirror ol {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.ProseMirror ul {
    list-style-type: disc;
}

.ProseMirror ol {
    list-style-type: decimal;
}

.ProseMirror blockquote {
    border-left: 4px solid oklch(var(--p));
    padding-left: 1em;
    margin: 1em 0;
    color: oklch(var(--bc) / 0.7);
}

.ProseMirror code {
    background-color: oklch(var(--b2));
    color: oklch(var(--p));
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-family: ui-monospace, monospace;
}

.ProseMirror pre {
    background-color: oklch(var(--b3));
    padding: 1em;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1em 0;
}

.ProseMirror pre code {
    background: none;
    color: inherit;
    padding: 0;
}

.ProseMirror hr {
    border: none;
    border-top: 2px solid oklch(var(--bc) / 0.2);
    margin: 2em 0;
}

.ProseMirror a {
    color: oklch(var(--p));
    text-decoration: underline;
    cursor: pointer;
}

.ProseMirror a:hover {
    color: oklch(var(--pf));
}
</style>
