import { Typography } from "@mui/material"
import { TermsData } from "./TermsData"

const TermsContent: React.FC = () => {
  return (
    <main>
    <div className="mx-10">
      <div className='my-20 px-6'>
          <Typography className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Terms and Condition
          </Typography>
      </div>
      <div className=' p-4'>
        <div className="pl-6 w-auto md:w-3/4">
          <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam vel facere nesciunt inventore doloremque, maxime ducimus eveniet voluptates iste at? Recusandae adipisci, voluptate dolor quas odit quo? Qui consectetur consequatur necessitatibus earum deserunt cumque, harum vel voluptas sit ex accusantium reprehenderit culpa dolore sapiente molestiae voluptatem totam minus libero tempore.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam vel facere nesciunt inventore doloremque, maxime ducimus eveniet voluptates iste at? Recusandae adipisci, voluptate dolor quas odit quo? Qui consectetur consequatur necessitatibus earum deserunt cumque, harum vel voluptas sit ex accusantium reprehenderit culpa dolore sapiente molestiae voluptatem totam minus libero tempore.
          </p>
          {TermsData.map((term) => (
            <div key={term.title}>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{term.title}</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">{term.text}</p>
              {term.text2 && <p className="mt-6 text-lg leading-8 text-gray-600">{term.text2}</p>}
              {term.text3 && <p className="mt-6 text-lg leading-8 text-gray-600">{term.text3}</p>}
            </div>
          ))}

        </div>
      </div>
    </div>
  </main>
  )
}

export default TermsContent