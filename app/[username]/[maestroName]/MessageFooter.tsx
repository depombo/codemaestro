'use client';

import { Message } from '@/app/actions';
import { getBrowserClient } from '@/app/supabase/client';
import { IconBookmark, IconBookmarkFilled } from '@/components/icons';
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

export const MessageFooter = ({ msg }: { msg: Message }) => {
  return (
    <div className="flex flex-row items-start ml-10 mt-2 space-x-1">
      {/* <BookmarkMessage msg={msg} /> */}
    </div>
  )
};