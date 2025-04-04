import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src='/favicon.png' 
            alt="Application Logo"
            {...props}
            className={` object-scale-down w-10 h-10 ${props.className}`}
        />
    );
}
