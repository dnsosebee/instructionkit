import Image from 'next/image'
const Loading = () => {
  // a cool rotating light logo on slate-900 background
  return (
    <div className='flex flex-col items-center justify-center h-screen prose'>
      <Image
        src='/light.svg'
        className='animate-pulse h-32 w-32 border-t-2 border-b-2 border-gray-900'
        alt='logo'
        width={50}
        height={50}
      />
    </div>
  )
}

export default Loading
