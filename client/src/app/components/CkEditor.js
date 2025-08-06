"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CkEditor = ({ editorData, setEditorData, handleOnUpdate }) => {
  return (
    <div className="w-full min-h-[300px] overflow-y-auto overflow-x-hidden">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          toolbar: [
            "undo",
            "redo",
            "|",
            "heading",
            "fontSize",
            "|",
            "bold",
            "italic",
            "link",
            "blockQuote",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "imageUpload",
          ],
          fontSize: {
            options: ["tiny", "small", "default", "big", "huge"],
            supportAllValues: true,
          },
          image: {
            toolbar: [
              "imageTextAlternative",
              "imageStyle:full",
              "imageStyle:side",
            ],
          },
          extraPlugins: [MyCustomUploadAdapterPlugin],
          contentsCss: [
            "body { word-wrap: break-word; overflow-wrap: break-word; }",
          ],
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          handleOnUpdate(data, "description");
        }}
      />
    </div>
  );
};

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (error) => reject(error);
        })
    );
  }

  abort() {}
}

export default CkEditor;
