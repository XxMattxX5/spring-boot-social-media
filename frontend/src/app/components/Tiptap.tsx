"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Select, MenuItem, Grid, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FontSize from "../extensions/FontSize";
import ListIcon from "@mui/icons-material/List";
import { Color } from "@tiptap/extension-color";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { useAuth } from "../hooks/useAuth";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { CldImage, CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadWidgetInfo {
  resource_type: string;
  public_id: string;
  secure_url: string;
}
type Props = {
  contentCallBack: (content: string) => void;
};

const Tiptap = ({ contentCallBack }: Props) => {
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET || "";
  const { settings } = useAuth();
  const theme = settings?.colorTheme || "light";
  const [currentFontSize, setCurrentFontSize] = useState<string>("16px");
  const [currentFontFamily, setCurrentFontFamily] = useState<string>("Arial");

  const cleanHtml = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;

    const removeEmptyTags = (element: HTMLElement) => {
      element.querySelectorAll("*").forEach((child) => {
        if (
          child.tagName.toLowerCase() !== "img" &&
          !child.textContent?.trim() &&
          !child.children.length
        ) {
          child.remove();
        }
      });
    };
    removeEmptyTags(div);

    return div.innerHTML;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Text,
      TextStyle,
      Color,
      FontFamily,
      Image.configure({ inline: true }),
      FontSize.configure({ defaultSize: "16px" }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    onUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      let foundFontSize = "16px";
      editor.state.doc.nodesBetween(from, to, (node) => {
        if (node.marks) {
          node.marks.forEach((mark) => {
            if (mark.type.name === "fontSize" && mark.attrs.size) {
              foundFontSize = mark.attrs.size;
            }
          });
        }
      });
      const html = editor.getHTML();
      const cleanedHTML = cleanHtml(html);

      contentCallBack(cleanedHTML);
      setCurrentFontSize(foundFontSize);
    },
  });

  if (!editor) {
    return null;
  }

  const changeFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
    setCurrentFontSize(size);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    editor.chain().focus().setColor(color).run();
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    editor.chain().focus().setFontFamily(fontFamily).run();
    setCurrentFontFamily(fontFamily);
  };

  function insertImageIntoEditor(imageUrl: string) {
    if (!editor) {
      return;
    }
    editor.commands.insertContent({
      type: "image",
      attrs: {
        src: imageUrl,
        alt: "Uploaded Image",
      },
    });
  }

  return (
    <Grid
      style={{
        width: "100%",
        boxShadow: "0 0 3px #000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid id="editor_toolbar">
        <Select
          id="editor_font_size"
          value={currentFontSize}
          onChange={(e) => changeFontSize(e.target.value as string)}
          displayEmpty
          sx={{ height: 30, color: "inherit" }}
          inputProps={{ "aria-label": "Font Size" }}
        >
          <MenuItem value="8px">8</MenuItem>
          <MenuItem value="9px">9</MenuItem>
          <MenuItem value="10px">10</MenuItem>
          <MenuItem value="11px">11</MenuItem>
          <MenuItem value="12px">12</MenuItem>
          <MenuItem value="14px">14</MenuItem>
          <MenuItem value="16px">16</MenuItem>
          <MenuItem value="18px">18</MenuItem>
          <MenuItem value="20px">20</MenuItem>
          <MenuItem value="22px">22</MenuItem>
          <MenuItem value="24px">24</MenuItem>
          <MenuItem value="26px">26</MenuItem>
          <MenuItem value="28px">28</MenuItem>
          <MenuItem value="36px">36</MenuItem>
          <MenuItem value="42px">42</MenuItem>
        </Select>
        <Select
          value={currentFontFamily}
          id="editor_font_family"
          onChange={(e) => handleFontFamilyChange(e.target.value as string)}
          inputProps={{ "aria-label": "Font Family" }}
          sx={{ height: 30, color: "inherit" }}
        >
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Verdana">Verdana</MenuItem>
          <MenuItem value="Tahoma">Tahoma</MenuItem>
          <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
          <MenuItem value="Lucida Console">Lucida Console</MenuItem>
          <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
          <MenuItem value="Impact">Impact</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
        </Select>
        <Grid id="editor_text_color_box">
          <input
            type="color"
            onChange={handleColorChange}
            value={editor.getAttributes("textStyle").color}
            data-testid="setColor"
            placeholder="fdsfsd"
          />
          <FormatColorTextIcon />
        </Grid>
        <Tooltip title="Bold">
          <Button
            id="editor_bold_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            id="editor_italic_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Bullet List">
          <Button
            id="editor_bullet_list_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ListIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Align Left">
          <Button
            id="editor_align_left_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <FormatAlignLeftIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Align Center">
          <Button
            id="editor_align_center_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <FormatAlignCenterIcon />
          </Button>
        </Tooltip>
        <Tooltip title="Align Right">
          <Button
            id="editor_align_right_btn"
            className="editor_buttons"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <FormatAlignRightIcon />
          </Button>
        </Tooltip>
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            resourceType: "image",
            sources: ["local", "url"],
            maxImageHeight: 1200,
            maxImageWidth: 1200,
          }}
          onSuccess={(result, { widget }) => {
            const info = result.info as CloudinaryUploadWidgetInfo;
            insertImageIntoEditor(info.secure_url);
            widget.close();
          }}
        >
          {({ cloudinary, widget, open }) => {
            return (
              <Tooltip title="Upload Image">
                <Button className="editor_buttons" onClick={() => open()}>
                  <FileUploadIcon />
                </Button>
              </Tooltip>
            );
          }}
        </CldUploadWidget>
      </Grid>
      <EditorContent editor={editor} id="editor_text_box" />
    </Grid>
  );
};

export default Tiptap;
