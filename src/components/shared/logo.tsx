import Image, { ImageProps } from 'next/image'
export default ({ light, ...props }: { light: boolean } & Partial<ImageProps>) => {
  return (
    <Image
      src={light ? '/IKlight.svg' : '/dark.svg'}
      alt='logo'
      width={50}
      height={50}
      {...props}
    />
  )
}
