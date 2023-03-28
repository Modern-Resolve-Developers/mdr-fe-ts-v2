import { Carousel } from "react-bootstrap";

export type CarouselImageSourceProps = {
    link : string
    alt: string
    style: React.CSSProperties
    slideTitle: string
    slideParagraph: string
}

export type CarouselProps = {
    imgconfig : CarouselImageSourceProps[]
}

const ControlledCarousel: React.FC<CarouselProps> = (props) => {
    const { imgconfig } = props

    return (
        <Carousel style={{marginTop: '70px'}}>
          {
            imgconfig.length > 0 && imgconfig.map((item : any) => {
                return (
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src={item.link}
                        alt={item.alt}
                        style={item.style}
                        />
                        <Carousel.Caption>
                        <h3>{item.slideTitle}</h3>
                        <p>{item.slideParagraph}.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            })
          }
        </Carousel>
      );
}

export default ControlledCarousel