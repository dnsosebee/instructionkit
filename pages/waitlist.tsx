import Link from 'next/link'
import { useState } from 'react'
import MarketingNav from '../src/components/views/marketing/layout/marketingNav'
import { validateEmail } from '../src/lib/validation'

enum State {
  Pending,
  SubmittedEmail,
  SubmittedExtraInfo,
}

export default () => {
  const [state, setState] = useState<State>(State.Pending)
  const [email, setEmail] = useState('')

  const handleSubmit1 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = e.currentTarget['email'].value

    // validate
    if (!email || !validateEmail(email)) {
      alert('Please enter a valid email address')
      return
    }

    setEmail(email)

    // post to the waitlist1 api endpoint
    const response = await fetch('/api/waitlist1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (response.status === 200) {
      const { alreadyProvidedInfo } = await response.json()
      if (alreadyProvidedInfo) {
        setState(State.SubmittedExtraInfo)
      } else {
        setState(State.SubmittedEmail)
      }
    } else {
      alert('Error submitting email')
    }
  }

  const handleSubmit2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const company_website = e.currentTarget['company-website'].value || ''
    const company_size = e.currentTarget['company-size'].value || 'unspecified'
    const title = e.currentTarget['job-title'].value || ''
    const how_did_you_hear = e.currentTarget['how-did-you-hear'].value || ''
    const name = e.currentTarget['full-name'].value || ''

    // post to the waitlist2 api endpoint
    const response = await fetch('/api/waitlist2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        company_website,
        company_size,
        title,
        how_did_you_hear,
        name,
      }),
    })
    if (response.status === 200) {
      setState(State.SubmittedExtraInfo)
    }
  }

  return (
    <MarketingNav>
      <div className='self-center container'>
        <div className='flex min-h-full items-center justify-center px-4 sm:px-6 lg:px-8'>
          {state === State.Pending ? (
            <div className='w-full max-w-md space-y-8'>
              <div>
                {/* <Image
                  className='mx-auto h-12 w-auto'
                  src='/light.svg'
                  alt='logo'
                  width={50}
                  height={50}
                  priority
                /> */}
                <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-white'>
                  Join our waitlist
                </h2>
              </div>
              <form className='mt-8 space-y-6' onSubmit={handleSubmit1}>
                <div className='-space-y-px rounded-md shadow-sm'>
                  <div>
                    <label htmlFor='email-address' className='sr-only'>
                      Email address
                    </label>
                    <input
                      id='email-address'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      placeholder='Email address'
                    />
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='text-sm'>
                    <Link href='/app' className='font-medium text-indigo-600 hover:text-indigo-500'>
                      Already have an account?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Join the waitlist
                  </button>
                </div>
              </form>
            </div>
          ) : state === State.SubmittedEmail ? (
            <div className='p-6'>
              <form className='space-y-8 divide-y divide-gray-700' onSubmit={handleSubmit2}>
                <div className='space-y-8 divide-y divide-gray-700 sm:space-y-5'>
                  <div className='space-y-6 pt-8 sm:space-y-5 sm:pt-10'>
                    <div>
                      <h3 className='text-3xl mb-6 font-medium leading-6 text-white'>
                        You're on the waitlist!
                      </h3>
                      <p className='mt-1 max-w-2xl text-sm text-gray-300'>
                        {`We'll be in touch. If you'd like to get off the waitlist sooner, please
                        provide some additional information (all optional).`}
                      </p>
                    </div>

                    <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
                      <label
                        htmlFor='full-name'
                        className='block text-sm font-medium text-gray-300 sm:mt-px sm:pt-2'
                      >
                        Your full name
                      </label>
                      <div className='mt-1 sm:col-span-2 sm:mt-0'>
                        <input
                          type='text'
                          name='full-name'
                          id='full-name'
                          autoComplete='full-name'
                          className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                        />
                      </div>
                    </div>
                    <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
                      <label
                        htmlFor='company-website'
                        className='block text-sm font-medium text-gray-300 sm:mt-px sm:pt-2'
                      >
                        Company website
                      </label>
                      <div className='mt-1 sm:col-span-2 sm:mt-0'>
                        <input
                          type='text'
                          name='company-website'
                          id='company-website'
                          autoComplete='company-website'
                          className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                          placeholder='https://'
                        />
                      </div>
                    </div>

                    <div className='pt-6 sm:pt-5'>
                      <div role='group' aria-labelledby='label-company-size'>
                        <div className='sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4'>
                          <div>
                            <div
                              className='text-base font-medium text-gray-900 sm:text-sm sm:text-gray-300'
                              id='label-company-size'
                            >
                              Company size
                            </div>
                          </div>
                          <div className='sm:col-span-2'>
                            <div className='max-w-lg'>
                              {/* <p className="text-sm text-gray-500">These are delivered via SMS to your mobile phone.</p> */}
                              <div className='mt-4 space-y-4'>
                                <div className='flex items-center'>
                                  <input
                                    id='1-5'
                                    name='company-size'
                                    type='radio'
                                    value='1 - 5 employees'
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                  />
                                  <label
                                    htmlFor='1-5'
                                    className='ml-3 block text-sm font-medium text-gray-300'
                                  >
                                    1-5 employees
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='6-20'
                                    name='company-size'
                                    type='radio'
                                    value='6 - 20 employees'
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                  />
                                  <label
                                    htmlFor='6-20'
                                    className='ml-3 block text-sm font-medium text-gray-300'
                                  >
                                    6-20 employees
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='21-50'
                                    name='company-size'
                                    type='radio'
                                    value='21 - 50 employees'
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                  />
                                  <label
                                    htmlFor='21-50'
                                    className='ml-3 block text-sm font-medium text-gray-300'
                                  >
                                    21-50 employees
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='51-200'
                                    name='company-size'
                                    type='radio'
                                    value='51 - 200 employees'
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                  />
                                  <label
                                    htmlFor='51-200'
                                    className='ml-3 block text-sm font-medium text-gray-300'
                                  >
                                    51-200 employees
                                  </label>
                                </div>
                                <div className='flex items-center'>
                                  <input
                                    id='200+'
                                    name='company-size'
                                    type='radio'
                                    value='200+ employees'
                                    className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                                  />
                                  <label
                                    htmlFor='200+'
                                    className='ml-3 block text-sm font-medium text-gray-300'
                                  >
                                    200+ employees
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5'>
                      <label
                        htmlFor='job-title'
                        className='block text-sm font-medium text-gray-300 sm:mt-px sm:pt-2'
                      >
                        Your title
                      </label>
                      <div className='mt-1 sm:col-span-2 sm:mt-0'>
                        <input
                          type='text'
                          name='job-title'
                          id='job-title'
                          autoComplete='job-title'
                          className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                          placeholder='e.g. Designer'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-700 sm:pt-5'>
                  <label
                    htmlFor='how-did-you-hear'
                    className='block text-sm font-medium text-gray-300 sm:mt-px sm:pt-2'
                  >
                    What kind of guides are you trying to create?
                  </label>
                  <div className='mt-1 sm:col-span-2 sm:mt-0'>
                    <input
                      type='text'
                      name='how-did-you-hear'
                      id='how-did-you-hear'
                      autoComplete='how-did-you-hear'
                      className='block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm'
                      placeholder='e.g. How to create the perfect pizza, etc.'
                    />
                  </div>
                </div>

                <div className='pt-5'>
                  <div className='flex justify-end'>
                    <button
                      type='submit'
                      className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className='h-full p-6'>
              <h1 className='text-3xl font-bold leading-9 text-white'>Thank you!</h1>
              <p className='mt-4 text-lg leading-6 text-gray-300'>We'll get in touch soon.</p>
            </div>
          )}
        </div>
      </div>
    </MarketingNav>
  )
}
