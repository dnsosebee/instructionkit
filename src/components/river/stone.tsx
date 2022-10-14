interface StoneProps {
  children: JSX.Element
}

export const Stone = ({ children }: StoneProps) => {
  return <>{children}</>
}

// return (
//   <div className='flex grow justify-center items-center bg-slate-900'>
//     <div
//       className='riffle prose min-w-[400px] m-4 p-6 shadow-2xl bg-white rounded'
//       dangerouslySetInnerHTML={{ __html: flowtext }}
//     ></div>
//   </div>
// )
