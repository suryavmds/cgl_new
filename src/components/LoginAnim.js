import React, { useEffect, useRef, useState } from 'react'
import animationData from '../../public/loginanim.json'; 

const LoginAnim = () => {
    const container = useRef(null);
    const [anim, setAnim] = useState(null)

    useEffect(() => {
        let animInstance; // Declare the animation instance variable
    
        if (typeof window !== 'undefined' && !anim) {
            import('lottie-web').then((lottie) => {
                animInstance = lottie.default.loadAnimation({
                    container: container.current,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                });
    
                setAnim(true);
    
                return () => {
                    animInstance.destroy(); // Clean up animation on component unmount
                };
            });
        }
    }, []);
  return (
    <>
    {/* {typeof window !== 'undefined' && (
        <div className='animation' ref={container}></div>
    )} */}

<div className='login_anim'>
    <img className='gif' src='/loginanim2.gif' alt='Login'></img>
    {/* <img className='overlay' src='/cgl_logo.png' alt='Login'></img> */}
</div>
    </>
  )
}

export default LoginAnim