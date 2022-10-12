import { FC } from 'react'

interface IconButtonProps {
  Icon: FC<React.HTMLAttributes<SVGElement>>
  onClick: () => void
  title: string
  disabled?: boolean
}

// uses tailwindui
export const IconButton = ({ Icon, onClick, title, disabled = false }: IconButtonProps) => {
  return (
    <button
      disabled={disabled}
      type='button'
      onClick={onClick}
      className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
        disabled ? 'text-gray-300' : 'text-gray-500'
      } hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
    >
      <Icon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
      {title}
    </button>
  )
}
