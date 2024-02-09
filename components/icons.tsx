// https://github.com/vercel/ai-chatbot/blob/main/components/ui/icons.tsx
// https://www.radix-ui.com/icons

export function IconDoubleCaretSelect({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 15"
      width="15"
      height="15"
      stroke="zinc-700"
      fill="none"
      className={className}
      {...props}
    >
      <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
    </svg>
  )
}

// TODO do all svgs like this
// https://stackoverflow.com/a/64204836
export function IconBookmark({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg className={className} {...props}>
      <path
        d="M3 2.5C3 2.22386 3.22386 2 3.5 2H11.5C11.7761 2 12 2.22386 12 2.5V13.5C12 13.6818 11.9014 13.8492 11.7424 13.9373C11.5834 14.0254 11.3891 14.0203 11.235 13.924L7.5 11.5896L3.765 13.924C3.61087 14.0203 3.41659 14.0254 3.25762 13.9373C3.09864 13.8492 3 13.6818 3 13.5V2.5ZM4 3V12.5979L6.97 10.7416C7.29427 10.539 7.70573 10.539 8.03 10.7416L11 12.5979V3H4Z"
      />
    </svg>
  )
}

export function IconBookmarkFilled({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg className={className} {...props}>
      <path
        d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
      />
    </svg>

  )
}

export function IconClose({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
    </svg>
  )
}

export function IconSeparator({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M16.88 3.549L7.12 20.451"></path>
    </svg>
  )
}

export const GitHub = ({ className = '', ...props }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.50583 0 12.3035C0 17.7478 3.435 22.3463 8.205 23.9765C8.805 24.0842 9.03 23.715 9.03 23.3921C9.03 23.0999 9.015 22.131 9.015 21.1005C6 21.6696 5.22 20.347 4.98 19.6549C4.845 19.3012 4.26 18.2092 3.75 17.917C3.33 17.6863 2.73 17.1173 3.735 17.1019C4.68 17.0865 5.355 17.9939 5.58 18.363C6.66 20.2239 8.385 19.701 9.075 19.3781C9.18 18.5783 9.495 18.04 9.84 17.7325C7.17 17.4249 4.38 16.3637 4.38 11.6576C4.38 10.3196 4.845 9.21227 5.61 8.35102C5.49 8.04343 5.07 6.78232 5.73 5.09058C5.73 5.09058 6.735 4.76762 9.03 6.3517C9.99 6.07487 11.01 5.93645 12.03 5.93645C13.05 5.93645 14.07 6.07487 15.03 6.3517C17.325 4.75224 18.33 5.09058 18.33 5.09058C18.99 6.78232 18.57 8.04343 18.45 8.35102C19.215 9.21227 19.68 10.3042 19.68 11.6576C19.68 16.3791 16.875 17.4249 14.205 17.7325C14.64 18.1169 15.015 18.8552 15.015 20.0086C15.015 21.6542 15 22.9768 15 23.3921C15 23.715 15.225 24.0995 15.825 23.9765C18.2072 23.1519 20.2773 21.5822 21.7438 19.4882C23.2103 17.3942 23.9994 14.8814 24 12.3035C24 5.50583 18.63 0 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const Stripe = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="40"
    x="0px"
    y="0px"
    viewBox="0 0 468 222.5"
    className={className}
    {...props}
  >
    <path className="st0" d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3
      c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z
      M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z"/>
    <path className="st0" d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3
      c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1
      c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z"/>
    <polygon className="st0" points="223.8,61.7 248.9,56.3 248.9,36 223.8,41.3 " />
    <rect x="223.8" y="69.3" className="st0" width="25.1" height="87.5" />
    <path className="st0" d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z" />
    <path className="st0" d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135
      c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z"/>
    <path className="st0" d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6
      C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7
      c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z"/>
  </svg>
);

export const Logo = ({ className = '', ...props }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 56.507 56.507"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path d="M49.036,31.889c0-2.863-2.342-5.451-6.124-7.323c0.092,1.926,0.248,4.054,0.495,6.446l0.022,0.22l-0.096,0.197
			c-0.098,0.206-2.546,5.018-15.217,5.018c-0.432,0-0.781-0.351-0.781-0.781c0-0.023,0.012-0.043,0.014-0.066
			c0.035-0.395,0.353-0.706,0.755-0.713c0.004,0,0.008-0.002,0.012-0.002c0.571,0,1.111-0.013,1.638-0.031
			c8.891-0.323,11.548-3.229,12.069-3.947c-0.267-2.633-0.428-4.968-0.511-7.049c-0.362-9.193,0.838-13.373,1.546-15.831
			c0.627-2.171,0.722-2.506-0.783-4.011c-2.86-2.862-9.015-3.684-12.321-3.919c-0.531-0.037-0.986-0.061-1.347-0.074
			C27.914,0.002,27.608,0,27.558,0v0.006c-3.627-0.031-10.78,0.331-13.904,3.455c-3.843,3.843,1.31,2.876,0.511,20.847
			c-4.107,1.889-6.694,4.582-6.694,7.581c0,5.706,9.305,10.331,20.783,10.331C39.73,42.222,49.036,37.596,49.036,31.889z
			 M14.755,7.653c0.183-0.39,0.645-0.559,1.04-0.375c0.027,0.014,0.69,0.317,1.83,0.708c2.07,0.71,5.727,1.709,10.085,1.806
			c0.666,0.015,1.35,0.008,2.045-0.024c2.704-0.124,5.605-0.636,8.521-1.782c0.546-0.214,1.091-0.444,1.636-0.704
			c0.391-0.188,0.855-0.021,1.042,0.368c0.188,0.389,0.022,0.855-0.367,1.042c-3.718,1.78-7.436,2.522-10.833,2.679
			c-0.485,0.023-0.963,0.033-1.434,0.033c-0.199,0-0.391-0.008-0.585-0.012c-7.017-0.131-12.271-2.54-12.606-2.698
			C14.739,8.507,14.571,8.043,14.755,7.653z"/>
    <path d="M31.009,48.639c-0.387,1.158-1.467,1.998-2.755,1.998c-1.266,0-2.332-0.81-2.735-1.937
			c-3.997-0.385-6.953-1.756-7.035-4.267c-1.515,0.631-2.719,1.77-3.271,3.307c-1.153,3.214,0.97,6.917,4.742,8.27
			c3.263,1.172,6.687,0.198,8.299-2.164c1.612,2.362,5.036,3.336,8.3,2.164c3.771-1.353,5.895-5.056,4.742-8.27
			c-0.615-1.714-2.043-2.935-3.809-3.502c0.002,0.029,0.009,0.059,0.009,0.09C37.495,46.768,34.776,48.171,31.009,48.639z"/>

  </svg>
);

export const Trash = ({ className = '', ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24px"
      height="24px"
      className={className}
      {...props}
    >
      <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 8 9 L 10 9 L 10 20 L 8 20 L 8 9 z M 14 9 L 16 9 L 16 20 L 14 20 L 14 9 z" />
    </svg>
  );
};