import MarketingNav from '../src/components/layout/marketingNav'
import PageRiver from './space/[spaceId]/river/[floemId]'

export default () => {
  return (
    <MarketingNav>
      <main className='h-full'>
        <div className='px-5 bg-slate-900 h-full'>
          <PageRiver spaceId='ws-7q6diWMhLG' floemId='floem-3XAEPqWtYc9rwBRmhMEnR' />
        </div>
      </main>
    </MarketingNav>
  )
}
