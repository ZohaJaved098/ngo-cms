"use client";
import { Button } from "@/app/components/Button";
import { useState } from "react";
import { InputField } from "@/app/components/InputField";
import { useRouter } from "next/navigation";
import CkEditor from "@/app/components/CkEditor";
// import TextEditor from "@/app/components/TextEditor";
// type Page = {
//   _id: string;
//   title: string;
//   slug: string;
//   content: string;
//   status: string;
// };
const CreatePage = () => {
  //   const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const onContentChange = (editor: string, field: string): void => {
    if (field === "description") {
      console.log("Editor data field:", editor);
      setContent(editor);
    }
  };
  const onChangeFunction = () => {
    console.log("OnChange");
  };

  const onCreateClick = () => {};
  const onCancelClick = () => {
    router.push("/dashboard/pages");
  };
  return (
    <div className="w-4/5 mt-10 m-auto h-full flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Create a page</h1>
      <form method="POST" className="flex flex-col gap-5">
        <div className="flex justify-between items-start gap-5 w-full">
          <InputField
            label="Title"
            name="title"
            value={""}
            type="text"
            placeholder="About Us"
            onChange={onChangeFunction}
          />
          <div className="flex flex-col">
            <InputField
              label="Slug"
              name="slug"
              value=""
              type="text"
              placeholder="/about-us"
              onChange={onChangeFunction}
            />
            <p className="text-sm text-gray-500">
              Slugs must start with / and can have letters, numbers and -
              (dash). No other character would be acceptable.
            </p>
          </div>
        </div>
        <hr className="w-full" />
        <div>
          <p>Editor here</p>
          <CkEditor
            editorData={content}
            setEditorData={setContent}
            handleOnUpdate={onContentChange}
          />
        </div>
        <div>
          Just Checking
          <div
            className="text-black"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="flex items-center justify-between ">
          <Button
            type="button"
            btnText="Create Page"
            onClickFunction={onCreateClick}
            tertiary={true}
            className="max-w-32"
          />
          <Button
            type="button"
            btnText="Cancel"
            primary={true}
            onClickFunction={onCancelClick}
            className="max-w-32"
          />
        </div>
      </form>
    </div>
  );
};

export default CreatePage;
