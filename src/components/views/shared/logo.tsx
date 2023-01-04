import Image, { ImageProps } from 'next/image'
const Logo = ({ light, ...props }: { light: boolean } & Partial<ImageProps>) => {
  return (
    <Image src={light ? '/light.svg' : '/dark.svg'} alt='logo' width={50} height={50} {...props} />
  )
}

export default Logo
