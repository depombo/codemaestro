'use client';

import { Message } from '@/lib/actions';
import { IconBookmark, IconBookmarkFilled, TrashOutline } from '@/components/icons';
import { useState } from 'react';

// const BookmarkMessage = ({ msg }: { msg: Message }) => {
//   const [bookmarked, setBookmarked] = useState(msg.bookmarked);
//   const classes = 'fill-zinc-700 hover:fill-zinc-500 cursor-pointer h-5 w-5';
//   const supabase = getBrowserClient();

//   const onClick = () => {
//     setBookmarked(!bookmarked);
//     supabase
//       .from('messages')
//       .update({ bookmarked: !bookmarked })
//       .eq('id', msg.id)
//       .then(resp => {
//         if (resp.error) console.error(resp.error)
//       })
//   }
//   return (
//     bookmarked ? <IconBookmarkFilled onClick={onClick} className={classes} /> : <IconBookmark onClick={onClick} className={classes} />
//   )
// };

const DeleteMessage = ({ msg, onDelMessage }: { msg: Message, onDelMessage: Function }) => {
  return (
    <TrashOutline
      onClick={() => onDelMessage(msg)}
      className={
        'fill-zinc-700 hover:fill-zinc-500 cursor-pointer size-4 items-center justify center'
      }
    />
  )
};

export const MessageFooter = ({ msg, onDelMessage }: { msg: Message, onDelMessage: Function }) => {
  return (
    <div className="flex flex-row items-start ml-10 mt-3">
      <DeleteMessage msg={msg} onDelMessage={onDelMessage} />
      {/* <BookmarkMessage msg={msg} /> */}
    </div>
  )
};