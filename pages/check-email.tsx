import MarketingNav from '../src/components/layout/marketingNav'

export default () => {
  return (
    <MarketingNav>
      <div className='self-center p-6 flex justify-center'>
        <div className='flex flex-col justify-center max-w-7xl prose'>
          <h1 className='text-white'>Check your email</h1>
          <p className='text-white'>
            We've sent you an email with a link to sign in. If you don't see it, check your spam
            folder.
          </p>
        </div>
      </div>
    </MarketingNav>
  )
}
