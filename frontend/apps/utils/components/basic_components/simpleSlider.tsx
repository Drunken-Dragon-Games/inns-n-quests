import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SimpleSlider{
  children: JSX.Element [] | JSX.Element
}

const SimpleSlider = ({children}: SimpleSlider ): JSX.Element => {
 
    const settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
    };

    return (
        <Slider {...settings}>{children}</Slider>
    );
}

export default SimpleSlider

