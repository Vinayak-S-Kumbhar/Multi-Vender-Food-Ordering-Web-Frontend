import style from "./cssFolder/Hero.module.css";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <>
      <section className={style.hero}>
        {/* Background Video */}
        <video
          className={style.heroVideo}
          src={assets.HeroVideo}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark overlay */}
        <div className={style.heroOverlay}></div>

        {/* Content */}
        <div className={style.heroContent}>
          <h1>
            Order your <br /> favourite food here
          </h1>
          <p>
            Choose from a diverse menu featuring a delectable array of dishes
            crafted with the finest ingredients.
          </p>
        </div>
      </section>
    </>
  );
};
export default Hero;
