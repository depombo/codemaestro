'use client'

import LoadingDots from "@/components/ui/LoadingDots";
import { useRef, useState, useEffect } from "react";

export default function Test() {
  const [value, setValue] = useState(
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus, nemo. Doloremque eligendi aliquam repellendus reiciendis doloribus excepturi asperiores quaerat corporis."
  );
  const [docs, setDocs] = useState(["Chat.tsx", "MessageFooter.tsx"]);
  const [displayContextMenu, setDisplayContextMenu] = useState(false);
  const [mentionPos, setMentionPos] = useState<number | null>(null);
  const [query, setQuery] = useState<string>("");
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "@" && textareaRef.current) {
      setDisplayContextMenu(true);
      // ignore @
      setMentionPos(textareaRef.current.selectionStart + 1);
    }
  };

  const onInputChange = async (value: string) => {
    setValue(value);
    if (displayContextMenu && mentionPos) {
      // const textBeforeCursor = value.substring(startPos, endPos);
      // const textAfterMention = value.substring(mentionPos);
      const textAfterMention = value.substring(mentionPos);
      const delta = !textAfterMention.length ? 0 : textAfterMention.split(' ')[0].length;
      const newQuery = value.substring(mentionPos, mentionPos + delta);
      setQuery(newQuery);
      // TODO 
      // setIsLoadingDocs(true)
      // await get docs from db
      // setDocs()
      // setIsLoading(false)
    }
  };

  const handleClose = () => {
    setDisplayContextMenu(false);
    setMentionPos(null);
  };

  const insertText = (text: string) => () => {
    const textarea = textareaRef.current;

    if (textarea && mentionPos) {
      const endPos = textarea.selectionEnd;
      const textBeforeMention = value.substring(0, mentionPos);
      const textAfterCursor = value.substring(endPos);

      const newValue = `${textBeforeMention}${text}${textAfterCursor}`;

      setValue(newValue);
    }

    handleClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <textarea
          className="w-96 h-40 bg-black resize-none border border-gray-300 rounded p-2"
          ref={textareaRef}
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {displayContextMenu && (
          <div
            className="absolute rounded-md bg-white text-black border border-gray-300 shadow px-3 py-2 overflow-y-scroll"
            ref={contextMenuRef}
          >
            {
              isLoadingDocs ? <LoadingDots /> :
                docs
                  .filter(d => d.toLowerCase().includes(query.toLowerCase()))
                  .map(d => <div key={d} className="cursor-pointer hover:bg-zinc-100" onClick={insertText(d)}>
                    {d}
                  </div>)
            }
          </div>
        )}
      </div>
    </div>
  );
}
