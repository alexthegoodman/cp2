import { appWithTranslation, useTranslation } from "next-i18next/pages";
import * as React from "react";
import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import apiClient from "../../../helpers/APIClient";
import FormTextarea from "../../fields/FormTextarea/FormTextarea";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { SmileyIcon } from "@phosphor-icons/react/dist/csr/Smiley";
import { PaperclipIcon } from "@phosphor-icons/react/dist/csr/Paperclip";

import { MessageDictatorProps } from "./MessageDictator.d";

const MessageDictator: React.FC<MessageDictatorProps> = ({
  ref = null,
  className = "",
  onClick = (e) => console.info("Click MessageDictator"),
  author = null,
  threadId = "",
}) => {
  const { t } = useTranslation();
  const [cookies] = useCookies(["coUserToken"]);
  const token = cookies.coUserToken;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  apiClient.setupClient(token);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const currentMessage = getValues("message") || "";
    setValue("message", currentMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (item) => {
        setSelectedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          data: item.target?.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data) => {
    const payload: any = {
      content: data?.message || "",
      threadId: threadId,
    };

    if (selectedFile) {
      payload.fileName = selectedFile.name;
      payload.fileType = selectedFile.type;
      payload.fileSize = selectedFile.size;
      payload.fileData = selectedFile.data;
    }

    if (!payload.content && !payload.fileData) return;

    await apiClient.post("/messages", payload);

    reset();
    setSelectedFile(null);
    setShowEmojiPicker(false);
  };

  const onError = (error) => console.error(error);

  return (
    <section className="messageDictator">
      <div className="messageDictatorInner">
        <form className="form" onSubmit={handleSubmit(onSubmit, onError)}>
          {selectedFile && (
            <div className="filePreview">
              <span className="fileName">{selectedFile.name}</span>
              <button type="button" className="removeFile" onClick={removeFile}>
                <i className="typcn typcn-times"></i>
              </button>
            </div>
          )}
          <div className="dictatorContentWrapper">
            <div className="dictatorContent">
              <FormTextarea
                name="message"
                placeholder={t("updates:typeReply")}
                register={register}
                errors={errors}
                validation={{ required: !selectedFile }}
                aria-label="Dictate Message"
              />
              <div className="contentActions">
                <button
                  type="button"
                  className="actionButton"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add Emoji"
                >
                  <SmileyIcon weight="bold" />
                </button>
                <button
                  type="button"
                  className="actionButton"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach File"
                >
                  <PaperclipIcon weight="bold" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={onFileChange}
                />
              </div>
              {showEmojiPicker && (
                <div className="emojiPickerWrapper">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
          <div className="dictatorControls">
            <button
              className="circleButton"
              type="submit"
              aria-label="Send Message"
            >
              <div className="typcn typcn-chevron-right"></div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MessageDictator;
