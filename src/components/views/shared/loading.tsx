import Logo from './logo'
const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen prose'>
      <Logo
        light={true}
        className='animate-pulse h-32 w-32 border-t-2 border-b-2 border-gray-900'
      />
    </div>
  )
}

export default Loading
