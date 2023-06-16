import { styled } from 'styled-components'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const TabCarousel = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
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
          renderButtonGroupOutside={true}
          keyBoardControl={true}
          autoPlaySpeed={3000}
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass="custom-dot-list-style"
          itemClass="fsd"
          containerClass="container"
          customTransition="all .7s ease-out"
        >
          <Category>Item 1</Category>
        </Carousel>
      </CategoryWrapper>
      <FilterButton>Eladio</FilterButton>
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
  width: 90%;
`
const FilterButton = styled.button`
  width: 10%;
`
const Category = styled.div``
