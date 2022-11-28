import Image from 'next/image'
export default ({ light }: { light: boolean }) => {
  return light ? (
    <Image
      className='block lg:hidden h-8 w-auto'
      src='/light.svg'
      alt='logo'
      width={50}
      height={50}
    />
  ) : (
    <Image
      className='block lg:hidden h-8 w-auto'
      src='/dark.svg'
      alt='logo'
      width={50}
      height={50}
    />
  )
}
