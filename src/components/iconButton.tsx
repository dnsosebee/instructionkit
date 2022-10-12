import { FC } from 'react'

// uses tailwindui
export const IconButton = ({
  Icon,
  onClick,
  title,
}: {
  Icon: FC<React.HTMLAttributes<SVGElement>>
  onClick: () => void
  title: string
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
    >
      <Icon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
      {title}
    </button>
  )
}
