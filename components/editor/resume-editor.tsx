'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Highlighter,
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  Undo,
  Redo,
  Save,
  Settings2,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResumeEditorProps {
  initialContent?: string
  onSave?: (content: string, html: string) => Promise<void>
  onAIAction?: (text: string, action: string) => Promise<string>
  readOnly?: boolean
}

const fonts = [
  { name: 'Default', value: 'Inter, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Mono', value: 'ui-monospace, monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
]

export function ResumeEditor({
  initialContent = '',
  onSave,
  onAIAction,
  readOnly = false,
}: ResumeEditorProps) {
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [margins, setMargins] = useState({ top: 40, right: 40, bottom: 40, left: 40 })
  const [lineHeight, setLineHeight] = useState(1.5)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your resume...',
      }),
      TextStyle,
      FontFamily,
      Color,
    ],
    content: initialContent,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[500px]',
        style: `padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; line-height: ${lineHeight};`,
      },
    },
  })

  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return
    setSaving(true)
    try {
      await onSave(editor.getText(), editor.getHTML())
    } finally {
      setSaving(false)
    }
  }, [editor, onSave])

  const handleAIAction = useCallback(async (action: string) => {
    if (!editor || !onAIAction) return
    
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    
    if (!selectedText) return
    
    setAiLoading(true)
    try {
      const improved = await onAIAction(selectedText, action)
      editor.chain().focus().deleteRange({ from, to }).insertContent(improved).run()
    } finally {
      setAiLoading(false)
    }
  }, [editor, onAIAction])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap items-center gap-1">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2 border-r">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <span className="text-xs">Font</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {fonts.map((font) => (
              <DropdownMenuItem
                key={font.name}
                onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Headings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <span className="text-xs">Style</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('bold') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('italic') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('underline') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('strike') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('highlight') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive({ textAlign: 'left' }) && 'bg-muted')}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive({ textAlign: 'center' }) && 'bg-muted')}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive({ textAlign: 'right' }) && 'bg-muted')}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('bulletList') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', editor.isActive('orderedList') && 'bg-muted')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Page Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Settings2 className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Layout</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Margins (px)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Top/Bottom</Label>
                    <Slider
                      value={[margins.top]}
                      onValueChange={([v]) => setMargins(m => ({ ...m, top: v, bottom: v }))}
                      min={20}
                      max={80}
                      step={5}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Left/Right</Label>
                    <Slider
                      value={[margins.left]}
                      onValueChange={([v]) => setMargins(m => ({ ...m, left: v, right: v }))}
                      min={20}
                      max={80}
                      step={5}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Line Height</Label>
                <Slider
                  value={[lineHeight]}
                  onValueChange={([v]) => setLineHeight(v)}
                  min={1}
                  max={2}
                  step={0.1}
                />
                <span className="text-xs text-muted-foreground">{lineHeight.toFixed(1)}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Save */}
        {onSave && (
          <Button size="sm" className="h-8" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
        )}
      </div>

      {/* Bubble Menu for AI Actions */}
      {editor && onAIAction && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-popover border rounded-lg shadow-lg p-1 flex items-center gap-1"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 gap-1" disabled={aiLoading}>
                {aiLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                <span className="text-xs">AI Enhance</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleAIAction('improve')}>
                Improve Writing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('shorten')}>
                Make Concise
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('expand')}>
                Add Detail
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAIAction('quantify')}>
                Add Metrics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('actionVerbs')}>
                Stronger Action Verbs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction('ats')}>
                Optimize for ATS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <div
        className="bg-white min-h-[700px]"
        style={{
          padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
        }}
      >
        <EditorContent
          editor={editor}
          style={{ lineHeight }}
        />
      </div>
    </div>
  )
}
