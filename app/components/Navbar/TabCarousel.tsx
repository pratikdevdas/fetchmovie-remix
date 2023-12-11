import { styled } from 'styled-components'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import type { loader } from '~/routes/_index'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { NavLink } from '@remix-run/react'

const TabCarousel = ({ url, secUrl }: { url?: string; secUrl?: string }) => {
  const { genres } = useLoaderData<typeof loader>()
  const [searchParam] = useSearchParams()
  const activeGenre = searchParam.get('with_genres')
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 720 },
      items: 6,
      slidesToSlide: 6 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 720, min: 464 },
      items: 5,
      slidesToSlide: 5 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    }
  }

  return (
    <TabWrapper>
      <CategoryWrapper>
        <Carousel
          centerMode={true}
          swipeable={true}
          draggable={false}
          responsive={responsive}
          ssr={true}
          keyBoardControl={true}
          autoPlaySpeed={3000}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          containerClass="react-multi-carousel-list"
        >
          {genres.map((g) => (
            <Category key={g.id}>
              <NavLink
                prefetch="intent"
                to={`${url && secUrl
                    ? `?with_genres=${g.id}&wl=${url}&sid=${secUrl}`
                    : `?with_genres=${g.id}`
                  }`}
              >
                {activeGenre === g.id.toString() ? <span style={{ 'textDecoration': 'underline' }}>{g.name}</span> : <span>{g.name}</span>}

              </NavLink>
            </Category>
          ))}
        </Carousel>
      </CategoryWrapper>
      {/* <FilterButton className="hello">Eladio</FilterButton> */}
    </TabWrapper>
  )
}

export default TabCarousel
const TabWrapper = styled.div`
  overflow-x: hidden;
  align-items: center;
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 14px;
  line-height: 20px; /* 200% */
  font-style: normal;
  font-weight: 500;
  padding: 20px 0px;
`
const CategoryWrapper = styled.div`
  height: 100%;
  width: 100%;
`
// const FilterButton = styled.button`
//   width: 10%;
//   background-color: transparent;
//   cursor: pointer;
//   border-radius: 30px;
//   background: var(--gray-white, #fff);
//   color: var(--gray-black, #010101);
//   text-align: center;
//   padding: 7px 0;
//   font: inherit;
// `
const Category = styled.div``
