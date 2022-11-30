export default () => {
  const getResponse = async () => {
    await fetch('/api/replicache/createWorkspace').then(res => console.log(res.json()))
  }
  getResponse()
}

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   // Create authenticated Supabase Client

//   const supabase = createServerSupabaseClient<Database>(ctx)
//   // Check if we have a session
//   const { data: session } = await supabase.auth.getSession()
//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
//   // Check if the user has a profile
// }
