import { cn } from "../lib/utils";
import { MotionValue, motion, useMotionValue, AnimatePresence, useTransform } from "framer-motion";


export default function Nav() {
    
    const links = [
        {
            path: "/",
            name: "Accueil",
        },
        {
            path:"/contact",
            name:"Contact",
        },
        {
            path: "/devis",
            name: "Devis",
        },
        {
            path: "/galerie",
            name: "Galerie",
        },
        {
            path: "/blog",
            name: "Blog",
        },
        {
            path:"",
            name: "Mon Compte",
        },
    ]

    const pathname = window.location.pathname;


    const mapRange = (
        inputLower: number,
        inputUpper: number,
        outputLower: number,
        outputUpper: number
      ) => {
        const INPUT_RANGE = inputUpper - inputLower
        const OUTPUT_RANGE = outputUpper - outputLower
    
        return (value: number) =>
          outputLower + (((value - inputLower) / INPUT_RANGE) * OUTPUT_RANGE || 0)
      }

      const setTransform = (item: HTMLElement & EventTarget,event:React.PointerEvent, x:MotionValue, y: MotionValue) => {
        const bounds = item.getBoundingClientRect();
        const relativeX = event.clientX - bounds.left
        const relativeY = event.clientY - bounds.top
        const xRange = mapRange(0, bounds.width, -1, 1)(relativeX)
        const yRange = mapRange(0, bounds.height, -1, 1)(relativeY)
        x.set(xRange*10)
        y.set(yRange*10)
      }



    return(
        <nav className="p-8 bg-theme-navbg">
            <ul className="flex gap-12">
                <AnimatePresence>
                {links.map(link => {
                    const x = useMotionValue(0);
                    const y = useMotionValue(0);
                    const textX = useTransform(x, (latest) => latest*0.6)
                    const textY = useTransform(y, (latest) => latest*0.6)


                    return(
                        <motion.li  onPointerMove={(event) => {
                            const item = event.currentTarget;
                            setTransform(item, event, x, y)
                        }} key={link.path} onPointerLeave={(event) => {
                            x.set(0)
                            y.set(0)
                        }} style={{x, y}}>
                            <motion.a className={cn("font-medium relative rounded-md text-base py-2 px-4 transition-all duration-500 ease-out hover:bg-theme-100",
                            pathname === link.path ? "bg-theme-navbg" : ""
                            )} href={link.path}>
                                <motion.span style={{x: textX, y: textY}} className="z-10 relative">
                                    {link.name}
                                </motion.span>
                                {pathname === link.path ? (
                                    <motion.div
                                    transition={{ type: "spring" }}
                                    
                                    className="absolute w-full h-full rounded-md left-0 bottom-0 bg-theme-200">

                                    </motion.div> 
                                    ) : null}
                            </motion.a>
                        </motion.li>
                    )
                })}
                </AnimatePresence>
            </ul>
        </nav>
    )
}