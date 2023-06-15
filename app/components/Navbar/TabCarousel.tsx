import { styled } from 'styled-components'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'

// const getData = async () => {
//   const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=468d413c44d12876b4f3a40147ab3946&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1')
// 	console.log(response)
//   return [{}]
// }

// export async function loader() {
//   const data = await getData()
//   console.log(data)
//   return json(data)
// }
async function getPosts() {
	return [
	  {
		slug: 'my-first-post',
		title: 'My First Post',
	  },
	  {
		slug: '90s-mixtape',
		title: 'A Mixtape I Made Just For You',
	  },
	]
  }

  export const loader = async () => {
	return json({
	  posts: await getPosts(),
	})
  }

// const data ={
// 	'resources': [
// 	  {
// 		'title': 'Find me on Twitter',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/any'
// 	  },
// 	  {
// 		'title': 'Welcome to Ark Labs',
// 		'link': 'https://ark-labs.co.uk',
// 		'imageUrl': 'https://placeimg.com/300/300/animals'
// 	  },
// 	  {
// 		'title': 'Some sort of third title',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/architecture'
// 	  },
// 	  {
// 		'title': 'A personal site perhaps?',
// 		'link': 'https://robkendal.co.uk',
// 		'imageUrl': 'https://placeimg.com/300/300/nature'
// 	  },
// 	  {
// 		'title': 'Super item number five',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/people'
// 	  },
// 	  {
// 		'title': 'Super item number six',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/tech'
// 	  },
// 	  {
// 		'title': 'Super item number seven',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/animals'
// 	  },
// 	  {
// 		'title': 'Super item number eight',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/people'
// 	  },
// 	  {
// 		'title': 'Super item number the last',
// 		'link': 'https://twitter.com/kendalmintcode',
// 		'imageUrl': 'https://placeimg.com/300/300/tech'
// 	  }
// 	]
//   }
const TabCarousel = () => {
  const posts = useLoaderData<typeof loader>()
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

  console.log(posts)


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
          <div>Item 2</div>
          <div>Item 3</div>
          <Category>Item 4</Category>
          <div>Item 5</div>
          <div>Item 6</div>
          <div>Item 7</div>
          <div>Item 8</div>
          <div>Item 9</div>
          <div>Item 10</div>
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
/* const ChevronLeft = styled.div``
const ChevronRight = styled.div``
const Categories = styled.div`
  display: flex;
`
` */
const Category = styled.div``
