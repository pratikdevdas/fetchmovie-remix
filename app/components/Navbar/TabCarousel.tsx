import { styled } from 'styled-components'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useLoaderData } from '@remix-run/react'
import type { loader } from '~/routes/_index'

const TabCarousel = () => {
  const genres = useLoaderData<typeof loader>()
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
            <Category key={g.id}>{g.name}</Category>
          ))}
        </Carousel>
      </CategoryWrapper>
      <FilterButton className="hello">Eladio</FilterButton>
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
`
const CategoryWrapper = styled.div`
  height: 100%;
  width: 90%;
`
const FilterButton = styled.button`
  width: 10%;
`
const Category = styled.div``
