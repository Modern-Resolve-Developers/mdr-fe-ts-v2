import { useState } from 'react'
import HomeFooterSection from "@/components/Content/Home/FooterSection";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
  ]

const TermsAndCondition : React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    return (
        <div className="isolate bg-white">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9089FC" />
              <stop offset={1} stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="px-6 pt-6 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8" src="/mdr.png" alt="" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-white px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
      <main>
        <div className="mx-10">
          <div className='my-20 px-6'>
            <h1 className="p-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Terms And Condition
            </h1>
          </div>
          <div className=' p-4'>
            <div className="pl-6 w-auto md:w-3/4">
              <p className="mt-6 text-lg leading-8 text-gray-600">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam vel facere nesciunt inventore doloremque, maxime ducimus eveniet voluptates iste at? Recusandae adipisci, voluptate dolor quas odit quo? Qui consectetur consequatur necessitatibus earum deserunt cumque, harum vel voluptas sit ex accusantium reprehenderit culpa dolore sapiente molestiae voluptatem totam minus libero tempore.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quam vel facere nesciunt inventore doloremque, maxime ducimus eveniet voluptates iste at? Recusandae adipisci, voluptate dolor quas odit quo? Qui consectetur consequatur necessitatibus earum deserunt cumque, harum vel voluptas sit ex accusantium reprehenderit culpa dolore sapiente molestiae voluptatem totam minus libero tempore.
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                1. Information accuracy
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quia ea error vero deserunt tenetur, a eius, soluta eveniet nihil illum mollitia doloribus eaque veniam velit eos ipsam animi et?
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Deleniti quasi harum eius provident tenetur. Aperiam, quod saepe dignissimos, et voluptas, error eius explicabo quasi earum at velit optio totam inventore sit similique placeat quae facere vel voluptatum mollitia sed quo officia fugit? Praesentium voluptatum maiores voluptate dolorum! Perspiciatis, officia a. Ratione magnam praesentium sit harum repellat fuga earum eum tempore.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quia ea error vero deserunt tenetur, a eius, soluta eveniet nihil illum mollitia doloribus eaque veniam velit eos ipsam animi et?
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                2.Terms of sale 
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quia ea error vero deserunt tenetur, a eius, soluta eveniet nihil illum mollitia doloribus eaque veniam velit eos ipsam animi et?
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quia ea error vero deserunt tenetur, a eius, soluta eveniet nihil illum mollitia doloribus eaque veniam velit eos ipsam animi et?
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta quia ea error vero deserunt tenetur, a eius, soluta eveniet nihil illum mollitia doloribus eaque veniam velit eos ipsam animi et?
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                3.Payment terms 
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non voluptatibus, ipsam autem earum, veritatis saepe quo pariatur consequuntur porro dolores iure quae ipsum quis necessitatibus cupiditate perspiciatis excepturi, facere quibusdam sed delectus tenetur omnis? Illum, molestiae! Quam quasi magni omnis animi voluptatem reprehenderit, ut odio dolorem, distinctio impedit dolore beatae ipsum? Fuga veniam, quisquam minus sequi possimus quo quaerat blanditiis debitis suscipit aut sunt corporis quasi facilis eligendi alias sit.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
              The payment terms section of your site should include:
              </p>
              <ul className='px-16 list-disc'>
                <li className='mt-6 text-lg leading-8 text-gray-600'>The payment methods you accept (Visa, Mastercard etc.)</li>
                <li className='mt-6 text-lg leading-8 text-gray-600'>Missed/late payment conditions</li>
                <li className='mt-6 text-lg leading-8 text-gray-600'>How you will handle refunds/returns</li>
                <li className='mt-6 text-lg leading-8 text-gray-600'>How you will handle payment disputes</li>
              </ul>
              <p className="mt-6 text-lg leading-8 text-gray-600">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ad, iusto et ullam ipsum dolorem magnam. Neque dicta dolor voluptate quidem error ea natus animi aut consectetur, eaque eos magni velit eligendi voluptates, voluptatem fuga accusantium officia amet exercitationem numquam minima? Omnis architecto quasi temporibus soluta aliquam quos iusto ad repellat quod nisi deleniti quaerat mollitia consectetur nam provident, pariatur libero animi tenetur, alias deserunt voluptatum dolorem! Praesentium natus tempore autem delectus molestias illum nostrum nesciunt vero, atque fuga maxime doloribus minus aliquam nam! Est veritatis, debitis officia obcaecati nam in similique, alias, qui suscipit consectetur nisi eligendi nulla error consequatur?
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                4. Intellectual property
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Asperiores labore hic, sunt laudantium incidunt sequi sed recusandae consequuntur enim. Doloremque eum libero ad quaerat! Fugit minima deserunt iure necessitatibus soluta reprehenderit amet ab, molestiae officiis vitae inventore, repellat unde asperiores quod iusto facilis! Odio molestiae distinctio autem maxime, ipsa reprehenderit iusto accusantium esse illum dolorum accusamus minus neque facere repellendus quibusdam debitis. Dignissimos aliquid quas quae sint soluta fuga harum velit error, explicabo animi deleniti sunt nesciunt porro, quasi optio dolorum debitis tenetur totam voluptatem assumenda doloribus id. Quas adipisci suscipit in, a error illum vel quo ratione iure laborum.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse praesentium repudiandae, nisi laborum, natus porro hic iste fugiat amet vero ducimus inventore sapiente. Mollitia voluptatem dolor dolorem ad incidunt quas quos eaque odit voluptas voluptates optio sed nesciunt culpa aut inventore blanditiis non error illo, molestias quasi tempora sapiente nisi.
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                5. Disclaimer of liability
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus quibusdam numquam recusandae ipsam labore voluptates reiciendis quas, corporis, consectetur quia repellat minima fuga nihil quam molestiae illum praesentium similique magnam eligendi asperiores! Vitae aspernatur et fuga voluptates molestiae expedita inventore quia itaque ipsam quam neque quod quo explicabo, iste natus perferendis voluptate eveniet fugit reprehenderit accusamus nam. Placeat recusandae pariatur reprehenderit veritatis vel adipisci repellendus deleniti delectus saepe maiores incidunt sequi ex dignissimos laboriosam optio voluptas dolorum quam illum, impedit labore doloribus numquam? Possimus, illo laudantium? Ducimus, expedita dolorem nisi deleniti placeat commodi repellendus enim maxime delectus error reprehenderit perspiciatis sed officiis? Nam itaque laborum odit. Odio recusandae maxime, quidem perferendis maiores magni ut veniam dolore ullam, quis illum facere quisquam, at exercitationem eos. Sed delectus debitis, voluptatibus aspernatur accusamus qui alias quae adipisci, tempora doloribus sunt pariatur illo nostrum quos reprehenderit at laboriosam obcaecati veniam. Nisi quibusdam quos nobis.
              </p>
              <p className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                6. Terms of Use
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus quibusdam numquam recusandae ipsam labore voluptates reiciendis quas, corporis, consectetur quia repellat minima fuga nihil quam molestiae illum praesentium similique magnam eligendi asperiores! Vitae aspernatur et fuga voluptates molestiae expedita inventore quia itaque ipsam quam neque quod quo explicabo, iste natus perferendis voluptate eveniet fugit reprehenderit accusamus nam. Placeat recusandae pariatur reprehenderit veritatis vel adipisci repellendus deleniti delectus saepe maiores incidunt sequi ex dignissimos laboriosam optio voluptas dolorum quam illum, impedit labore doloribus numquam? Possimus, illo laudantium? Ducimus, expedita dolorem nisi deleniti placeat commodi repellendus enim maxime delectus error reprehenderit perspiciatis sed officiis? Nam itaque laborum odit. Odio recusandae maxime, quidem perferendis maiores magni ut veniam dolore ullam, quis illum facere quisquam, at exercitationem eos. Sed delectus debitis, voluptatibus aspernatur accusamus qui alias quae adipisci, tempora doloribus sunt pariatur illo nostrum quos reprehenderit at laboriosam obcaecati veniam. Nisi quibusdam quos nobis.
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur vitae, ipsum facilis autem porro eos doloremque impedit obcaecati praesentium ea commodi aspernatur, assumenda deserunt quasi aliquid. Velit voluptatem autem consequatur minima laboriosam nulla laborum ea quam sint. Quam, error assumenda. Facere perspiciatis totam possimus ratione non laborum, doloremque corrupti eligendi, eos eius explicabo iste libero placeat similique cupiditate recusandae sit enim exercitationem voluptatum quod rerum eveniet alias. Ratione eligendi perspiciatis consequuntur eos a saepe eum dolorem atque in, expedita aut, beatae error enim ex sint, voluptatibus aliquam. Porro eaque adipisci culpa vero, molestias rem reiciendis. Doloribus nulla, facilis cumque consequuntur corrupti numquam quos aperiam illum ex, laboriosam quisquam odit assumenda eius exercitationem. Suscipit aut architecto, quae nesciunt distinctio culpa dolorum inventore voluptates sed id obcaecati necessitatibus eaque et mollitia, fugiat beatae. Perspiciatis iusto aspernatur modi odio atque corporis illum sapiente impedit, accusamus tenetur, laboriosam repellendus. Voluptatem repellat architecto nulla corporis? Quas perferendis optio esse, sed fugiat cumque? Vitae, laboriosam adipisci, est deserunt iure eum accusantium quod, hic ad facilis ipsum rem a. Dolore, harum? Optio tenetur perspiciatis amet. Necessitatibus nam magni nisi aut, esse vel at nostrum odit corporis dignissimos tenetur, inventore ipsam recusandae non laboriosam praesentium blanditiis minima rerum.
              </p>
            </div>
          </div>
        </div>
        <HomeFooterSection />
      </main>
      </div>
    )
}
export default TermsAndCondition
