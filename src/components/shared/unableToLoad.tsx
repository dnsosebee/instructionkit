export default ({ reason }: { reason: string }) => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold text-white'>Content unable to load. Reason: {reason}</h1>
    </div>
  )
}
